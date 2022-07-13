// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import { MenuItem } from '@reach/menu-button';
import Icon from 'component/common/icon';

type Props = {
  uri: string,
  focusable: boolean,
  menuItem?: boolean,
  // -- redux --
  hasClaimInQueue: boolean,
  hasPlayingUriInQueue: boolean,
  playingUri: PlayingUri,
  playingUrl: ?string,
  playingCollectionUrls: ?Array<string>,
  doToast: (props: { message: string }) => void,
  doCollectionEdit: (id: string, any) => void,
  doUriInitiatePlay: (playingOptions: PlayingUri, isPlayable?: boolean, isFloating?: boolean) => void,
  doSetPlayingUri: (props: any) => void,
};

function ButtonAddToQueue(props: Props) {
  const {
    uri,
    focusable = true,
    menuItem,
    hasClaimInQueue,
    hasPlayingUriInQueue,
    playingUri,
    playingUrl,
    playingCollectionUrls,
    doToast,
    doCollectionEdit,
    doUriInitiatePlay,
    doSetPlayingUri,
  } = props;

  function handleQueue(e) {
    if (e) e.preventDefault();

    doToast({ message: hasClaimInQueue ? __('Item removed from Queue') : __('Item added to Queue') });

    const itemsToAdd = playingCollectionUrls || [playingUrl];
    doCollectionEdit(COLLECTIONS_CONSTS.QUEUE_ID, {
      uris: playingUrl && playingUrl !== uri && !hasPlayingUriInQueue ? [...itemsToAdd, uri] : [uri],
      remove: hasClaimInQueue,
      type: 'playlist',
    });

    if (!hasClaimInQueue) {
      const paramsToAdd = {
        collection: { collectionId: COLLECTIONS_CONSTS.QUEUE_ID },
        source: COLLECTIONS_CONSTS.QUEUE_ID,
      };

      if (playingUrl) {
        // adds the queue collection id to the playingUri data so it can be used and updated by other components
        if (!hasPlayingUriInQueue) doSetPlayingUri({ ...playingUri, ...paramsToAdd });
      } else {
        // There is nothing playing and added a video to queue -> the first item will play on the floating player with the list open
        doUriInitiatePlay({ uri, ...paramsToAdd }, true, true);
      }
    }
  }

  // label that is shown after hover
  const label = !hasClaimInQueue ? __('Add to Queue') : __('In Queue');

  if (menuItem) {
    return (
      <MenuItem className="comment__menu-option" onSelect={handleQueue}>
        <div className="menu__link">
          <Icon aria-hidden icon={hasClaimInQueue ? ICONS.PLAYLIST_FILLED : ICONS.PLAYLIST} />
          {hasClaimInQueue ? __('In Queue') : __('Add to Queue')}
        </div>
      </MenuItem>
    );
  }

  return (
    <div className="claim-preview__hover-actions third-item">
      <Button
        title={__('Queue Mode')}
        label={label}
        className="button--file-action"
        icon={hasClaimInQueue ? ICONS.PLAYLIST_FILLED : ICONS.PLAYLIST_ADD}
        onClick={(e) => handleQueue(e)}
        tabIndex={focusable ? 0 : -1}
      />
    </div>
  );
}

export default ButtonAddToQueue;
