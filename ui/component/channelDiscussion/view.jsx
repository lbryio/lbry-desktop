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
    <div>
      <section className="section">
        <CommentCreate uri={uri} />
      </section>
      <section className="section">
        <CommentsList uri={uri} />
      </section>
    </div>
  );
}

export default ChannelDiscussion;
