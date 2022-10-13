// @flow
import * as ACTIONS from 'constants/action_types';
import * as ABANDON_STATES from 'constants/abandon_states';
import Lbry from 'lbry';
import { normalizeURI } from 'util/lbryURI';
import { doToast } from 'redux/actions/notifications';
import {
  selectMyClaimsRaw,
  selectResolvingUris,
  selectClaimsByUri,
  selectMyChannelClaims,
  selectPendingClaimsById,
  selectClaimIsMine,
  selectIsMyChannelCountOverLimit,
  selectById,
  selectMyChannelClaimIds,
  selectFetchingMyChannels,
} from 'redux/selectors/claims';

import { doFetchTxoPage } from 'redux/actions/wallet';
import { doMembershipContentForStreamClaimIds, doFetchOdyseeMembershipForChannelIds } from 'redux/actions/memberships';
import { selectSupportsByOutpoint } from 'redux/selectors/wallet';
import { creditsToString } from 'util/format-credits';
import { batchActions } from 'util/batch-actions';
import { createNormalizedClaimSearchKey, getChannelIdFromClaim } from 'util/claim';
import { PAGE_SIZE } from 'constants/claim';
import { selectClaimIdsForCollectionId } from 'redux/selectors/collections';
import { doFetchItemsInCollections } from 'redux/actions/collections';

let onChannelConfirmCallback;
let checkPendingInterval;

export function doResolveUris(
  uris: Array<string>,
  returnCachedClaims: boolean = false,
  resolveReposts: boolean = true,
  additionalOptions: any = {}
) {
  return (dispatch: Dispatch, getState: GetState) => {
    const normalizedUris = uris.map(normalizeURI);
    const state = getState();

    const resolvingUrisSet = new Set(selectResolvingUris(state));
    const claimsByUri = selectClaimsByUri(state);
    const urisToResolve = normalizedUris.filter((uri) => {
      if (resolvingUrisSet.has(uri)) {
        return false;
      }

      return returnCachedClaims ? !claimsByUri[uri] : true;
    });

    if (urisToResolve.length === 0) {
      return Promise.resolve();
    }

    dispatch({ type: ACTIONS.RESOLVE_URIS_START, data: { uris: normalizedUris } });

    return Lbry.resolve({ urls: urisToResolve, ...additionalOptions })
      .then((response: ResolveResponse) => {
        const collectionIds = new Set([]);
        const repostsToResolve = new Set([]);
        const streamClaimIds = new Set([]);
        const channelClaimIds = new Set([]);

        const resolveInfo: {
          [uri: string]: {
            stream: ?StreamClaim,
            channel: ?ChannelClaim,
            claimsInChannel: ?number,
            collection: ?CollectionClaim,
          },
        } = {};

        for (const uri in response) {
          const uriResolveInfo = Object.assign({}, response[uri]);

          if (uriResolveInfo.error) {
            const fallbackResolveInfo = {
              stream: null,
              claimsInChannel: null,
              channel: null,
              collection: null,
            };

            resolveInfo[uri] = fallbackResolveInfo;
          } else {
            if (resolveReposts) {
              const repostedClaim = uriResolveInfo.reposted_claim;

              if (repostedClaim) {
                const repostUrl = repostedClaim.permanent_url;
                if (!resolvingUrisSet.has(repostUrl)) {
                  repostsToResolve.add(repostUrl);
                }

                if (repostedClaim.value_type !== 'channel' && repostedClaim.value_type !== 'collection') {
                  streamClaimIds.add(repostedClaim.claim_id);
                }
              }
            }

            const resultResponse = {};
            if (uriResolveInfo.value_type === 'channel') {
              // $FlowFixMe
              const channel: ChannelClaim = uriResolveInfo;

              resultResponse.channel = channel;
              resultResponse.claimsInChannel = (channel.meta && channel.meta.claims_in_channel) || 0;
            } else if (uriResolveInfo.value_type === 'collection') {
              // $FlowFixMe
              const collection: CollectionClaim = uriResolveInfo;

              resultResponse.collection = collection;
              collectionIds.add(collection.claim_id);
            } else {
              // $FlowFixMe
              const stream: StreamClaim = uriResolveInfo;

              resultResponse.stream = stream;
              streamClaimIds.add(stream.claim_id);

              if (stream.signing_channel) {
                // $FlowFixMe
                const channel: ChannelClaim = stream.signing_channel;

                resultResponse.channel = channel;
                resultResponse.claimsInChannel = (channel.meta && channel.meta.claims_in_channel) || 0;
              }
            }

            const channelId = getChannelIdFromClaim(uriResolveInfo);
            if (channelId) channelClaimIds.add(channelId);

            resolveInfo[uri] = resultResponse;
          }
        }

        dispatch({ type: ACTIONS.RESOLVE_URIS_SUCCESS, data: { resolveInfo } });

        if (collectionIds.size > 0) {
          dispatch(doFetchItemsInCollections({ collectionIds: Array.from(collectionIds), pageSize: 50 }));
        }

        if (streamClaimIds.size > 0) {
          dispatch(doMembershipContentForStreamClaimIds(Array.from(streamClaimIds)));
        }

        if (channelClaimIds.size > 0) {
          dispatch(doFetchOdyseeMembershipForChannelIds(Array.from(channelClaimIds)));
        }

        if (repostsToResolve.size > 0) {
          dispatch(doResolveUris(Array.from(repostsToResolve), true, false, additionalOptions));
        }

        return response;
      })
      .catch((error) => dispatch({ type: ACTIONS.RESOLVE_URIS_FAIL, data: normalizedUris }));
  };
}

/**
 * Temporary alternative to doResolveUris() due to a batching bug with
 * Lbry.resolve().
 *
 * Note that is a simpler version that DOES NOT handle Collections and Reposts.
 *
 * @param claimIds
 */
export function doResolveClaimIds(claimIds: Array<string>) {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const resolvedIds = Object.keys(selectById(state));
    const idsToResolve = claimIds.filter((x) => !resolvedIds.includes(x));

    if (idsToResolve.length === 0) {
      return Promise.resolve();
    }

    return dispatch(
      doClaimSearch(
        {
          claim_ids: idsToResolve,
          page: 1,
          page_size: Math.min(idsToResolve.length, 50),
          no_totals: true,
        },
        {
          useAutoPagination: idsToResolve.length > 50,
        }
      )
    );
  };
}

export function doResolveUri(
  uri: string,
  returnCachedClaims: boolean = false,
  resolveReposts: boolean = true,
  additionalOptions: any = {}
) {
  return doResolveUris([uri], returnCachedClaims, resolveReposts, additionalOptions);
}

export function doGetClaimFromUriResolve(uri: string) {
  return async (dispatch: Dispatch) => {
    let claim;
    await dispatch(doResolveUri(uri, true))
      .then((response) =>
        Object.values(response).forEach((resposne) => {
          claim = resposne;
        })
      )
      .catch((e) => {});

    return claim;
  };
}

export function doFetchClaimListMine(
  page: number = 1,
  pageSize: number = 99999,
  resolve: boolean = true,
  filterBy: Array<string> = []
) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.FETCH_CLAIM_LIST_MINE_STARTED,
    });

    let claimTypes = ['stream', 'repost'];
    if (filterBy && filterBy.length !== 0) {
      claimTypes = claimTypes.filter((t) => filterBy.includes(t));
    }

    // $FlowFixMe
    Lbry.claim_list({
      page: page,
      page_size: pageSize,
      claim_type: claimTypes,
      resolve,
    }).then((result: StreamListResponse) => {
      dispatch({
        type: ACTIONS.FETCH_CLAIM_LIST_MINE_COMPLETED,
        data: {
          result,
          resolve,
        },
      });

      const streamClaimIds = new Set([]);
      const channelClaimIds = new Set([]);

      result.items.forEach((item) => {
        if (item.value_type !== 'channel' && item.value_type !== 'collection') {
          streamClaimIds.add(item.claim_id);
        }

        const channelId = getChannelIdFromClaim(item);
        if (channelId) channelClaimIds.add(channelId);
      });

      if (streamClaimIds.size > 0) {
        dispatch(doMembershipContentForStreamClaimIds(Array.from(streamClaimIds)));
      }

      if (channelClaimIds.size > 0) {
        dispatch(doFetchOdyseeMembershipForChannelIds(Array.from(channelClaimIds)));
      }
    });
  };
}

export function doAbandonTxo(txo: Txo, cb: (string) => void) {
  return (dispatch: Dispatch) => {
    if (cb) cb(ABANDON_STATES.PENDING);
    const isClaim = txo.type === 'claim';
    const isSupport = txo.type === 'support' && txo.is_my_input === true;
    const isTip = txo.type === 'support' && txo.is_my_input === false;

    const data = isClaim ? { claimId: txo.claim_id } : { outpoint: `${txo.txid}:${txo.nout}` };

    const startedActionType = isClaim ? ACTIONS.ABANDON_CLAIM_STARTED : ACTIONS.ABANDON_SUPPORT_STARTED;
    const completedActionType = isClaim ? ACTIONS.ABANDON_CLAIM_SUCCEEDED : ACTIONS.ABANDON_SUPPORT_COMPLETED;

    dispatch({
      type: startedActionType,
      data,
    });

    const errorCallback = () => {
      if (cb) cb(ABANDON_STATES.ERROR);
      dispatch(
        doToast({
          message: isClaim ? 'Error abandoning your claim/support' : 'Error unlocking your tip',
          isError: true,
        })
      );
    };

    const successCallback = () => {
      dispatch({
        type: completedActionType,
        data,
      });

      let abandonMessage;
      if (isClaim) {
        abandonMessage = __('Successfully abandoned your claim.');
      } else if (isSupport) {
        abandonMessage = __('Successfully abandoned your support.');
      } else {
        abandonMessage = __('Successfully unlocked your tip!');
      }
      if (cb) cb(ABANDON_STATES.DONE);

      dispatch(
        doToast({
          message: abandonMessage,
        })
      );
    };

    const abandonParams: {
      claim_id?: string,
      txid?: string,
      nout?: number,
    } = {
      blocking: true,
    };
    if (isClaim) {
      abandonParams['claim_id'] = txo.claim_id;
    } else {
      abandonParams['txid'] = txo.txid;
      abandonParams['nout'] = txo.nout;
    }

    let method;
    if (isSupport || isTip) {
      method = 'support_abandon';
    } else if (isClaim) {
      const { normalized_name: claimName } = txo;
      method = claimName.startsWith('@') ? 'channel_abandon' : 'stream_abandon';
    }

    if (!method) {
      console.error('No "method" chosen for claim or support abandon');
      return;
    }

    Lbry[method](abandonParams).then(successCallback, errorCallback);
  };
}

export function doAbandonClaim(claim: Claim, cb: (string) => void) {
  const { txid, nout } = claim;
  const outpoint = `${txid}:${nout}`;

  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const myClaims: Array<Claim> = selectMyClaimsRaw(state);
    const mySupports: { [string]: Support } = selectSupportsByOutpoint(state);

    // A user could be trying to abandon a support or one of their claims
    const claimIsMine = selectClaimIsMine(state, claim);
    const claimToAbandon = claimIsMine ? claim : myClaims.find((claim) => claim.txid === txid && claim.nout === nout);
    const supportToAbandon = mySupports[outpoint];

    if (!claimToAbandon && !supportToAbandon) {
      console.error('No associated support or claim with txid: ', txid);
      return;
    }

    const data = claimToAbandon
      ? { claimId: claimToAbandon.claim_id }
      : { outpoint: `${supportToAbandon.txid}:${supportToAbandon.nout}` };

    const isClaim = !!claimToAbandon;
    const startedActionType = isClaim ? ACTIONS.ABANDON_CLAIM_STARTED : ACTIONS.ABANDON_SUPPORT_STARTED;
    const completedActionType = isClaim ? ACTIONS.ABANDON_CLAIM_SUCCEEDED : ACTIONS.ABANDON_SUPPORT_COMPLETED;

    dispatch({
      type: startedActionType,
      data,
    });

    const errorCallback = () => {
      dispatch(
        doToast({
          message: isClaim ? 'Error abandoning your claim/support' : 'Error unlocking your tip',
          isError: true,
        })
      );
      if (cb) cb(ABANDON_STATES.ERROR);
    };

    const successCallback = () => {
      dispatch({
        type: completedActionType,
        data,
      });
      if (cb) cb(ABANDON_STATES.DONE);

      let abandonMessage;
      if (isClaim) {
        abandonMessage = __('Successfully abandoned your claim.');
      } else if (supportToAbandon) {
        abandonMessage = __('Successfully abandoned your support.');
      } else {
        abandonMessage = __('Successfully unlocked your tip!');
      }

      dispatch(
        doToast({
          message: abandonMessage,
        })
      );
      dispatch(doFetchTxoPage());
    };

    const abandonParams = {
      txid,
      nout,
      blocking: true,
    };

    let method;
    if (supportToAbandon) {
      method = 'support_abandon';
    } else if (claimToAbandon) {
      const { name: claimName } = claimToAbandon;
      method = claimName.startsWith('@') ? 'channel_abandon' : 'stream_abandon';
    }

    if (!method) {
      console.error('No "method" chosen for claim or support abandon');
      return;
    }

    Lbry[method](abandonParams).then(successCallback, errorCallback);
  };
}

export function doFetchClaimsByChannel(uri: string, page: number = 1) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.FETCH_CHANNEL_CLAIMS_STARTED,
      data: { uri, page },
    });

    Lbry.claim_search({
      channel: uri,
      valid_channel_signature: true,
      page: page || 1,
      order_by: ['release_time'],
      include_is_my_output: true,
      include_purchase_receipt: true,
    }).then((result: ClaimSearchResponse) => {
      const { items: claims, total_items: claimsInChannel, page: returnedPage } = result;

      dispatch({
        type: ACTIONS.FETCH_CHANNEL_CLAIMS_COMPLETED,
        data: {
          uri,
          claimsInChannel,
          claims: claims || [],
          page: returnedPage || undefined,
        },
      });
    });
  };
}

export function doClearChannelErrors() {
  return {
    type: ACTIONS.CLEAR_CHANNEL_ERRORS,
  };
}

export function doCreateChannel(name: string, amount: number, optionalParams: any, onConfirm: any) {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const channelCountOverLimit = selectIsMyChannelCountOverLimit(state);

    dispatch({
      type: ACTIONS.CREATE_CHANNEL_STARTED,
    });

    if (channelCountOverLimit) {
      dispatch({
        type: ACTIONS.CREATE_CHANNEL_FAILED,
        data: 'Channel limit exceeded',
      });
      return;
    }

    const createParams: ChannelCreateParam = {
      name,
      bid: creditsToString(amount),
      blocking: true,
    };

    if (optionalParams) {
      if (optionalParams.title) {
        createParams.title = optionalParams.title;
      }
      if (optionalParams.coverUrl) {
        createParams.cover_url = optionalParams.coverUrl;
      }
      if (optionalParams.thumbnailUrl) {
        createParams.thumbnail_url = optionalParams.thumbnailUrl;
      }
      if (optionalParams.description) {
        createParams.description = optionalParams.description;
      }
      if (optionalParams.website) {
        createParams.website_url = optionalParams.website;
      }
      if (optionalParams.email) {
        createParams.email = optionalParams.email;
      }
      if (optionalParams.tags) {
        createParams.tags = optionalParams.tags.map((tag) => tag.name);
      }
      if (optionalParams.languages) {
        createParams.languages = optionalParams.languages;
      }
    }

    return (
      Lbry.channel_create(createParams)
        // outputs[0] is the certificate
        // outputs[1] is the change from the tx, not in the app currently
        .then((result: ChannelCreateResponse) => {
          const channelClaim = result.outputs[0];
          dispatch({
            type: ACTIONS.CREATE_CHANNEL_COMPLETED,
            data: { channelClaim },
          });
          dispatch({
            type: ACTIONS.UPDATE_PENDING_CLAIMS,
            data: {
              claims: [channelClaim],
            },
          });
          dispatch(doCheckPendingClaims(onConfirm));
          return channelClaim;
        })
        .catch((error) => {
          dispatch({
            type: ACTIONS.CREATE_CHANNEL_FAILED,
            data: error.message,
          });
        })
    );
  };
}

export function doUpdateChannel(params: any, cb: any) {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch({
      type: ACTIONS.UPDATE_CHANNEL_STARTED,
    });
    const state = getState();
    const myChannels = selectMyChannelClaims(state);
    const channelClaim = myChannels.find((myChannel) => myChannel.claim_id === params.claim_id);

    const updateParams = {
      claim_id: params.claim_id,
      bid: creditsToString(params.amount),
      title: params.title,
      cover_url: params.coverUrl,
      thumbnail_url: params.thumbnailUrl,
      description: params.description,
      website_url: params.website,
      email: params.email,
      tags: [],
      replace: true,
      languages: params.languages || [],
      locations: [],
      blocking: true,
    };

    if (params.tags) {
      updateParams.tags = params.tags.map((tag) => tag.name);
    }

    // we'll need to remove these once we add locations/channels to channel page edit/create options
    if (channelClaim && channelClaim.value && channelClaim.value.locations) {
      updateParams.locations = channelClaim.value.locations;
    }

    return Lbry.channel_update(updateParams)
      .then((result: ChannelUpdateResponse) => {
        const channelClaim = result.outputs[0];
        dispatch({
          type: ACTIONS.UPDATE_CHANNEL_COMPLETED,
          data: { channelClaim },
        });
        dispatch({
          type: ACTIONS.UPDATE_PENDING_CLAIMS,
          data: {
            claims: [channelClaim],
          },
        });
        dispatch(doCheckPendingClaims(cb));
        return Boolean(result.outputs[0]);
      })
      .then()
      .catch((error) => {
        dispatch({
          type: ACTIONS.UPDATE_CHANNEL_FAILED,
          data: error,
        });
      });
  };
}

export function doImportChannel(certificate: string) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.IMPORT_CHANNEL_STARTED,
    });

    return Lbry.channel_import({ channel_data: certificate })
      .then(() => {
        dispatch({
          type: ACTIONS.IMPORT_CHANNEL_COMPLETED,
        });
      })
      .catch((error) => {
        dispatch({
          type: ACTIONS.IMPORT_CHANNEL_FAILED,
          data: error,
        });
      });
  };
}

export const doFetchChannelListMine = (page: number = 1, pageSize: number = 99999, resolve: boolean = true) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const state = getState();
  const isFetching = selectFetchingMyChannels(state);

  if (isFetching) return;

  dispatch({ type: ACTIONS.FETCH_CHANNEL_LIST_STARTED });

  const callback = (response: ChannelListResponse) => {
    dispatch({ type: ACTIONS.FETCH_CHANNEL_LIST_COMPLETED, data: { claims: response.items } });
  };

  const failure = (error) => {
    dispatch({ type: ACTIONS.FETCH_CHANNEL_LIST_FAILED, data: error });
  };

  Lbry.channel_list({ page, page_size: pageSize, resolve }).then(callback, failure);
};

export const doFetchCollectionListMine = (page: number = 1, pageSize: number = 50) => async (dispatch: Dispatch) => {
  dispatch({ type: ACTIONS.FETCH_COLLECTION_LIST_STARTED });

  let options = {
    page: page,
    page_size: pageSize,
    resolve_claims: 1,
    resolve: true,
  };

  const success = (response: CollectionListResponse) => {
    const { items } = response;
    const collectionIds = items.map(({ claim_id }) => claim_id);

    dispatch({ type: ACTIONS.FETCH_COLLECTION_LIST_COMPLETED, data: { claims: items } });
    dispatch(doFetchItemsInCollections({ collectionIds, page_size: 5 }));
  };

  const failure = (error) => dispatch({ type: ACTIONS.FETCH_COLLECTION_LIST_FAILED, data: error });

  const autoPaginate = () => {
    let allClaims = [];

    const next = async (response: CollectionListResponse) => {
      const moreData = response.items.length === options.page_size;
      allClaims = allClaims.concat(response.items);

      // $FlowIgnore
      options.page++;

      if (!moreData) {
        // $FlowIgnore: the callback doesn't need all data anyway.
        return success({ items: allClaims });
      }

      try {
        const data = await Lbry.collection_list(options);
        return next(data);
      } catch (err) {
        failure(err);
      }
    };

    return next;
  };

  return await Lbry.collection_list(options).then(autoPaginate(), failure);
};

export function doClearClaimSearch() {
  return (dispatch: Dispatch) => {
    dispatch({ type: ACTIONS.CLEAR_CLAIM_SEARCH_HISTORY });
  };
}

export function doClaimSearch(
  options: ClaimSearchOptions = {
    no_totals: true,
    page_size: 10,
    page: 1,
  },
  settings: DoClaimSearchSettings = {
    useAutoPagination: false,
  }
) {
  const query = createNormalizedClaimSearchKey(options);
  return async (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.CLAIM_SEARCH_STARTED,
      data: { query: query },
    });

    const success = (data: ClaimSearchResponse) => {
      const resolveInfo = {};
      const urls = [];
      const streamClaimIds = new Set([]);
      const channelClaimIds = new Set([]);

      data.items.forEach((stream: Claim) => {
        resolveInfo[stream.canonical_url] = { stream };
        urls.push(stream.canonical_url);

        if (stream.value_type !== 'channel' && stream.value_type !== 'collection') {
          streamClaimIds.add(stream.claim_id);
        }

        const channelId = getChannelIdFromClaim(stream);
        if (channelId) channelClaimIds.add(channelId);
      });

      dispatch({
        type: ACTIONS.CLAIM_SEARCH_COMPLETED,
        data: {
          query,
          resolveInfo,
          urls,
          append: options.page && options.page !== 1,
          pageSize: options.page_size,
        },
      });

      if (streamClaimIds.size > 0) {
        dispatch(doMembershipContentForStreamClaimIds(Array.from(streamClaimIds)));
      }

      if (channelClaimIds.size > 0) {
        dispatch(doFetchOdyseeMembershipForChannelIds(Array.from(channelClaimIds)));
      }

      return resolveInfo;
    };

    const failure = (err) => {
      dispatch({
        type: ACTIONS.CLAIM_SEARCH_FAILED,
        data: { query },
        error: err,
      });
      return false;
    };

    const autoPaginate = () => {
      let allClaims = [];

      const next = async (data: ClaimSearchResponse) => {
        allClaims = allClaims.concat(data.items);

        const moreData = data.items.length === options.page_size;

        // $FlowIgnore
        options.page++;

        // $FlowIgnore
        if (options.page > 3 || !moreData) {
          // Flow doesn't understand that page_size is an optional property with a guaranteed default value.
          // $FlowFixMe
          return success({
            items: allClaims,
            page: options.page,
            page_size: options.page_size,
          });
        }

        try {
          const data = await Lbry.claim_search(options);
          return next(data);
        } catch (err) {
          failure(err);
        }
      };

      return next;
    };

    const successCallback = settings.useAutoPagination ? autoPaginate() : success;
    return await Lbry.claim_search(options).then(successCallback, failure);
  };
}

export function doRepost(options: StreamRepostOptions) {
  return (dispatch: Dispatch): Promise<any> => {
    return new Promise((resolve) => {
      dispatch({
        type: ACTIONS.CLAIM_REPOST_STARTED,
      });

      function success(response) {
        const repostClaim = response.outputs[0];
        dispatch({
          type: ACTIONS.CLAIM_REPOST_COMPLETED,
          data: {
            originalClaimId: options.claim_id,
            repostClaim,
          },
        });
        dispatch({
          type: ACTIONS.UPDATE_PENDING_CLAIMS,
          data: {
            claims: [repostClaim],
          },
        });

        dispatch(doFetchClaimListMine(1, 10));
        resolve(repostClaim);
      }

      function failure(error) {
        dispatch({
          type: ACTIONS.CLAIM_REPOST_FAILED,
          data: {
            error: error.message,
          },
        });
      }

      Lbry.stream_repost(options).then(success, failure);
    });
  };
}

export function doCollectionPublish(
  options: {
    name: string,
    bid: string,
    blocking: true,
    title?: string,
    channel_id?: string,
    thumbnail_url?: string,
    description?: string,
    tags?: Array<Tag>,
    languages?: Array<string>,
    claims: Array<string>,
  },
  localId: string
) {
  return (dispatch: Dispatch): Promise<any> => {
    // $FlowFixMe

    const params: {
      name: string,
      bid: string,
      channel_id?: string,
      blocking?: true,
      title?: string,
      thumbnail_url?: string,
      description?: string,
      tags?: Array<string>,
      languages?: Array<string>,
      claims: Array<string>,
    } = {
      name: options.name,
      bid: creditsToString(options.bid),
      title: options.title,
      thumbnail_url: options.thumbnail_url,
      description: options.description,
      tags: [],
      languages: options.languages || [],
      locations: [],
      blocking: true,
      claims: options.claims,
    };

    if (options.tags) {
      params['tags'] = options.tags.map((tag) => tag.name);
    }

    if (options.channel_id) {
      params['channel_id'] = options.channel_id;
    }

    if (params.description && typeof params.description !== 'string') {
      delete params.description;
    }

    return new Promise((resolve, reject) => {
      dispatch({
        type: ACTIONS.COLLECTION_PUBLISH_STARTED,
      });

      function success(response) {
        const collectionClaim = response.outputs[0];
        dispatch(
          batchActions(
            {
              type: ACTIONS.COLLECTION_PUBLISH_COMPLETED,
              data: { claimId: collectionClaim.claim_id },
            },
            // move unpublished collection to pending collection with new publish id
            // recent publish won't resolve this second. handle it in checkPending
            {
              type: ACTIONS.UPDATE_PENDING_CLAIMS,
              data: {
                claims: [collectionClaim],
              },
            }
          )
        );
        dispatch({
          type: ACTIONS.COLLECTION_PENDING,
          data: { localId: localId, claimId: collectionClaim.claim_id },
        });
        dispatch(doCheckPendingClaims());
        dispatch(doFetchCollectionListMine(1, 10));
        return resolve(collectionClaim);
      }

      function failure(error) {
        dispatch({ type: ACTIONS.COLLECTION_PUBLISH_FAILED });
        dispatch(doToast({ message: error.message, isError: true }));
        return reject(error);
      }

      return Lbry.collection_create(params).then(success, failure);
    });
  };
}

export function doCollectionPublishUpdate(
  options: {
    bid?: string,
    blocking?: true,
    title?: string,
    thumbnail_url?: string,
    description?: string,
    claim_id: string,
    tags?: Array<Tag>,
    languages?: Array<string>,
    claims?: Array<string>,
    channel_id?: string,
  },
  isBackgroundUpdate?: boolean
) {
  return (dispatch: Dispatch, getState: GetState): Promise<any> => {
    // TODO: implement one click update

    const updateParams: {
      bid?: string,
      blocking?: true,
      title?: string,
      thumbnail_url?: string,
      channel_id?: string,
      description?: string,
      claim_id: string,
      tags?: Array<string>,
      languages?: Array<string>,
      claims?: Array<string>,
      clear_claims: boolean,
      replace?: boolean,
    } = isBackgroundUpdate
      ? {
          blocking: true,
          claim_id: options.claim_id,
          clear_claims: true,
        }
      : {
          bid: creditsToString(options.bid),
          title: options.title,
          thumbnail_url: options.thumbnail_url,
          description: options.description,
          tags: [],
          languages: options.languages || [],
          locations: [],
          blocking: true,
          claim_id: options.claim_id,
          clear_claims: true,
          replace: true,
        };

    if (isBackgroundUpdate && updateParams.claim_id) {
      const state = getState();
      updateParams['claims'] = selectClaimIdsForCollectionId(state, updateParams.claim_id);
    } else if (options.claims) {
      updateParams['claims'] = options.claims;
    }

    if (options.tags) {
      updateParams['tags'] = options.tags.map((tag) => tag.name);
    }

    if (options.channel_id) {
      updateParams['channel_id'] = options.channel_id;
    }

    if (updateParams.description && typeof updateParams.description !== 'string') {
      delete updateParams.description;
    }

    return new Promise((resolve, reject) => {
      dispatch({
        type: ACTIONS.COLLECTION_PUBLISH_UPDATE_STARTED,
      });

      function success(response) {
        const collectionClaim = response.outputs[0];
        dispatch({
          type: ACTIONS.COLLECTION_PUBLISH_UPDATE_COMPLETED,
          data: {
            collectionClaim,
          },
        });
        dispatch({
          type: ACTIONS.COLLECTION_PENDING,
          data: { claimId: collectionClaim.claim_id },
        });
        dispatch({
          type: ACTIONS.UPDATE_PENDING_CLAIMS,
          data: {
            claims: [collectionClaim],
          },
        });
        dispatch(doCheckPendingClaims());
        return resolve(collectionClaim);
      }

      function failure(error) {
        dispatch({ type: ACTIONS.COLLECTION_PUBLISH_UPDATE_FAILED });
        dispatch(doToast({ message: error.message }));
        return reject(error);
      }

      return Lbry.collection_update(updateParams).then(success, failure);
    });
  };
}

export function doCheckPublishNameAvailability(name: string) {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch({
      type: ACTIONS.CHECK_PUBLISH_NAME_STARTED,
    });

    const state = getState();
    const myChannelClaimIds = selectMyChannelClaimIds(state);

    return dispatch(
      doClaimSearch(
        {
          name,
          channel_ids: myChannelClaimIds,
          page: 1,
          page_size: 50,
          no_totals: true,
          include_is_my_output: true,
        },
        {
          useAutoPagination: true,
        }
      )
    ).then((result) => {
      dispatch({
        type: ACTIONS.CHECK_PUBLISH_NAME_COMPLETED,
      });

      return Object.keys(result).length === 0;
    });
  };
}

export function doClearRepostError() {
  return {
    type: ACTIONS.CLEAR_REPOST_ERROR,
  };
}

export function doPurchaseList(page: number = 1, pageSize: number = PAGE_SIZE) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.PURCHASE_LIST_STARTED,
    });

    const success = (result: PurchaseListResponse) => {
      return dispatch({
        type: ACTIONS.PURCHASE_LIST_COMPLETED,
        data: {
          result,
        },
      });
    };

    const failure = (error) => {
      dispatch({
        type: ACTIONS.PURCHASE_LIST_FAILED,
        data: {
          error: error.message,
        },
      });
    };

    Lbry.purchase_list({
      page: page,
      page_size: pageSize,
      resolve: true,
    }).then(success, failure);
  };
}

export const doCheckPendingClaims = (onChannelConfirmed: Function) => (dispatch: Dispatch, getState: GetState) => {
  if (onChannelConfirmed) {
    onChannelConfirmCallback = onChannelConfirmed;
  }
  clearInterval(checkPendingInterval);
  const checkTxoList = () => {
    const state = getState();
    const pendingById = Object.assign({}, selectPendingClaimsById(state));
    const pendingTxos = (Object.values(pendingById): any).map((p) => p.txid);
    // use collections
    if (pendingTxos.length) {
      Lbry.txo_list({ txid: pendingTxos })
        .then((result) => {
          const txos = result.items;
          const idsToConfirm = [];
          txos.forEach((txo) => {
            if (txo.claim_id && txo.confirmations > 0) {
              idsToConfirm.push(txo.claim_id);
              delete pendingById[txo.claim_id];
            }
          });
          return { idsToConfirm, pendingById };
        })
        .then((results) => {
          const { idsToConfirm, pendingById } = results;
          if (idsToConfirm.length) {
            return Lbry.claim_list({ claim_id: idsToConfirm, resolve: true }).then((results) => {
              const claims = results.items;
              const collectionIds = claims.filter((c) => c.value_type === 'collection').map((c) => c.claim_id);
              dispatch({
                type: ACTIONS.UPDATE_CONFIRMED_CLAIMS,
                data: {
                  claims: claims,
                  pending: pendingById,
                },
              });
              if (collectionIds.length) {
                dispatch(doFetchItemsInCollections({ collectionIds }));
              }
              const channelClaims = claims.filter((claim) => claim.value_type === 'channel');
              if (channelClaims.length && onChannelConfirmCallback) {
                channelClaims.forEach((claim) => onChannelConfirmCallback(claim));
              }
              if (Object.keys(pendingById).length === 0) {
                clearInterval(checkPendingInterval);
              }
            });
          }
        });
    } else {
      clearInterval(checkPendingInterval);
    }
  };
  // do something with onConfirmed (typically get blocklist for channel)
  checkPendingInterval = setInterval(() => {
    checkTxoList();
  }, 30000);
};

export const doFetchLatestClaimForChannel = (uri: string, isEmbed?: boolean) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const searchOptions = {
    limit_claims_per_channel: 1,
    channel: uri,
    no_totals: true,
    order_by: ['release_time'],
    page: 1,
    has_source: true,
    stream_types: isEmbed ? ['audio', 'video'] : undefined,
  };

  return dispatch(doClaimSearch(searchOptions))
    .then((results) =>
      dispatch({
        type: ACTIONS.FETCH_LATEST_FOR_CHANNEL_DONE,
        data: { uri, results },
      })
    )
    .catch(() => dispatch({ type: ACTIONS.FETCH_LATEST_FOR_CHANNEL_FAIL }));
};
