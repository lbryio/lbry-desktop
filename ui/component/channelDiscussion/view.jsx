// @flow
import React from 'react';
import CommentsList from 'component/commentsList';
import Empty from 'component/common/empty';

type Props = {
  uri: string,
  linkedComment: ?any,
  commentsDisabled: boolean,
};

function ChannelDiscussion(props: Props) {
  const { uri, linkedComment, commentsDisabled } = props;

  if (commentsDisabled) {
    return <Empty text={__('This channel has disabled comments on their page.')} />;
  }
  return (
    <section className="section">
      <CommentsList uri={uri} linkedComment={linkedComment} />
    </section>
  );
}

export default ChannelDiscussion;
