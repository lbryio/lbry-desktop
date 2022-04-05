// @flow
import * as ICONS from 'constants/icons';
import React, { useRef } from 'react';
import Button from 'component/button';
import useHover from 'effects/use-hover';
import * as COLLECTIONS_CONSTS from 'constants/collections';

type Props = {
  uri: string,
  focusable: boolean,
  hasClaimInWatchLater: boolean,
  doToast: ({ message: string }) => void,
  doCollectionEdit: (string, any) => void,
};

function FileWatchLaterLink(props: Props) {
  const { uri, hasClaimInWatchLater, doToast, doCollectionEdit, focusable = true } = props;
  const buttonRef = useRef();
  let isHovering = useHover(buttonRef);

  function handleWatchLater(e) {
    e.preventDefault();
    doToast({
      message: hasClaimInWatchLater ? __('Item removed from Watch Later') : __('Item added to Watch Later'),
      linkText: !hasClaimInWatchLater && __('See All'),
      linkTarget: !hasClaimInWatchLater && '/list/watchlater',
    });
    doCollectionEdit(COLLECTIONS_CONSTS.WATCH_LATER_ID, {
      uris: [uri],
      remove: hasClaimInWatchLater,
      type: 'playlist',
    });
  }

  // text that will show if you keep cursor over button
  const title = hasClaimInWatchLater ? __('Remove from Watch Later') : __('Add to Watch Later');

  // label that is shown after hover
  const label = !hasClaimInWatchLater ? __('Watch Later') : __('Remove');

  return (
    <Button
      ref={buttonRef}
      requiresAuth={IS_WEB}
      title={title}
      label={label}
      className="button--file-action"
      icon={
        (hasClaimInWatchLater && (isHovering ? ICONS.REMOVE : ICONS.COMPLETED)) ||
        (isHovering ? ICONS.COMPLETED : ICONS.TIME)
      }
      onClick={(e) => handleWatchLater(e)}
      tabIndex={focusable ? 0 : -1}
    />
  );
}

export default FileWatchLaterLink;
