// @flow
import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import TruncatedText from 'component/common/truncated-text';
import CollectionItemCount from './internal/collection-item-count';
import CollectionPrivateIcon from 'component/common/collection-private-icon';
import CollectionPublicIcon from './internal/collection-public-icon';
import CollectionMenuList from 'component/collectionMenuList';
import { COL_TYPES } from 'constants/collections';
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import FileThumbnail from 'component/fileThumbnail';
import ChannelThumbnail from 'component/channelThumbnail';
import UriIndicator from 'component/uriIndicator';
import DateTime from 'component/dateTime';
import { formatLbryUrlForWeb, generateListSearchUrlParams } from 'util/url';
import CollectionPreviewOverlay from 'component/collectionPreviewOverlay';
import Button from 'component/button';
import ClaimPreviewLoading from 'component/common/claim-preview-loading';
import Icon from 'component/common/icon';
import './style.scss';

type Props = {
  uri: string,
  collectionId: string,
  // -- redux --
  collectionCount: number,
  collectionName: string,
  collectionItemUrls: Array<string>,
  collectionType: ?string,
  isResolvingCollectionClaims: boolean,
  isResolvingUri: boolean,
  title?: string,
  channel: ?any,
  channelTitle?: String,
  hasClaim: boolean,
  firstCollectionItemUrl: ?string,
  collectionUpdatedAt: number,
  collectionCreatedAt: ?number,
  hasEdits: boolean,
  isBuiltin: boolean,
  thumbnail: ?string,
  isEmpty: boolean,
};

function CollectionPreview(props: Props) {
  const {
    uri,
    collectionId,
    collectionName,
    collectionCount,
    isResolvingUri,
    isResolvingCollectionClaims,
    collectionItemUrls,
    collectionType,
    hasClaim,
    firstCollectionItemUrl,
    channel,
    channelTitle,
    collectionUpdatedAt,
    collectionCreatedAt,
    hasEdits,
    isBuiltin,
    thumbnail,
    isEmpty,
  } = props;

  const { push } = useHistory();

  if (isResolvingUri || isResolvingCollectionClaims) {
    return <ClaimPreviewLoading />;
  }

  const navigateUrl = `/$/${PAGES.PLAYLIST}/${collectionId}`;
  const firstItemPath = formatLbryUrlForWeb(collectionItemUrls[0] || '/');
  const hidePlayAll = collectionType === COL_TYPES.FEATURED_CHANNELS || collectionType === COL_TYPES.CHANNELS;

  function handleClick(e) {
    if (navigateUrl) {
      push(navigateUrl);
    }
  }

  const navLinkProps = {
    to: navigateUrl,
    onClick: (e) => e.stopPropagation(),
  };

  if (collectionId === COLLECTIONS_CONSTS.QUEUE_ID && isEmpty) return null;

  return (
    <li
      role="link"
      onClick={handleClick}
      className="li--no-style claim-preview__wrapper playlist-claim-preview__wrapper"
    >
      <div className="table-column__thumbnail">
        <NavLink {...navLinkProps}>
          <FileThumbnail uri={firstCollectionItemUrl} thumbnail={thumbnail}>
            <CollectionItemCount count={collectionCount} hasEdits={hasEdits} />
            <CollectionPreviewOverlay collectionId={collectionId} />
          </FileThumbnail>
        </NavLink>
      </div>

      <div className="table-column__title">
        <NavLink {...navLinkProps}>
          <h2>
            {isBuiltin && <Icon icon={COLLECTIONS_CONSTS.PLAYLIST_ICONS[collectionId]} />}
            <TruncatedText text={collectionName} lines={1} style={{ marginRight: 'var(--spacing-s)' }} />
          </h2>
        </NavLink>
        {hasClaim && (
          <div className="claim-preview__overlay-properties--small playlist-channel">
            <UriIndicator focusable={false} uri={channel && channel.permanent_url} link showHiddenAsAnonymous>
              <ChannelThumbnail uri={channel && channel.permanent_url} xsmall checkMembership={false} />
              {channelTitle && channelTitle}
            </UriIndicator>
          </div>
        )}
      </div>

      <div className="table-column__meta" uri={uri}>
        <div className="table-column__visibility">
          <div className="claim-preview-info">{hasClaim ? <CollectionPublicIcon /> : <CollectionPrivateIcon />}</div>
        </div>

        <div className="table-column__create-at" uri={uri}>
          {collectionCreatedAt && (
            <>
              <Icon icon={ICONS.TIME} />
              <DateTime timeAgo date={collectionCreatedAt} />
            </>
          )}
        </div>

        <div className="table-column__update-at" uri={uri}>
          <Icon icon={ICONS.EDIT} />
          <DateTime timeAgo date={collectionUpdatedAt} />
        </div>
      </div>

      <div className="table-column__action">
        {collectionCount > 0 && !hidePlayAll && (
          <Button
            button="alt"
            label={__('Play All')}
            icon={ICONS.PLAY}
            onClick={() =>
              push({
                pathname: firstItemPath,
                search: generateListSearchUrlParams(collectionId),
                state: { forceAutoplay: true },
              })
            }
          />
        )}
      </div>

      <CollectionMenuList collectionId={collectionId} />
    </li>
  );
}

export default CollectionPreview;
