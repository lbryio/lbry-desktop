// @flow
import 'scss/component/_livestream-chat.scss';

import React from 'react';
import LivestreamComment from 'component/livestreamComment';
import Spinner from 'component/spinner';

// 30 sec timestamp refresh timer
const UPDATE_TIMESTAMP_MS = 30 * 1000;

type Props = {
  comments: Array<Comment>,
  uri: string,
  isMobile?: boolean,
  viewMode: string,
  restoreScrollPos?: () => void,
  setResolvingSuperChats?: (boolean) => void,
  // redux
  fetchingComments: boolean,
  resolvingSuperchats: boolean,
};

export default function LivestreamComments(props: Props) {
  const {
    comments,
    uri,
    isMobile,
    restoreScrollPos,
    setResolvingSuperChats,
    fetchingComments,
    resolvingSuperchats,
  } = props;

  const [forceUpdate, setForceUpdate] = React.useState(0);

  React.useEffect(() => {
    if (setResolvingSuperChats) setResolvingSuperChats(resolvingSuperchats);
  }, [resolvingSuperchats, setResolvingSuperChats]);

  const now = new Date();
  const shouldRefreshTimestamp =
    comments &&
    comments.some((comment) => {
      const { timestamp } = comment;
      const timePosted = timestamp * 1000;

      // 1000 * 60 seconds * 60 minutes === less than an hour old
      return now - timePosted < 1000 * 60 * 60;
    });

  // Refresh timestamp on timer
  React.useEffect(() => {
    if (shouldRefreshTimestamp) {
      const timer = setTimeout(() => {
        setForceUpdate(Date.now());
      }, UPDATE_TIMESTAMP_MS);

      return () => clearTimeout(timer);
    }
    // forceUpdate will re-activate the timer or else it will only refresh once
  }, [shouldRefreshTimestamp, forceUpdate]);

  if (resolvingSuperchats) {
    return (
      <div className="main--empty">
        <Spinner />
      </div>
    );
  }

  /* top to bottom comment display */
  if (!fetchingComments && comments && comments.length > 0) {
    const commentProps = { uri, forceUpdate };

    return isMobile ? (
      <div className="livestream__comments--mobile">
        {comments
          .slice(0)
          .reverse()
          .map((comment) => (
            <LivestreamComment
              {...commentProps}
              comment={comment}
              key={comment.comment_id}
              isMobile
              restoreScrollPos={restoreScrollPos}
            />
          ))}
      </div>
    ) : (
      <div className="livestream__comments">
        {comments.map((comment) => (
          <LivestreamComment {...commentProps} comment={comment} key={comment.comment_id} />
        ))}
      </div>
    );
  }

  return <div className="main--empty" style={{ flex: 1 }} />;
}
