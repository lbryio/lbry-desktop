// @flow
import * as PAGES from 'constants/pages';
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import { useIsMobile } from 'effects/use-screensize';
import ClaimSupportButton from 'component/claimSupportButton';
import FileReactions from 'component/fileReactions';
import { useHistory } from 'react-router';
import { EDIT_PAGE, PAGE_VIEW_QUERY } from 'page/collection/view';
import classnames from 'classnames';
import { ENABLE_FILE_REACTIONS } from 'config';
import { COLLECTIONS_CONSTS } from 'lbry-redux';
import { formatLbryUrlForWeb } from 'util/url';

type Props = {
  uri: string,
  claim: StreamClaim,
  openModal: (id: string, { uri: string, claimIsMine?: boolean, isSupport?: boolean }) => void,
  myChannels: ?Array<ChannelClaim>,
  doToast: ({ message: string }) => void,
  claimIsPending: boolean,
  isMyCollection: boolean,
  collectionId: string,
  showInfo: boolean,
  setShowInfo: (boolean) => void,
  collectionHasEdits: boolean,
  isBuiltin: boolean,
  doToggleShuffleList: (string, boolean) => void,
  doToggleLoopList: (string, boolean) => void,
  playNextUri: string,
  playNextClaim: StreamClaim,
  doPlayUri: (string) => void,
  doSetPlayingUri: (string) => void,
  firstItem: string,
};

function CollectionActions(props: Props) {
  const {
    uri,
    openModal,
    claim,
    claimIsPending,
    isMyCollection,
    collectionId,
    showInfo,
    setShowInfo,
    collectionHasEdits,
    isBuiltin,
    doToggleShuffleList,
    doToggleLoopList,
    playNextUri,
    playNextClaim,
    doPlayUri,
    doSetPlayingUri,
    firstItem,
  } = props;
  const [doShuffle, setDoShuffle] = React.useState(false);
  const { push } = useHistory();
  const isMobile = useIsMobile();
  const claimId = claim && claim.claim_id;
  const webShareable = true; // collections have cost?

  const doPlay = React.useCallback(
    (uri) => {
      const collectionParams = new URLSearchParams();
      collectionParams.set(COLLECTIONS_CONSTS.COLLECTION_ID, collectionId);
      const navigateUrl = formatLbryUrlForWeb(uri) + `?` + collectionParams.toString();
      push(navigateUrl);
      doSetPlayingUri(uri);
      doPlayUri(uri);
    },
    [collectionId, push, doSetPlayingUri, doPlayUri]
  );

  React.useEffect(() => {
    if (playNextClaim && doShuffle) {
      setDoShuffle(false);
      doPlay(playNextUri);
    }
  }, [doPlay, doShuffle, playNextClaim, playNextUri]);

  const lhsSection = (
    <>
      <Button
        className="button--file-action"
        icon={ICONS.PLAY}
        label={__('Play')}
        title={__('Play')}
        onClick={() => {
          doToggleShuffleList(collectionId, false);
          doToggleLoopList(collectionId, false);
          doPlay(firstItem);
        }}
      />
      <Button
        className="button--file-action"
        icon={ICONS.SHUFFLE}
        label={__('Shuffle Play')}
        title={__('Shuffle Play')}
        onClick={() => {
          doToggleShuffleList(collectionId, true);
          setDoShuffle(true);
        }}
      />
      {!isBuiltin && (
        <>
          {ENABLE_FILE_REACTIONS && uri && <FileReactions uri={uri} />}
          {uri && <ClaimSupportButton uri={uri} fileAction />}
          {/* TODO Add ClaimRepostButton component */}
          {uri && (
            <Button
              className="button--file-action"
              icon={ICONS.SHARE}
              label={__('Share')}
              title={__('Share')}
              onClick={() => openModal(MODALS.SOCIAL_SHARE, { uri, webShareable })}
            />
          )}
        </>
      )}
    </>
  );

  const rhsSection = (
    <>
      {!isBuiltin &&
        (isMyCollection ? (
          <>
            <Button
              title={uri ? __('Update') : __('Publish')}
              label={uri ? __('Update') : __('Publish')}
              className={classnames('button--file-action')}
              onClick={() => push(`?${PAGE_VIEW_QUERY}=${EDIT_PAGE}`)}
              icon={ICONS.PUBLISH}
              iconColor={collectionHasEdits && 'red'}
              iconSize={18}
              disabled={claimIsPending}
            />
            <Button
              className={classnames('button--file-action')}
              title={__('Delete List')}
              onClick={() => openModal(MODALS.COLLECTION_DELETE, { uri, collectionId, redirect: `/$/${PAGES.LISTS}` })}
              icon={ICONS.DELETE}
              iconSize={18}
              description={__('Delete List')}
              disabled={claimIsPending}
            />
          </>
        ) : (
          <Button
            title={__('Report content')}
            className="button--file-action"
            icon={ICONS.REPORT}
            navigate={`/$/${PAGES.REPORT_CONTENT}?claimId=${claimId}`}
          />
        ))}
    </>
  );

  const infoButton = (
    <Button
      title={__('Info')}
      className={classnames('button-toggle', {
        'button-toggle--active': showInfo,
      })}
      icon={ICONS.MORE}
      onClick={() => setShowInfo(!showInfo)}
    />
  );

  if (isMobile) {
    return (
      <div className="media__actions">
        {lhsSection}
        {rhsSection}
        {uri && <span>{infoButton}</span>}
      </div>
    );
  } else {
    return (
      <div className="media__subtitle--between">
        <div className="section__actions">
          {lhsSection}
          {rhsSection}
        </div>
        {uri && <>{infoButton}</>}
      </div>
    );
  }
}

export default CollectionActions;
