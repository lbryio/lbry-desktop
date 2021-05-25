// @flow
import * as ACTIONS from 'constants/action_types';
import * as REACTION_TYPES from 'constants/reactions';
import { BLOCK_LEVEL } from 'constants/comment';
import { Lbry, parseURI, buildURI, selectClaimsById, selectClaimsByUri, selectMyChannelClaims } from 'lbry-redux';
import { doToast, doSeeNotifications } from 'redux/actions/notifications';
import {
  makeSelectCommentIdsForUri,
  makeSelectMyReactionsForComment,
  makeSelectOthersReactionsForComment,
  selectPendingCommentReacts,
  selectModerationBlockList,
  selectModerationDelegatorsById,
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

    // Adding 'channel_id' and 'channel_name' enables "CreatorSettings > commentsEnabled".
    const authorChannelClaim = claim.value_type === 'channel' ? claim : claim.signing_channel;

    return Comments.comment_list({
      page,
      claim_id: claimId,
      page_size: pageSize,
      channel_id: authorChannelClaim ? authorChannelClaim.claim_id : undefined,
      channel_name: authorChannelClaim ? authorChannelClaim.name : undefined,
    })
      .then((result: CommentListResponse) => {
        const { items: comments } = result;
        dispatch({
          type: ACTIONS.COMMENT_LIST_COMPLETED,
          data: {
            comments,
            claimId: claimId,
            authorClaimId: authorChannelClaim ? authorChannelClaim.claim_id : undefined,
            uri: uri,
          },
        });
        return result;
      })
      .catch((error) => {
        if (error.message === 'comments are disabled by the creator') {
          dispatch({
            type: ACTIONS.COMMENT_LIST_COMPLETED,
            data: {
              authorClaimId: authorChannelClaim ? authorChannelClaim.claim_id : undefined,
              disabled: true,
            },
          });
        } else {
          dispatch({
            type: ACTIONS.COMMENT_LIST_FAILED,
            data: error,
          });
        }
      });
  };
}

export function doSuperChatList(uri: string) {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const claim = selectClaimsByUri(state)[uri];
    const claimId = claim ? claim.claim_id : null;

    if (!claimId) {
      console.error('No claimId found for uri: ', uri); //eslint-disable-line
      return;
    }

    dispatch({
      type: ACTIONS.COMMENT_SUPER_CHAT_LIST_STARTED,
    });

    return Comments.super_list({
      claim_id: claimId,
    })
      .then((result: CommentListResponse) => {
        const { items: comments, total_amount: totalAmount } = result;
        dispatch({
          type: ACTIONS.COMMENT_SUPER_CHAT_LIST_COMPLETED,
          data: {
            comments,
            totalAmount,
            uri: uri,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: ACTIONS.COMMENT_SUPER_CHAT_LIST_FAILED,
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
  livestream?: boolean = false,
  txid?: string
) {
  return async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const activeChannelClaim = selectActiveChannelClaim(state);

    if (!activeChannelClaim) {
      console.error('Unable to create comment. No activeChannel is set.'); // eslint-disable-line
      return;
    }

    dispatch({
      type: ACTIONS.COMMENT_CREATE_STARTED,
    });

    let signatureData;
    if (activeChannelClaim) {
      try {
        signatureData = await Lbry.channel_sign({
          channel_id: activeChannelClaim.claim_id,
          hexdata: toHex(comment),
        });
      } catch (e) {}
    }

    if (parent_id) {
      const notification = makeSelectNotificationForCommentId(parent_id)(state);
      if (notification && !notification.is_seen) {
        dispatch(doSeeNotifications([notification.id]));
      }
    }

    if (!signatureData) {
      return dispatch(doToast({ isError: true, message: __('Unable to verify your channel. Please try again.') }));
    }

    return Comments.comment_create({
      comment: comment,
      claim_id: claim_id,
      channel_id: activeChannelClaim.claim_id,
      channel_name: activeChannelClaim.name,
      parent_id: parent_id,
      signature: signatureData.signature,
      signing_ts: signatureData.signing_ts,
      ...(txid ? { support_tx_id: txid } : {}),
    })
      .then((result: CommentCreateResponse) => {
        dispatch({
          type: ACTIONS.COMMENT_CREATE_COMPLETED,
          data: {
            uri,
            livestream,
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

        let toastMessage = __('Unable to create comment, please try again later.');
        if (error && error.message === 'channel is blocked by publisher') {
          toastMessage = __('Unable to comment. This channel has blocked you.');
        }

        if (error) {
          const BLOCKED_WORDS_ERR_MSG = 'the comment contents are blocked by';

          if (error.message === 'channel is blocked by publisher') {
            toastMessage = __('Unable to comment. This channel has blocked you.');
          } else if (error.message.startsWith(BLOCKED_WORDS_ERR_MSG)) {
            const channelName = error.message.substring(BLOCKED_WORDS_ERR_MSG.length);
            toastMessage = __('The comment contains contents that are blocked by %author%', { author: channelName });
          }
        }

        dispatch(
          doToast({
            message: toastMessage,
            isError: true,
          })
        );

        return Promise.reject(error);
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

async function channelSignName(channelClaimId: string, channelName: string) {
  let signedObject;

  try {
    signedObject = await Lbry.channel_sign({
      channel_id: channelClaimId,
      hexdata: toHex(channelName),
    });

    signedObject['claim_id'] = channelClaimId;
    signedObject['name'] = channelName;
  } catch (e) {}

  return signedObject;
}

// Hides a users comments from all creator's claims and prevent them from commenting in the future
function doCommentModToggleBlock(
  unblock: boolean,
  commenterUri: string,
  creatorId: string,
  blockerIds: Array<string>, // [] = use all my channels
  blockLevel: string,
  showLink: boolean = false
) {
  return async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();

    let blockerChannelClaims = selectMyChannelClaims(state);
    if (blockerIds.length === 0) {
      // Specific blockers not provided, so find one based on block-level.
      switch (blockLevel) {
        case BLOCK_LEVEL.MODERATOR:
          {
            // Find the first channel that is a moderator for 'creatorId'.
            const delegatorsById = selectModerationDelegatorsById(state);
            blockerChannelClaims = [
              blockerChannelClaims.find((x) => {
                const delegatorDataForId = delegatorsById[x.claim_id];
                return delegatorDataForId && Object.values(delegatorDataForId.delegators).includes(creatorId);
              }),
            ];
          }
          break;

        case BLOCK_LEVEL.ADMIN:
          {
            // Find the first admin channel and use that.
            const delegatorsById = selectModerationDelegatorsById(state);
            blockerChannelClaims = [
              blockerChannelClaims.find((x) => delegatorsById[x.claim_id] && delegatorsById[x.claim_id].global),
            ];
          }
          break;
      }
    } else {
      blockerChannelClaims = blockerChannelClaims.filter((x) => blockerIds.includes(x.claim_id));
    }

    const commenterClaim = selectClaimsByUri(state)[commenterUri];
    if (!commenterClaim) {
      console.error("Can't find claim to block"); // eslint-disable-line
      return;
    }

    const creatorClaim = selectClaimsById(state)[creatorId];
    if (creatorId && !creatorClaim) {
      console.error("Can't find creator claim"); // eslint-disable-line
      return;
    }

    dispatch({
      type: unblock ? ACTIONS.COMMENT_MODERATION_UN_BLOCK_STARTED : ACTIONS.COMMENT_MODERATION_BLOCK_STARTED,
      data: {
        blockedUri: commenterUri,
        creatorUri: creatorClaim ? creatorClaim.permanent_url : undefined,
        blockLevel: blockLevel,
      },
    });

    const commenterIdForAction = commenterClaim ? commenterClaim.claim_id : null;
    const commenterNameForAction = commenterClaim ? commenterClaim.name : null;

    let channelSignatures = [];

    const sharedModBlockParams = unblock
      ? {
          un_blocked_channel_id: commenterIdForAction,
          un_blocked_channel_name: commenterNameForAction,
        }
      : {
          blocked_channel_id: commenterIdForAction,
          blocked_channel_name: commenterNameForAction,
        };

    const commentAction = unblock ? Comments.moderation_unblock : Comments.moderation_block;

    return Promise.all(blockerChannelClaims.map((x) => channelSignName(x.claim_id, x.name)))
      .then((response) => {
        channelSignatures = response;
        // $FlowFixMe
        return Promise.allSettled(
          channelSignatures
            .filter((x) => x !== undefined && x !== null)
            .map((signatureData) =>
              commentAction({
                // $FlowFixMe
                mod_channel_id: signatureData.claim_id,
                // $FlowFixMe
                mod_channel_name: signatureData.name,
                // $FlowFixMe
                signature: signatureData.signature,
                // $FlowFixMe
                signing_ts: signatureData.signing_ts,
                creator_channel_id: creatorClaim ? creatorClaim.claim_id : undefined,
                creator_channel_name: creatorClaim ? creatorClaim.name : undefined,
                block_all: unblock ? undefined : blockLevel === BLOCK_LEVEL.ADMIN,
                global_un_block: unblock ? blockLevel === BLOCK_LEVEL.ADMIN : undefined,
                ...sharedModBlockParams,
              })
            )
        )
          .then((response) => {
            const failures = [];

            response.forEach((res, index) => {
              if (res.status === 'rejected') {
                // TODO: This should be error codes
                if (res.reason.message !== 'validation is disallowed for non controlling channels') {
                  // $FlowFixMe
                  failures.push(channelSignatures[index].name + ': ' + res.reason.message);
                }
              }
            });

            if (failures.length !== 0) {
              dispatch(doToast({ message: failures.join(), isError: true }));
              dispatch({
                type: unblock ? ACTIONS.COMMENT_MODERATION_UN_BLOCK_FAILED : ACTIONS.COMMENT_MODERATION_BLOCK_FAILED,
                data: {
                  blockedUri: commenterUri,
                  creatorUri: creatorClaim ? creatorClaim.permanent_url : undefined,
                  blockLevel: blockLevel,
                },
              });
              return;
            }

            dispatch({
              type: unblock ? ACTIONS.COMMENT_MODERATION_UN_BLOCK_COMPLETE : ACTIONS.COMMENT_MODERATION_BLOCK_COMPLETE,
              data: {
                blockedUri: commenterUri,
                creatorUri: creatorClaim ? creatorClaim.permanent_url : undefined,
                blockLevel: blockLevel,
              },
            });

            dispatch(
              doToast({
                message: unblock
                  ? __('Channel unblocked!')
                  : __('Channel "%channel%" blocked.', { channel: commenterNameForAction }),
                linkText: __(showLink ? 'See All' : ''),
                linkTarget: '/settings/block_and_mute',
              })
            );
          })
          .catch(() => {
            dispatch({
              type: unblock ? ACTIONS.COMMENT_MODERATION_UN_BLOCK_FAILED : ACTIONS.COMMENT_MODERATION_BLOCK_FAILED,
              data: {
                blockedUri: commenterUri,
                creatorUri: creatorClaim ? creatorClaim.permanent_url : undefined,
                blockLevel: blockLevel,
              },
            });
          });
      })
      .catch(() => {
        dispatch({
          type: unblock ? ACTIONS.COMMENT_MODERATION_UN_BLOCK_FAILED : ACTIONS.COMMENT_MODERATION_BLOCK_FAILED,
          data: {
            blockedUri: commenterUri,
            creatorUri: creatorClaim ? creatorClaim.permanent_url : undefined,
            blockLevel: blockLevel,
          },
        });
      });
  };
}

/**
 * Blocks the commenter for all channels that I own.
 *
 * @param commenterUri
 * @param showLink
 * @returns {function(Dispatch): *}
 */
export function doCommentModBlock(commenterUri: string, showLink: boolean = true) {
  return (dispatch: Dispatch) => {
    return dispatch(doCommentModToggleBlock(false, commenterUri, '', [], BLOCK_LEVEL.SELF, showLink));
  };
}

/**
 * Blocks the commenter using the given channel that has Global privileges.
 *
 * @param commenterUri
 * @param blockerId
 * @returns {function(Dispatch): *}
 */
export function doCommentModBlockAsAdmin(commenterUri: string, blockerId: string) {
  return (dispatch: Dispatch) => {
    return dispatch(doCommentModToggleBlock(false, commenterUri, '', blockerId ? [blockerId] : [], BLOCK_LEVEL.ADMIN));
  };
}

/**
 * Blocks the commenter using the given channel that has been granted
 * moderation rights by the creator.
 *
 * @param commenterUri
 * @param creatorId
 * @param blockerId
 * @returns {function(Dispatch): *}
 */
export function doCommentModBlockAsModerator(commenterUri: string, creatorId: string, blockerId: string) {
  return (dispatch: Dispatch) => {
    return dispatch(
      doCommentModToggleBlock(false, commenterUri, creatorId, blockerId ? [blockerId] : [], BLOCK_LEVEL.MODERATOR)
    );
  };
}

/**
 * Unblocks the commenter for all channels that I own.
 *
 * @param commenterUri
 * @param showLink
 * @returns {function(Dispatch): *}
 */
export function doCommentModUnBlock(commenterUri: string, showLink: boolean = true) {
  return (dispatch: Dispatch) => {
    return dispatch(doCommentModToggleBlock(true, commenterUri, '', [], BLOCK_LEVEL.SELF, showLink));
  };
}

/**
 * Unblocks the commenter using the given channel that has Global privileges.
 *
 * @param commenterUri
 * @param blockerId
 * @returns {function(Dispatch): *}
 */
export function doCommentModUnBlockAsAdmin(commenterUri: string, blockerId: string) {
  return (dispatch: Dispatch) => {
    return dispatch(doCommentModToggleBlock(true, commenterUri, '', blockerId ? [blockerId] : [], BLOCK_LEVEL.ADMIN));
  };
}

/**
 * Unblocks the commenter using the given channel that has been granted
 * moderation rights by the creator.
 *
 * @param commenterUri
 * @param creatorId
 * @param blockerId
 * @returns {function(Dispatch): *}
 */
export function doCommentModUnBlockAsModerator(commenterUri: string, creatorId: string, blockerId: string) {
  return (dispatch: Dispatch) => {
    return dispatch(
      doCommentModToggleBlock(true, commenterUri, creatorId, blockerId ? [blockerId] : [], BLOCK_LEVEL.MODERATOR)
    );
  };
}

export function doFetchModBlockedList() {
  return async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const myChannels = selectMyChannelClaims(state);

    dispatch({
      type: ACTIONS.COMMENT_MODERATION_BLOCK_LIST_STARTED,
    });

    let channelSignatures = [];

    return Promise.all(myChannels.map((channel) => channelSignName(channel.claim_id, channel.name)))
      .then((response) => {
        channelSignatures = response;
        // $FlowFixMe
        return Promise.allSettled(
          channelSignatures
            .filter((x) => x !== undefined && x !== null)
            .map((signatureData) =>
              Comments.moderation_block_list({
                mod_channel_id: signatureData.claim_id,
                mod_channel_name: signatureData.name,
                signature: signatureData.signature,
                signing_ts: signatureData.signing_ts,
              })
            )
        )
          .then((res) => {
            let personalBlockList = [];
            let adminBlockList = [];
            let moderatorBlockList = [];
            let moderatorBlockListDelegatorsMap = {};

            const blockListsPerChannel = res.map((r) => r.value);
            blockListsPerChannel
              .sort((a, b) => {
                return 1;
              })
              .forEach((channelBlockLists) => {
                const storeList = (fetchedList, blockedList, blockedByMap) => {
                  if (fetchedList) {
                    fetchedList.forEach((blockedChannel) => {
                      if (blockedChannel.blocked_channel_name) {
                        const channelUri = buildURI({
                          channelName: blockedChannel.blocked_channel_name,
                          claimId: blockedChannel.blocked_channel_id,
                        });

                        if (!blockedList.find((blockedChannel) => blockedChannel.channelUri === channelUri)) {
                          blockedList.push({ channelUri, blockedAt: blockedChannel.blocked_at });
                        }

                        if (blockedByMap !== undefined) {
                          const blockedByChannelUri = buildURI({
                            channelName: blockedChannel.blocked_by_channel_name,
                            claimId: blockedChannel.blocked_by_channel_id,
                          });

                          if (blockedByMap[channelUri]) {
                            if (!blockedByMap[channelUri].includes(blockedByChannelUri)) {
                              blockedByMap[channelUri].push(blockedByChannelUri);
                            }
                          } else {
                            blockedByMap[channelUri] = [blockedByChannelUri];
                          }
                        }
                      }
                    });
                  }
                };

                const blocked_channels = channelBlockLists && channelBlockLists.blocked_channels;
                const globally_blocked_channels = channelBlockLists && channelBlockLists.globally_blocked_channels;
                const delegated_blocked_channels = channelBlockLists && channelBlockLists.delegated_blocked_channels;

                storeList(blocked_channels, personalBlockList);
                storeList(globally_blocked_channels, adminBlockList);
                storeList(delegated_blocked_channels, moderatorBlockList, moderatorBlockListDelegatorsMap);
              });

            dispatch({
              type: ACTIONS.COMMENT_MODERATION_BLOCK_LIST_COMPLETED,
              data: {
                personalBlockList:
                  personalBlockList.length > 0
                    ? personalBlockList
                        .sort((a, b) => new Date(a.blockedAt) - new Date(b.blockedAt))
                        .map((blockedChannel) => blockedChannel.channelUri)
                    : null,
                adminBlockList:
                  adminBlockList.length > 0
                    ? adminBlockList
                        .sort((a, b) => new Date(a.blockedAt) - new Date(b.blockedAt))
                        .map((blockedChannel) => blockedChannel.channelUri)
                    : null,
                moderatorBlockList:
                  moderatorBlockList.length > 0
                    ? moderatorBlockList
                        .sort((a, b) => new Date(a.blockedAt) - new Date(b.blockedAt))
                        .map((blockedChannel) => blockedChannel.channelUri)
                    : null,
                moderatorBlockListDelegatorsMap: moderatorBlockListDelegatorsMap,
              },
            });
          })
          .catch(() => {
            dispatch({
              type: ACTIONS.COMMENT_MODERATION_BLOCK_LIST_FAILED,
            });
          });
      })
      .catch(() => {
        dispatch({
          type: ACTIONS.COMMENT_MODERATION_BLOCK_LIST_FAILED,
        });
      });
  };
}

export const doUpdateBlockListForPublishedChannel = (channelClaim: ChannelClaim) => {
  return async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const blockedUris = selectModerationBlockList(state);

    let channelSignature: ?{
      signature: string,
      signing_ts: string,
    };
    try {
      channelSignature = await Lbry.channel_sign({
        channel_id: channelClaim.claim_id,
        hexdata: toHex(channelClaim.name),
      });
    } catch (e) {}

    if (!channelSignature) {
      return;
    }

    return Promise.all(
      blockedUris.map((uri) => {
        const { channelName, channelClaimId } = parseURI(uri);

        return Comments.moderation_block({
          mod_channel_id: channelClaim.claim_id,
          mod_channel_name: channelClaim.name,
          // $FlowFixMe
          signature: channelSignature.signature,
          // $FlowFixMe
          signing_ts: channelSignature.signing_ts,
          blocked_channel_id: channelClaimId,
          blocked_channel_name: channelName,
        });
      })
    );
  };
};

export function doCommentModAddDelegate(
  modChannelId: string,
  modChannelName: string,
  creatorChannelClaim: ChannelClaim
) {
  return async (dispatch: Dispatch, getState: GetState) => {
    let signature: ?{
      signature: string,
      signing_ts: string,
    };
    try {
      signature = await Lbry.channel_sign({
        channel_id: creatorChannelClaim.claim_id,
        hexdata: toHex(creatorChannelClaim.name),
      });
    } catch (e) {}

    if (!signature) {
      return;
    }

    return Comments.moderation_add_delegate({
      mod_channel_id: modChannelId,
      mod_channel_name: modChannelName,
      creator_channel_id: creatorChannelClaim.claim_id,
      creator_channel_name: creatorChannelClaim.name,
      signature: signature.signature,
      signing_ts: signature.signing_ts,
    }).catch((err) => {
      dispatch(
        doToast({
          message: err.message,
          isError: true,
        })
      );
    });
  };
}

export function doCommentModRemoveDelegate(
  modChannelId: string,
  modChannelName: string,
  creatorChannelClaim: ChannelClaim
) {
  return async (dispatch: Dispatch, getState: GetState) => {
    let signature: ?{
      signature: string,
      signing_ts: string,
    };
    try {
      signature = await Lbry.channel_sign({
        channel_id: creatorChannelClaim.claim_id,
        hexdata: toHex(creatorChannelClaim.name),
      });
    } catch (e) {}

    if (!signature) {
      return;
    }

    return Comments.moderation_remove_delegate({
      mod_channel_id: modChannelId,
      mod_channel_name: modChannelName,
      creator_channel_id: creatorChannelClaim.claim_id,
      creator_channel_name: creatorChannelClaim.name,
      signature: signature.signature,
      signing_ts: signature.signing_ts,
    }).catch((err) => {
      dispatch(
        doToast({
          message: err.message,
          isError: true,
        })
      );
    });
  };
}

export function doCommentModListDelegates(channelClaim: ChannelClaim) {
  return async (dispatch: Dispatch, getState: GetState) => {
    dispatch({
      type: ACTIONS.COMMENT_FETCH_MODERATION_DELEGATES_STARTED,
    });

    let signature: ?{
      signature: string,
      signing_ts: string,
    };
    try {
      signature = await Lbry.channel_sign({
        channel_id: channelClaim.claim_id,
        hexdata: toHex(channelClaim.name),
      });
    } catch (e) {}

    if (!signature) {
      dispatch({
        type: ACTIONS.COMMENT_FETCH_MODERATION_DELEGATES_FAILED,
      });
      return;
    }

    return Comments.moderation_list_delegates({
      creator_channel_id: channelClaim.claim_id,
      creator_channel_name: channelClaim.name,
      signature: signature.signature,
      signing_ts: signature.signing_ts,
    })
      .then((response) => {
        dispatch({
          type: ACTIONS.COMMENT_FETCH_MODERATION_DELEGATES_COMPLETED,
          data: {
            id: channelClaim.claim_id,
            delegates: response.Delegates,
          },
        });
      })
      .catch((err) => {
        dispatch({
          type: ACTIONS.COMMENT_FETCH_MODERATION_DELEGATES_FAILED,
        });
      });
  };
}

export function doFetchCommentModAmIList(channelClaim: ChannelClaim) {
  return async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const myChannels = selectMyChannelClaims(state);

    dispatch({
      type: ACTIONS.COMMENT_MODERATION_AM_I_LIST_STARTED,
    });

    let channelSignatures = [];

    return Promise.all(myChannels.map((channel) => channelSignName(channel.claim_id, channel.name)))
      .then((response) => {
        channelSignatures = response;
        // $FlowFixMe
        return Promise.allSettled(
          channelSignatures
            .filter((x) => x !== undefined && x !== null)
            .map((signatureData) =>
              Comments.moderation_am_i({
                channel_name: signatureData.name,
                channel_id: signatureData.claim_id,
                signature: signatureData.signature,
                signing_ts: signatureData.signing_ts,
              })
            )
        )
          .then((res) => {
            const delegatorsById = {};

            channelSignatures.forEach((chanSig, index) => {
              if (chanSig && res[index]) {
                const value = res[index].value;
                delegatorsById[chanSig.claim_id] = {
                  global: value ? value.type === 'Global' : false,
                  delegators: value && value.authorized_channels ? value.authorized_channels : {},
                };
              }
            });

            dispatch({
              type: ACTIONS.COMMENT_MODERATION_AM_I_LIST_COMPLETED,
              data: delegatorsById,
            });
          })
          .catch((err) => {
            dispatch({
              type: ACTIONS.COMMENT_MODERATION_AM_I_LIST_FAILED,
            });
          });
      })
      .catch(() => {
        dispatch({
          type: ACTIONS.COMMENT_MODERATION_AM_I_LIST_FAILED,
        });
      });
  };
}

export const doFetchCreatorSettings = (channelClaimIds: Array<string> = []) => {
  return async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const myChannels = selectMyChannelClaims(state);

    dispatch({
      type: ACTIONS.COMMENT_FETCH_SETTINGS_STARTED,
    });

    let channelSignatures = [];
    if (myChannels) {
      for (const channelClaim of myChannels) {
        if (channelClaimIds.length !== 0 && !channelClaimIds.includes(channelClaim.claim_id)) {
          continue;
        }

        try {
          const channelSignature = await Lbry.channel_sign({
            channel_id: channelClaim.claim_id,
            hexdata: toHex(channelClaim.name),
          });

          channelSignatures.push({ ...channelSignature, claim_id: channelClaim.claim_id, name: channelClaim.name });
        } catch (e) {}
      }
    }

    return Promise.all(
      channelSignatures.map((signatureData) =>
        Comments.setting_list({
          channel_name: signatureData.name,
          channel_id: signatureData.claim_id,
          signature: signatureData.signature,
          signing_ts: signatureData.signing_ts,
        })
      )
    )
      .then((settings) => {
        const settingsByChannelId = {};

        for (let i = 0; i < channelSignatures.length; ++i) {
          const channelId = channelSignatures[i].claim_id;
          settingsByChannelId[channelId] = settings[i];

          settingsByChannelId[channelId].words = settingsByChannelId[channelId].words.split(',');

          delete settingsByChannelId[channelId].channel_name;
          delete settingsByChannelId[channelId].channel_id;
          delete settingsByChannelId[channelId].signature;
          delete settingsByChannelId[channelId].signing_ts;
        }

        dispatch({
          type: ACTIONS.COMMENT_FETCH_SETTINGS_COMPLETED,
          data: settingsByChannelId,
        });
      })
      .catch((err) => {
        // TODO: Use error codes when available.
        // TODO: The "validation is disallowed" thing ideally should just be a
        //       success case that returns a null setting, instead of an error.
        //       As we are using 'Promise.all', if one channel fails, everyone
        //       fails. This forces us to remove the batch functionality of this
        //       function. However, since this "validation is disallowed" thing
        //       is potentially a temporary one to handle spammers, I retained
        //       the batch functionality for now.
        if (err.message === 'validation is disallowed for non controlling channels') {
          const settingsByChannelId = {};
          for (let i = 0; i < channelSignatures.length; ++i) {
            const channelId = channelSignatures[i].claim_id;
            // 'undefined' means "fetching or have not fetched";
            // 'null' means "feature not available for this channel";
            settingsByChannelId[channelId] = null;
          }

          dispatch({
            type: ACTIONS.COMMENT_FETCH_SETTINGS_COMPLETED,
            data: settingsByChannelId,
          });
          return;
        }

        dispatch({
          type: ACTIONS.COMMENT_FETCH_SETTINGS_FAILED,
        });
      });
  };
};

/**
 * Updates creator settings, except for 'Words', which will be handled by
 * 'doCommentWords, doCommentBlockWords, etc.'
 *
 * @param channelClaim
 * @param settings
 * @returns {function(Dispatch, GetState): Promise<R>|Promise<unknown>|*}
 */
export const doUpdateCreatorSettings = (channelClaim: ChannelClaim, settings: PerChannelSettings) => {
  return async (dispatch: Dispatch, getState: GetState) => {
    let channelSignature: ?{
      signature: string,
      signing_ts: string,
    };
    try {
      channelSignature = await Lbry.channel_sign({
        channel_id: channelClaim.claim_id,
        hexdata: toHex(channelClaim.name),
      });
    } catch (e) {}

    if (!channelSignature) {
      return;
    }

    return Comments.setting_update({
      channel_name: channelClaim.name,
      channel_id: channelClaim.claim_id,
      signature: channelSignature.signature,
      signing_ts: channelSignature.signing_ts,
      ...settings,
    }).catch((err) => {
      dispatch(
        doToast({
          message: err.message,
          isError: true,
        })
      );
    });
  };
};

export const doCommentWords = (channelClaim: ChannelClaim, words: Array<string>, isUnblock: boolean) => {
  return async (dispatch: Dispatch, getState: GetState) => {
    let channelSignature: ?{
      signature: string,
      signing_ts: string,
    };
    try {
      channelSignature = await Lbry.channel_sign({
        channel_id: channelClaim.claim_id,
        hexdata: toHex(channelClaim.name),
      });
    } catch (e) {}

    if (!channelSignature) {
      return;
    }

    const cmd = isUnblock ? Comments.setting_unblock_word : Comments.setting_block_word;

    return cmd({
      channel_name: channelClaim.name,
      channel_id: channelClaim.claim_id,
      words: words.join(','),
      signature: channelSignature.signature,
      signing_ts: channelSignature.signing_ts,
    }).catch((err) => {
      dispatch(
        doToast({
          message: err.message,
          isError: true,
        })
      );
    });
  };
};

export const doCommentBlockWords = (channelClaim: ChannelClaim, words: Array<string>) => {
  return (dispatch: Dispatch) => {
    return dispatch(doCommentWords(channelClaim, words, false));
  };
};

export const doCommentUnblockWords = (channelClaim: ChannelClaim, words: Array<string>) => {
  return (dispatch: Dispatch) => {
    return dispatch(doCommentWords(channelClaim, words, true));
  };
};

export const doFetchBlockedWords = () => {
  return async (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const myChannels = selectMyChannelClaims(state);

    dispatch({
      type: ACTIONS.COMMENT_FETCH_BLOCKED_WORDS_STARTED,
    });

    let channelSignatures = [];
    if (myChannels) {
      for (const channelClaim of myChannels) {
        try {
          const channelSignature = await Lbry.channel_sign({
            channel_id: channelClaim.claim_id,
            hexdata: toHex(channelClaim.name),
          });

          channelSignatures.push({ ...channelSignature, claim_id: channelClaim.claim_id, name: channelClaim.name });
        } catch (e) {}
      }
    }

    return Promise.all(
      channelSignatures.map((signatureData) =>
        Comments.setting_list_blocked_words({
          channel_name: signatureData.name,
          channel_id: signatureData.claim_id,
          signature: signatureData.signature,
          signing_ts: signatureData.signing_ts,
        })
      )
    )
      .then((blockedWords) => {
        const blockedWordsByChannelId = {};

        for (let i = 0; i < channelSignatures.length; ++i) {
          const claim_id = channelSignatures[i].claim_id;
          blockedWordsByChannelId[claim_id] = blockedWords[i].word_list;
        }

        dispatch({
          type: ACTIONS.COMMENT_FETCH_BLOCKED_WORDS_COMPLETED,
          data: blockedWordsByChannelId,
        });
      })
      .catch(() => {
        dispatch({
          type: ACTIONS.COMMENT_FETCH_BLOCKED_WORDS_FAILED,
        });
      });
  };
};
