// @flow
import * as ICONS from 'constants/icons';
import React, { useRef } from 'react';
import Button from 'component/button';
import useHover from 'effects/use-hover';
import { useHistory } from 'react-router';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import { formatLbryUrlForWeb } from 'util/url';

type Props = {
  uri: string,
  focusable: boolean,
  hasClaimInWatchLater: boolean,
  doPlaylistAddAndAllowPlaying: (params: {
    uri: string,
    collectionName: string,
    collectionId: string,
    push: (uri: string) => void,
  }) => void,
};

function FileWatchLaterLink(props: Props) {
  const { uri, hasClaimInWatchLater, focusable = true, doPlaylistAddAndAllowPlaying } = props;

  const {
    push,
    location: { search },
  } = useHistory();

  const buttonRef = useRef();
  let isHovering = useHover(buttonRef);

  function handleWatchLater(e) {
    if (e) e.preventDefault();

    const urlParams = new URLSearchParams(search);
    urlParams.set(COLLECTIONS_CONSTS.COLLECTION_ID, COLLECTIONS_CONSTS.WATCH_LATER_ID);

    doPlaylistAddAndAllowPlaying({
      uri,
      collectionName: COLLECTIONS_CONSTS.WATCH_LATER_NAME,
      collectionId: COLLECTIONS_CONSTS.WATCH_LATER_ID,
      push: (pushUri) =>
        push({
          pathname: formatLbryUrlForWeb(pushUri),
          search: urlParams.toString(),
          state: { collectionId: COLLECTIONS_CONSTS.WATCH_LATER_ID, forceAutoplay: true },
        }),
    });
  }

  // text that will show if you keep cursor over button
  const title = hasClaimInWatchLater ? __('Remove from Watch Later') : __('Add to Watch Later');

  // label that is shown after hover
  const label = !hasClaimInWatchLater ? __('Watch Later') : __('Remove');

  return (
    <div className="claim-preview__hover-actions second-item">
      <Button
        ref={buttonRef}
        requiresAuth
        title={title}
        label={label}
        className="button--file-action"
        icon={(hasClaimInWatchLater && (isHovering ? ICONS.REMOVE : ICONS.COMPLETED)) || ICONS.TIME}
        onClick={(e) => handleWatchLater(e)}
        tabIndex={focusable ? 0 : -1}
      />
    </div>
  );
}

export default FileWatchLaterLink;
