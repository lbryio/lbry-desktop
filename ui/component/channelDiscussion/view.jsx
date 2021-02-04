// @flow
import React from 'react';
import CommentsList from 'component/commentsList';
import Empty from 'component/common/empty';

type Props = {
  uri: string,
  linkedComment: ?any,
  tags: Array<string>,
};

function ChannelDiscussion(props: Props) {
  const { uri, linkedComment, tags } = props;

  if (tags.includes('disable_comments')) {
    return <Empty text={__('Comments are disabled here.')} />;
  }
  return (
    <section className="section">
      <CommentsList uri={uri} linkedComment={linkedComment} />
    </section>
  );
}

export default ChannelDiscussion;
