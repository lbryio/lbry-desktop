// @flow
import React from 'react';
import CommentsList from 'component/commentsList';

type Props = {
  uri: string,
};

function ChannelDiscussion(props: Props) {
  const uri = props.uri;
  return (
    <section className="section">
      <CommentsList uri={uri} />
    </section>
  );
}

export default ChannelDiscussion;
