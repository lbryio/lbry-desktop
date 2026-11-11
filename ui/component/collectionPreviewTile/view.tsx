import React from "react";
import classnames from "classnames";
import { NavLink, useHistory } from "react-router-dom";
import ClaimPreviewTile from "component/claimPreviewTile";
import TruncatedText from "component/common/truncated-text";
import CollectionCount from "./collectionCount";
import CollectionPrivate from "./collectionPrivate";
import CollectionMenuList from "component/collectionMenuList";
import { formatLbryUrlForWeb, generateListSearchUrlParams } from "util/url";
import FileThumbnail from "component/fileThumbnail";

type Props = {
  uri: string;
  // @ts-expect-error - TS2300 - Duplicate identifier 'collectionId'.
  collectionId: string;
  collectionName: string;
  collectionCount: number;
  editedCollection?: Collection;
  pendingCollection?: Collection;
  claim: Claim | null | undefined;
  channelClaim: ChannelClaim | null | undefined;
  collectionItemUrls: Array<string>;
  resolveUri: (arg1: string) => void;
  isResolvingUri: boolean;
  thumbnail?: string;
  title?: string;
  placeholder: boolean;
  blackListedOutpoints: Array<{
    txid: string;
    nout: number;
  }>;
  filteredOutpoints: Array<{
    txid: string;
    nout: number;
  }>;
  blockedChannelUris: Array<string>;
  isMature?: boolean;
  showMature: boolean;
  // @ts-expect-error - TS2300 - Duplicate identifier 'collectionId'.
  collectionId: string;
  deleteCollection: (arg1: string) => void;
  resolveCollectionItems: (arg1?: any) => void;
  isResolvingCollectionClaims: boolean;
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
  }, [collectionId, hasClaim, resolveCollectionItems]);

  const navigateUrl =
    formatLbryUrlForWeb(collectionItemUrls[0] || "/") + (collectionId ? generateListSearchUrlParams(collectionId) : "");

  function handleClick(e: unknown) {
    if (navigateUrl) {
      push(navigateUrl);
    }
  }

  const navLinkProps = {
    to: navigateUrl,
    onClick: (e) => e.stopPropagation(),
  } as const;

  if (isResolvingUri || isResolvingCollectionClaims) {
    return (
      <li className={classnames("claim-preview--tile", {})}>
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
    <li role="link" onClick={handleClick} className={"card claim-preview--tile"}>
      <NavLink {...navLinkProps}>
        {/* @ts-expect-error - TS2739 (ts-migration) */}
        <FileThumbnail uri={collectionItemUrls && collectionItemUrls.length && collectionItemUrls[0]}>
          <React.Fragment>
            <div className="claim-preview__claim-property-overlay">
              <CollectionCount count={collectionCount} />
            </div>
          </React.Fragment>
        </FileThumbnail>
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
