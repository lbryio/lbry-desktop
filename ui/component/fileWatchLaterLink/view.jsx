// @flow
import * as ICONS from 'constants/icons';
import React, { useRef } from 'react';
import Button from 'component/button';
import useHover from 'effects/use-hover';
import { COLLECTIONS_CONSTS } from 'lbry-redux';

type Props = {
  uri: string,
  claim: StreamClaim,
  focusable: boolean,
  hasClaimInWatchLater: boolean,
  doToast: ({ message: string }) => void,
  doCollectionEdit: (string, any) => void,
};

function FileWatchLaterLink(props: Props) {
  const { claim, hasClaimInWatchLater, doToast, doCollectionEdit, focusable = true } = props;
  const buttonRef = useRef();
  console.log('ref');
  console.log(buttonRef);
  let isHovering = useHover(buttonRef);
  console.log(isHovering);

  if (!claim) {
    return null;
  }

  function handleWatchLater(e) {
    e.preventDefault();
    doToast({
      message: hasClaimInWatchLater ? __('Item removed from Watch Later') : __('Item added to Watch Later'),
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
