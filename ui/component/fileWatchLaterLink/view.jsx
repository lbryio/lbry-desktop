// @flow
import * as ICONS from 'constants/icons';
import React, { useRef } from 'react';
import Button from 'component/button';
import useHover from 'effects/use-hover';
import { COLLECTIONS_CONSTS } from 'lbry-redux';

type Props = {
  uri: string,
  claim: StreamClaim,
  hasClaimInWatchLater: boolean,
  doToast: ({ message: string }) => void,
  doCollectionEdit: (string, any) => void,
};

function FileWatchLaterLink(props: Props) {
  const {
    claim,
    hasClaimInWatchLater,
    doToast,
    doCollectionEdit,
  } = props;
  const buttonRef = useRef();
  let isHovering = useHover(buttonRef);

  if (!claim) {
    return null;
  }

  function handleWatchLater(e) {
    e.preventDefault();
    doToast({
      message: __('Item %action% Watch Later', {
        action: hasClaimInWatchLater ? __('removed from') : __('added to'),
      }),
      linkText: !hasClaimInWatchLater && __('See All'),
      linkTarget: !hasClaimInWatchLater && '/list/watchlater',
    });
    doCollectionEdit(COLLECTIONS_CONSTS.WATCH_LATER_ID, {
      claims: [claim],
      remove: hasClaimInWatchLater,
      type: 'playlist',
    });
  }

  const title = hasClaimInWatchLater ? __('Remove from Watch Later') : __('Add to Watch Later');
  const label = !hasClaimInWatchLater ? __('Add') : __('Added');

  return (
    <Button
      ref={buttonRef}
      requiresAuth={IS_WEB}
      title={title}
      label={label}
      className="button--file-action"
      icon={(hasClaimInWatchLater && (isHovering ? ICONS.REMOVE : ICONS.COMPLETED)) || (isHovering ? ICONS.COMPLETED : ICONS.TIME)}
      onClick={(e) => handleWatchLater(e)}
    />
  );
}

export default FileWatchLaterLink;
