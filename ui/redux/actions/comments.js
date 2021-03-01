// @flow
import * as ACTIONS from 'constants/action_types';
import * as REACTION_TYPES from 'constants/reactions';
import { BANNED_LIVESTREAM_WORDS } from 'constants/comment';
import { Lbry, selectClaimsByUri } from 'lbry-redux';
import { doToast, doSeeNotifications } from 'redux/actions/notifications';
import {
  makeSelectCommentIdsForUri,
  makeSelectMyReactionsForComment,
  makeSelectOthersReactionsForComment,
  selectPendingCommentReacts,
} from 'redux/selectors/comments';
import { makeSelectNotificationForCommentId } from 'redux/selectors/notifications';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import { toHex } from 'util/hex';
import Comments from 'comments';

export function doCommentList(uri: string, page: number = 1, pageSize: number = 99999) {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const claim = selectClaimsByUri(state)[uri];
    const claimId = claim ? claim.claim_id : null;

    if (!claimId) {
      dispatch({
        type: ACTIONS.COMMENT_LIST_FAILED,
        data: 'unable to find claim for uri',
      });

      return;
    }

    dispatch({
      type: ACTIONS.COMMENT_LIST_STARTED,
    });

    return Comments.comment_list({
      page,
      claim_id: claimId,
      page_size: pageSize,
    })
      .then((result: CommentListResponse) => {
        const { items: comments } = result;
        dispatch({
          type: ACTIONS.COMMENT_LIST_COMPLETED,
          data: {
            comments,
            claimId: claimId,
            uri: uri,
          },
        });
        return result;
      })
      .catch((error) => {
        dispatch({
          type: ACTIONS.COMMENT_LIST_FAILED,
          data: error,
        });
      });
  };
}

export function doCommentReactList(uri: string | null, commentId?: string) {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const activeChannelClaim = selectActiveChannelClaim(state);
    const commentIds = uri ? makeSelectCommentIdsForUri(uri)(state) : [commentId];

    dispatch({
      type: ACTIONS.COMMENT_REACTION_LIST_STARTED,
    });

    const params: { comment_ids: string, channel_name?: string, channel_id?: string } = {
      comment_ids: commentIds.join(','),
    };

    if (activeChannelClaim) {
      params['channel_name'] = activeChannelClaim.name;
      params['channel_id'] = activeChannelClaim.claim_id;
    }

    return Lbry.comment_react_list(params)
      .then((result: CommentReactListResponse) => {
        const { my_reactions: myReactions, others_reactions: othersReactions } = result;
        dispatch({
          type: ACTIONS.COMMENT_REACTION_LIST_COMPLETED,
          data: {
            myReactions: myReactions || {},
            othersReactions,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: ACTIONS.COMMENT_REACTION_LIST_FAILED,
          data: error,
        });
      });
  };
}

export function doCommentReact(commentId: string, type: string) {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const activeChannelClaim = selectActiveChannelClaim(state);
    const pendingReacts = selectPendingCommentReacts(state);
    const notification = makeSelectNotificationForCommentId(commentId)(state);

    if (!activeChannelClaim) {
      console.error('Unable to react to comment. No activeChannel is set.'); // eslint-disable-line
      return;
    }

    if (notification && !notification.is_seen) {
      dispatch(doSeeNotifications([notification.id]));
    }

    const exclusiveTypes = {
      [REACTION_TYPES.LIKE]: REACTION_TYPES.DISLIKE,
      [REACTION_TYPES.DISLIKE]: REACTION_TYPES.LIKE,
    };

    if (pendingReacts.includes(commentId + exclusiveTypes[type]) || pendingReacts.includes(commentId + type)) {
      // ignore dislikes during likes, for example
      return;
    }

    let myReacts = makeSelectMyReactionsForComment(commentId)(state);
    const othersReacts = makeSelectOthersReactionsForComment(commentId)(state);
    const params: CommentReactParams = {
      comment_ids: commentId,
      channel_name: activeChannelClaim.name,
      channel_id: activeChannelClaim.claim_id,
      react_type: type,
    };

    if (myReacts.includes(type)) {
      params['remove'] = true;
      myReacts.splice(myReacts.indexOf(type), 1);
    } else {
      myReacts.push(type);
      if (Object.keys(exclusiveTypes).includes(type)) {
        params['clear_types'] = exclusiveTypes[type];
        if (myReacts.indexOf(exclusiveTypes[type]) !== -1) {
          myReacts.splice(myReacts.indexOf(exclusiveTypes[type]), 1);
        }
      }
    }
    dispatch({
      type: ACTIONS.COMMENT_REACT_STARTED,
      data: commentId + type,
    });

    // simulate api return shape: ['like'] -> { 'like': 1 }
    const myReactsObj = myReacts.reduce((acc, el) => {
      acc[el] = 1;
      return acc;
    }, {});

    dispatch({
      type: ACTIONS.COMMENT_REACTION_LIST_COMPLETED,
      data: {
        myReactions: { [commentId]: myReactsObj },
        othersReactions: { [commentId]: othersReacts },
      },
    });

    Lbry.comment_react(params)
      .then((result: CommentReactListResponse) => {
        dispatch({
          type: ACTIONS.COMMENT_REACT_COMPLETED,
          data: commentId + type,
        });
      })
      .catch((error) => {
        dispatch({
          type: ACTIONS.COMMENT_REACT_FAILED,
          data: commentId + type,
        });

        const myRevertedReactsObj = myReacts
          .filter((el) => el !== type)
          .reduce((acc, el) => {
            acc[el] = 1;
            return acc;
          }, {});

        dispatch({
          type: ACTIONS.COMMENT_REACTION_LIST_COMPLETED,
          data: {
            myReactions: { [commentId]: myRevertedReactsObj },
            othersReactions: { [commentId]: othersReacts },
          },
        });
      });
  };
}

export function doCommentCreate(
  comment: string = '',
  claim_id: string = '',
  parent_id?: string,
  uri: string,
  checkBannedWords: boolean = false
) {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const activeChannelClaim = selectActiveChannelClaim(state);

    if (!activeChannelClaim) {
      console.error('Unable to create comment. No activeChannel is set.'); // eslint-disable-line
      return;
    }

    dispatch({
      type: ACTIONS.COMMENT_CREATE_STARTED,
    });

    if (checkBannedWords) {
      const strippedCommentText = comment.trim().toLowerCase().replace(/\s/g, '');
      for (var i = 0; i < BANNED_LIVESTREAM_WORDS.length; i++) {
        const bannedWord = BANNED_LIVESTREAM_WORDS[i];
        if (strippedCommentText.includes(bannedWord)) {
          dispatch({
            type: ACTIONS.COMMENT_CREATE_FAILED,
          });

          dispatch(
            doToast({
              message: 'Unable to create comment.',
              isError: true,
            })
          );

          return;
        }
      }
    }

    if (parent_id) {
      const notification = makeSelectNotificationForCommentId(parent_id)(state);
      if (notification && !notification.is_seen) {
        dispatch(doSeeNotifications([notification.id]));
      }
    }

    return Lbry.comment_create({
      comment: comment,
      claim_id: claim_id,
      channel_id: activeChannelClaim.claim_id,
      parent_id: parent_id,
    })
      .then((result: CommentCreateResponse) => {
        dispatch({
          type: ACTIONS.COMMENT_CREATE_COMPLETED,
          data: {
            uri,
            comment: result,
            claimId: claim_id,
          },
        });
        return result;
      })
      .catch((error) => {
        dispatch({
          type: ACTIONS.COMMENT_CREATE_FAILED,
          data: error,
        });
        dispatch(
          doToast({
            message: 'Unable to create comment, please try again later.',
            isError: true,
          })
        );
      });
  };
}

export function doCommentPin(commentId: string, remove: boolean) {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const activeChannel = selectActiveChannelClaim(state);

    if (!activeChannel) {
      console.error('Unable to pin comment. No activeChannel is set.'); // eslint-disable-line
      return;
    }

    dispatch({
      type: ACTIONS.COMMENT_PIN_STARTED,
    });

    return Lbry.comment_pin({
      comment_id: commentId,
      channel_name: activeChannel.name,
      channel_id: activeChannel.claim_id,
      ...(remove ? { remove: true } : {}),
    })
      .then((result: CommentPinResponse) => {
        dispatch({
          type: ACTIONS.COMMENT_PIN_COMPLETED,
          data: result,
        });
      })
      .catch((error) => {
        dispatch({
          type: ACTIONS.COMMENT_PIN_FAILED,
          data: error,
        });
        dispatch(
          doToast({
            message: 'Unable to pin this comment, please try again later.',
            isError: true,
          })
        );
      });
  };
}

export function doCommentAbandon(commentId: string, creatorChannelUri?: string) {
  return async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const claim = creatorChannelUri ? selectClaimsByUri(state)[creatorChannelUri] : undefined;
    const creatorChannelId = claim ? claim.claim_id : null;
    const creatorChannelName = claim ? claim.name : null;
    const activeChannelClaim = selectActiveChannelClaim(state);

    dispatch({
      type: ACTIONS.COMMENT_ABANDON_STARTED,
    });

    let commentIdSignature;
    if (activeChannelClaim) {
      try {
        commentIdSignature = await Lbry.channel_sign({
          channel_id: activeChannelClaim.claim_id,
          hexdata: toHex(commentId),
        });
      } catch (e) {}
    }

    return Comments.comment_abandon({
      comment_id: commentId,
      ...(creatorChannelId ? { creator_channel_id: creatorChannelId } : {}),
      ...(creatorChannelName ? { creator_channel_name: creatorChannelName } : {}),
      ...(commentIdSignature || {}),
    })
      .then((result: CommentAbandonResponse) => {
        // Comment may not be deleted if the signing channel can't be signed.
        // This will happen if the channel was recently created or abandoned.
        if (result.abandoned) {
          dispatch({
            type: ACTIONS.COMMENT_ABANDON_COMPLETED,
            data: {
              comment_id: commentId,
            },
          });
        } else {
          dispatch({
            type: ACTIONS.COMMENT_ABANDON_FAILED,
          });
          dispatch(
            doToast({
              message: 'Your channel is still being setup, try again in a few moments.',
              isError: true,
            })
          );
        }
      })
      .catch((error) => {
        dispatch({
          type: ACTIONS.COMMENT_ABANDON_FAILED,
          data: error,
        });

        dispatch(
          doToast({
            message: 'Unable to delete this comment, please try again later.',
            isError: true,
          })
        );
      });
  };
}

export function doCommentUpdate(comment_id: string, comment: string) {
  // if they provided an empty string, they must have wanted to abandon
  if (comment === '') {
    return doCommentAbandon(comment_id);
  } else {
    return (dispatch: Dispatch) => {
      dispatch({
        type: ACTIONS.COMMENT_UPDATE_STARTED,
      });
      return Lbry.comment_update({
        comment_id: comment_id,
        comment: comment,
      })
        .then((result: CommentUpdateResponse) => {
          if (result != null) {
            dispatch({
              type: ACTIONS.COMMENT_UPDATE_COMPLETED,
              data: {
                comment: result,
              },
            });
          } else {
            // the result will return null
            dispatch({
              type: ACTIONS.COMMENT_UPDATE_FAILED,
            });
            dispatch(
              doToast({
                message: 'Your channel is still being setup, try again in a few moments.',
                isError: true,
              })
            );
          }
        })
        .catch((error) => {
          dispatch({
            type: ACTIONS.COMMENT_UPDATE_FAILED,
            data: error,
          });
          dispatch(
            doToast({
              message: 'Unable to edit this comment, please try again later.',
              isError: true,
            })
          );
        });
    };
  }
}

// Hides a users comments from all creator's claims and prevent them from commenting in the future
export function doCommentModBlock(commentAuthor: string) {
  return async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const claim = selectClaimsByUri(state)[commentAuthor];

    if (!claim) {
      console.error("Can't find claim to block"); // eslint-disable-line
      return;
    }

    const creatorIdToBan = claim ? claim.claim_id : null;
    const creatorNameToBan = claim ? claim.name : null;
    const activeChannelClaim = selectActiveChannelClaim(state);

    let channelSignature = {};
    if (activeChannelClaim) {
      try {
        channelSignature = await Lbry.channel_sign({
          channel_id: activeChannelClaim.claim_id,
          hexdata: toHex(activeChannelClaim.name),
        });
      } catch (e) {}
    }

    return Comments.moderation_block({
      mod_channel_id: activeChannelClaim.claim_id,
      mod_channel_name: activeChannelClaim.name,
      signature: channelSignature.signature,
      signing_ts: channelSignature.signing_ts,
      banned_channel_id: creatorIdToBan,
      banned_channel_name: creatorNameToBan,
      delete_all: true,
    });
  };
}
