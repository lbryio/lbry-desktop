import React from "react";
import CommentsList from "component/commentsList";
import Empty from "component/common/empty";

type Props = {
  uri: string;
  linkedCommentId?: string;
  commentsDisabled: boolean;
};

function ChannelDiscussion(props: Props) {
  const { uri, linkedCommentId, commentsDisabled } = props;

  if (commentsDisabled) {
    return <Empty text={__("This channel has disabled comments on their page.")} />;
  }
  return (
    <section className="section">
      {/* @ts-expect-error - TS2740 (ts-migration) */}
      <CommentsList uri={uri} linkedCommentId={linkedCommentId} commentsAreExpanded />
    </section>
  );
}

export default ChannelDiscussion;
