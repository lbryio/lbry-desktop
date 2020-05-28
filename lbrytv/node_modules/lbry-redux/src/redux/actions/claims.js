// @flow
import * as ACTIONS from 'constants/action_types';
import * as ABANDON_STATES from 'constants/abandon_states';
import Lbry from 'lbry';
import { normalizeURI } from 'lbryURI';
import { doToast } from 'redux/actions/notifications';
import {
  selectMyClaimsRaw,
  selectResolvingUris,
  selectClaimsByUri,
  selectMyChannelClaims,
} from 'redux/selectors/claims';
import { doFetchTxoPage } from 'redux/actions/wallet';
import { selectSupportsByOutpoint } from 'redux/selectors/wallet';
import { creditsToString } from 'util/format-credits';
import { batchActions } from 'util/batch-actions';
import { createNormalizedClaimSearchKey } from 'util/claim';

export function doResolveUris(uris: Array<string>, returnCachedClaims: boolean = false) {
  return (dispatch: Dispatch, getState: GetState) => {
    const normalizedUris = uris.map(normalizeURI);
    const state = getState();

    const resolvingUris = selectResolvingUris(state);
    const claimsByUri = selectClaimsByUri(state);
    const urisToResolve = normalizedUris.filter(uri => {
      if (resolvingUris.includes(uri)) {
        return false;
      }

      return returnCachedClaims ? !claimsByUri[uri] : true;
    });

    if (urisToResolve.length === 0) {
      return;
    }

    const options: { include_is_my_output?: boolean, include_purchase_receipt: boolean } = {
      include_purchase_receipt: true,
    };

    if (urisToResolve.length === 1) {
      options.include_is_my_output = true;
    }
    dispatch({
      type: ACTIONS.RESOLVE_URIS_STARTED,
      data: { uris: normalizedUris },
    });

    const resolveInfo: {
      [string]: {
        stream: ?StreamClaim,
        channel: ?ChannelClaim,
        claimsInChannel: ?number,
      },
    } = {};

    return Lbry.resolve({ urls: urisToResolve, ...options }).then((result: ResolveResponse) => {
      Object.entries(result).forEach(([uri, uriResolveInfo]) => {
        const fallbackResolveInfo = {
          stream: null,
          claimsInChannel: null,
          channel: null,
        };

        // Flow has terrible Object.entries support
        // https://github.com/facebook/flow/issues/2221
        if (uriResolveInfo) {
          if (uriResolveInfo.error) {
            resolveInfo[uri] = { ...fallbackResolveInfo };
          } else {
            let result = {};
            if (uriResolveInfo.value_type === 'channel') {
              result.channel = uriResolveInfo;
              // $FlowFixMe
              result.claimsInChannel = uriResolveInfo.meta.claims_in_channel;
            } else {
              result.stream = uriResolveInfo;
              if (uriResolveInfo.signing_channel) {
                result.channel = uriResolveInfo.signing_channel;
                result.claimsInChannel =
                  (uriResolveInfo.signing_channel.meta &&
                    uriResolveInfo.signing_channel.meta.claims_in_channel) ||
                  0;
              }
            }
            // $FlowFixMe
            resolveInfo[uri] = result;
          }
        }
      });

      dispatch({
        type: ACTIONS.RESOLVE_URIS_COMPLETED,
        data: { resolveInfo },
      });
      return result;
    });
  };
}

export function doResolveUri(uri: string) {
  return doResolveUris([uri]);
}

export function doFetchClaimListMine(
  page: number = 1,
  pageSize: number = 99999,
  resolve: boolean = true
) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.FETCH_CLAIM_LIST_MINE_STARTED,
    });

    // $FlowFixMe
    Lbry.claim_list({
      page: page,
      page_size: pageSize,
      claim_type: ['stream', 'repost'],
      resolve,
    }).then((result: StreamListResponse) => {
      dispatch({
        type: ACTIONS.FETCH_CLAIM_LIST_MINE_COMPLETED,
        data: {
          result,
          resolve,
        },
      });
    });
  };
}

export function doAbandonTxo(txo: Txo, cb: string => void) {
  return (dispatch: Dispatch) => {
    if (cb) cb(ABANDON_STATES.PENDING);
    const isClaim = txo.type === 'claim';
    const isSupport = txo.type === 'support' && txo.is_my_input === true;
    const isTip = txo.type === 'support' && txo.is_my_input === false;

    const data = isClaim ? { claimId: txo.claim_id } : { outpoint: `${txo.txid}:${txo.nout}` };

    const startedActionType = isClaim
      ? ACTIONS.ABANDON_CLAIM_STARTED
      : ACTIONS.ABANDON_SUPPORT_STARTED;
    const completedActionType = isClaim
      ? ACTIONS.ABANDON_CLAIM_SUCCEEDED
      : ACTIONS.ABANDON_SUPPORT_COMPLETED;

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

export function doAbandonClaim(txid: string, nout: number, cb: string => void) {
  const outpoint = `${txid}:${nout}`;

  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    const myClaims: Array<Claim> = selectMyClaimsRaw(state);
    const mySupports: { [string]: Support } = selectSupportsByOutpoint(state);

    // A user could be trying to abandon a support or one of their claims
    const claimToAbandon = myClaims.find(claim => claim.txid === txid && claim.nout === nout);
    const supportToAbandon = mySupports[outpoint];

    if (!claimToAbandon && !supportToAbandon) {
      console.error('No associated support or claim with txid: ', txid);
      return;
    }

    const data = claimToAbandon
      ? { claimId: claimToAbandon.claim_id }
      : { outpoint: `${supportToAbandon.txid}:${supportToAbandon.nout}` };

    const isClaim = !!claimToAbandon;
    const startedActionType = isClaim
      ? ACTIONS.ABANDON_CLAIM_STARTED
      : ACTIONS.ABANDON_SUPPORT_STARTED;
    const completedActionType = isClaim
      ? ACTIONS.ABANDON_CLAIM_SUCCEEDED
      : ACTIONS.ABANDON_SUPPORT_COMPLETED;

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

export function doCreateChannel(name: string, amount: number, optionalParams: any) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.CREATE_CHANNEL_STARTED,
    });

    const createParams: {
      name: string,
      bid: string,
      blocking: true,
      title?: string,
      cover_url?: string,
      thumbnail_url?: string,
      description?: string,
      website_url?: string,
      email?: string,
      tags?: Array<string>,
    } = {
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
        createParams.tags = optionalParams.tags.map(tag => tag.name);
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
          return channelClaim;
        })
        .catch(error => {
          dispatch({
            type: ACTIONS.CREATE_CHANNEL_FAILED,
            data: error.message,
          });
          return error;
        })
    );
  };
}

export function doUpdateChannel(params: any) {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch({
      type: ACTIONS.UPDATE_CHANNEL_STARTED,
    });
    const state = getState();
    const myChannels = selectMyChannelClaims(state);
    const channelClaim = myChannels.find(myChannel => myChannel.claim_id === params.claim_id);

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
      languages: [],
      locations: [],
      blocking: true,
    };

    if (params.tags) {
      updateParams.tags = params.tags.map(tag => tag.name);
    }

    // we'll need to remove these once we add locations/channels to channel page edit/create options

    if (channelClaim && channelClaim.value && channelClaim.value.locations) {
      updateParams.locations = channelClaim.value.locations;
    }

    if (channelClaim && channelClaim.value && channelClaim.value.languages) {
      updateParams.languages = channelClaim.value.languages;
    }

    return Lbry.channel_update(updateParams)
      .then((result: ChannelUpdateResponse) => {
        const channelClaim = result.outputs[0];
        dispatch({
          type: ACTIONS.UPDATE_CHANNEL_COMPLETED,
          data: { channelClaim },
        });
      })
      .catch(error => {
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
      .then((result: string) => {
        dispatch({
          type: ACTIONS.IMPORT_CHANNEL_COMPLETED,
        });
      })
      .catch(error => {
        dispatch({
          type: ACTIONS.IMPORT_CHANNEL_FAILED,
          data: error,
        });
      });
  };
}

export function doFetchChannelListMine(
  page: number = 1,
  pageSize: number = 99999,
  resolve: boolean = true
) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.FETCH_CHANNEL_LIST_STARTED,
    });

    const callback = (response: ChannelListResponse) => {
      dispatch({
        type: ACTIONS.FETCH_CHANNEL_LIST_COMPLETED,
        data: { claims: response.items },
      });
    };

    Lbry.channel_list({ page, page_size: pageSize, resolve }).then(callback);
  };
}

export function doClaimSearch(
  options: {
    page_size: number,
    page: number,
    no_totals: boolean,
    any_tags?: Array<string>,
    channel_ids?: Array<string>,
    not_channel_ids?: Array<string>,
    not_tags?: Array<string>,
    order_by?: Array<string>,
    release_time?: string,
  } = {
    no_totals: true,
    page_size: 10,
    page: 1,
  }
) {
  const query = createNormalizedClaimSearchKey(options);
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.CLAIM_SEARCH_STARTED,
      data: { query: query },
    });

    const success = (data: ClaimSearchResponse) => {
      const resolveInfo = {};
      const urls = [];
      data.items.forEach((stream: Claim) => {
        resolveInfo[stream.canonical_url] = { stream };
        urls.push(stream.canonical_url);
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
    };

    const failure = err => {
      dispatch({
        type: ACTIONS.CLAIM_SEARCH_FAILED,
        data: { query },
        error: err,
      });
    };

    Lbry.claim_search({
      ...options,
      include_purchase_receipt: true,
    }).then(success, failure);
  };
}

export function doRepost(options: StreamRepostOptions) {
  return (dispatch: Dispatch) => {
    // $FlowFixMe
    return new Promise(resolve => {
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

export function doCheckPublishNameAvailability(name: string) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ACTIONS.CHECK_PUBLISH_NAME_STARTED,
    });

    return Lbry.claim_list({ name: name }).then(result => {
      dispatch({
        type: ACTIONS.CHECK_PUBLISH_NAME_COMPLETED,
      });
      if (result.items.length) {
        dispatch({
          type: ACTIONS.FETCH_CLAIM_LIST_MINE_COMPLETED,
          data: {
            result,
            resolve: false,
          },
        });
      }
      return !(result && result.items && result.items.length);
    });
  };
}

export function doClearRepostError() {
  return {
    type: ACTIONS.CLEAR_REPOST_ERROR,
  };
}

export function doPurchaseList(page: number = 1, pageSize: number = 99999) {
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

    const failure = error => {
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
