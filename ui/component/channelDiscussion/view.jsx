// @flow
import React from 'react';
import Empty from 'component/common/empty';
import { lazyImport } from 'util/lazyImport';

const CommentsList = lazyImport(() => import('component/commentsList' /* webpackChunkName: "comments" */));

type Props = {
  uri: string,
  linkedCommentId?: string,
  commentsDisabled: boolean,
  commentSettingDisabled?: boolean,
};

function ChannelDiscussion(props: Props) {
  const { uri, linkedCommentId, commentsDisabled, commentSettingDisabled } = props;

  if (commentsDisabled) {
    return <Empty text={__('The creator of this content has disabled comments.')} />;
  }

  if (commentSettingDisabled) {
    return <Empty text={__('This channel has disabled comments on their page.')} />;
  }

  return (
    <section className="section">
      <React.Suspense fallback={null}>
        <CommentsList uri={uri} linkedCommentId={linkedCommentId} commentsAreExpanded />
      </React.Suspense>
    </section>
  );
}

export default ChannelDiscussion;
