// @flow
import React from 'react';
import Empty from 'component/common/empty';
import { lazyImport } from 'util/lazyImport';

const CommentsList = lazyImport(() => import('component/commentsList' /* webpackChunkName: "comments" */));

type Props = {
  uri: string,
  linkedCommentId?: string,
  threadCommentId?: string,
  commentSettingDisabled: ?boolean,
};

function ChannelDiscussion(props: Props) {
  const { uri, linkedCommentId, threadCommentId, commentSettingDisabled } = props;

  if (commentSettingDisabled) {
    return <Empty text={__('The creator of this content has disabled comments.')} />;
  }

  return (
    <section className="section">
      <React.Suspense fallback={null}>
        <CommentsList
          uri={uri}
          linkedCommentId={linkedCommentId}
          threadCommentId={threadCommentId}
          commentsAreExpanded
          notInDrawer
        />
      </React.Suspense>
    </section>
  );
}

export default ChannelDiscussion;
