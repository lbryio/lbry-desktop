// @flow
import 'scss/component/_livestream-chat.scss';

import LivestreamComment from 'component/livestreamComment';
import React from 'react';

// 30 sec timestamp refresh timer
const UPDATE_TIMESTAMP_MS = 30 * 1000;

type Props = {
  commentsToDisplay: Array<Comment>,
  fetchingComments: boolean,
  uri: string,
  isMobile?: boolean,
};

export default function LivestreamComments(props: Props) {
  const { commentsToDisplay, fetchingComments, uri, isMobile } = props;

  const [forceUpdate, setForceUpdate] = React.useState(0);

  const now = new Date();
  const shouldRefreshTimestamp =
    commentsToDisplay &&
    commentsToDisplay.some((comment) => {
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

  /* top to bottom comment display */
  if (!fetchingComments && commentsToDisplay && commentsToDisplay.length > 0) {
    return (
      <div className="livestream__comments">
        {commentsToDisplay
          .slice(0)
          .reverse()
          .map((comment) => (
            <LivestreamComment
              comment={comment}
              key={comment.comment_id}
              uri={uri}
              forceUpdate={forceUpdate}
              isMobile={isMobile}
            />
          ))}
      </div>
    );
  }

  return <div className="main--empty" style={{ flex: 1 }} />;
}
