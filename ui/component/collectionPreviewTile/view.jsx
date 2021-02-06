// @flow
import React from 'react';
import classnames from 'classnames';
import { NavLink, useHistory } from 'react-router-dom';
import ClaimPreviewTile from 'component/claimPreviewTile';
import CollectionPreviewOverlay from 'component/collectionPreviewOverlay';
import TruncatedText from 'component/common/truncated-text';
import CollectionCount from './collectionCount';
import CollectionPrivate from './collectionPrivate';
import CollectionMenuList from 'component/collectionMenuList';
import { formatLbryUrlForWeb } from 'util/url';
import { COLLECTIONS_CONSTS } from 'lbry-redux';

type Props = {
  uri: string,
  collectionId: string,
  collectionName: string,
  collectionCount: number,
  editedCollection?: Collection,
  pendingCollection?: Collection,
  claim: ?Claim,
  channelClaim: ?ChannelClaim,
  collectionItemUrls: Array<string>,
  resolveUri: (string) => void,
  isResolvingUri: boolean,
  thumbnail?: string,
  title?: string,
  placeholder: boolean,
  blackListedOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
  filteredOutpoints: Array<{
    txid: string,
    nout: number,
  }>,
  blockedChannelUris: Array<string>,
  isMature?: boolean,
  showMature: boolean,
  collectionId: string,
  deleteCollection: (string) => void,
  resolveCollectionItems: (any) => void,
  isResolvingCollectionClaims: boolean,
};

function CollectionPreviewTile(props: Props) {
  const {
    uri,
    collectionId,
    collectionName,
    collectionCount,
    isResolvingUri,
    isResolvingCollectionClaims,
    collectionItemUrls,
    claim,
    resolveCollectionItems,
  } = props;

  const { push } = useHistory();
  const hasClaim = Boolean(claim);
  React.useEffect(() => {
    if (collectionId && hasClaim && resolveCollectionItems) {
      resolveCollectionItems({ collectionId, page_size: 5 });
    }
  }, [collectionId, hasClaim]);

  // const signingChannel = claim && claim.signing_channel;

  let navigateUrl = formatLbryUrlForWeb(collectionItemUrls[0] || '/');
  if (collectionId) {
    const collectionParams = new URLSearchParams();
    collectionParams.set(COLLECTIONS_CONSTS.COLLECTION_ID, collectionId);
    navigateUrl = navigateUrl + `?` + collectionParams.toString();
  }

  function handleClick(e) {
    if (navigateUrl) {
      push(navigateUrl);
    }
  }

  const navLinkProps = {
    to: navigateUrl,
    onClick: (e) => e.stopPropagation(),
  };

  /* REMOVE IF WORKS
  let shouldHide = false;

  if (isMature && !showMature) {
    // Unfortunately needed until this is resolved
    // https://github.com/lbryio/lbry-sdk/issues/2785
    shouldHide = true;
  }

  // This will be replaced once blocking is done at the wallet server level
  if (claim && !shouldHide && blackListedOutpoints) {
    shouldHide = blackListedOutpoints.some(
      (outpoint) =>
        (signingChannel && outpoint.txid === signingChannel.txid && outpoint.nout === signingChannel.nout) ||
        (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
    );
  }
  // We're checking to see if the stream outpoint
  // or signing channel outpoint is in the filter list
  if (claim && !shouldHide && filteredOutpoints) {
    shouldHide = filteredOutpoints.some(
      (outpoint) =>
        (signingChannel && outpoint.txid === signingChannel.txid && outpoint.nout === signingChannel.nout) ||
        (outpoint.txid === claim.txid && outpoint.nout === claim.nout)
    );
  }

  // block stream claims
  if (claim && !shouldHide && blockedChannelUris.length && signingChannel) {
    shouldHide = blockedChannelUris.some((blockedUri) => blockedUri === signingChannel.permanent_url);
  }
  // block channel claims if we can't control for them in claim search
  // e.g. fetchRecommendedSubscriptions

  if (shouldHide) {
    return null;
  }
   */

  if (isResolvingUri || isResolvingCollectionClaims) {
    return (
      <li className={classnames('claim-preview--tile', {})}>
        <div className="placeholder media__thumb" />
        <div className="placeholder__wrapper">
          <div className="placeholder claim-tile__title" />
          <div className="placeholder claim-tile__info" />
        </div>
      </li>
    );
  }
  if (uri) {
    return <ClaimPreviewTile uri={uri} />;
  }

  return (
    <li role="link" onClick={handleClick} className={'card claim-preview--tile'}>
      <NavLink {...navLinkProps}>
        <div className={classnames('media__thumb')}>
          <React.Fragment>
            <div className="claim-preview__collection-wrapper">
              <CollectionPreviewOverlay collectionId={collectionId} />
            </div>
            <div className="claim-preview__claim-property-overlay">
              <CollectionCount count={collectionCount} />
            </div>
          </React.Fragment>
        </div>
      </NavLink>
      <NavLink {...navLinkProps}>
        <h2 className="claim-tile__title">
          <TruncatedText text={collectionName} lines={1} />
          <CollectionMenuList collectionId={collectionId} />
        </h2>
      </NavLink>
      <div>
        <div className="claim-tile__info">
          <React.Fragment>
            <div className="claim-tile__about">
              <CollectionPrivate />
            </div>
          </React.Fragment>
        </div>
      </div>
    </li>
  );
}

export default CollectionPreviewTile;
