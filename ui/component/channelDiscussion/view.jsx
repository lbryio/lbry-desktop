// @flow
import React from 'react';
import CommentsList from 'component/commentsList';
import CommentCreate from 'component/commentCreate';

type Props = {
  uri: string,
};

function ChannelDiscussion(props: Props) {
  const uri = props.uri;
  return (
    <section className="card--section">
      <CommentCreate uri={uri} />
      <CommentsList uri={uri} />
    </section>
  );
}

export default ChannelDiscussion;
