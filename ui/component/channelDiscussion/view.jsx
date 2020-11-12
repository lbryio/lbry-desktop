// @flow
import React from 'react';
import CommentsList from 'component/commentsList';

type Props = {
  uri: string,
  linkedComment: ?any,
};

function ChannelDiscussion(props: Props) {
  const { uri, linkedComment } = props;

  return (
    <section className="section">
      <CommentsList uri={uri} linkedComment={linkedComment} />
    </section>
  );
}

export default ChannelDiscussion;
