// @flow
import { CHANNEL_NEW } from 'constants/claim';
import React from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import ChannelSection from 'component/selectChannel';
import usePersistedState from 'util/use-persisted-state';

type Props = {
  uri: string,
  claim: StreamClaim,
  createComment: (string, string, string) => void,
};

export function CommentCreate(props: Props) {
  const { createComment, claim } = props;
  const { claim_id: claimId } = claim;
  const [commentValue, setCommentValue] = usePersistedState(`comment-${claimId}`, '');
  const [commentAck, setCommentAck] = usePersistedState('comment-acknowledge', false);
  const [channel, setChannel] = usePersistedState('comment-channel', 'anonymous');

  function handleCommentChange(event) {
    setCommentValue(event.target.value);
  }

  function handleChannelChange(channel) {
    setChannel(channel);
  }

  function handleCommentAck(event) {
    setCommentAck(true);
  }
  function handleSubmit() {
    if (channel !== CHANNEL_NEW && commentValue.length) createComment(commentValue, claimId, channel);
    setCommentValue('');
  }

  return (
    <React.Fragment>
      {commentAck !== true && (
        <section>
          <div className="card__content">
            <div className="media__title">About comments..</div>
          </div>
          <div className="card__content">
            <div className="media__subtitle">I acknowledge something.</div>
          </div>
          <div className="card__content">
            <Button button="primary" onClick={handleCommentAck} label={__('Got it!')} />
          </div>
        </section>
      )}
      {commentAck === true && (
        <section>
          <Form onSubmit={handleSubmit}>
            <div className="card__content">
              <ChannelSection channel={channel} onChannelChange={handleChannelChange} />
            </div>
            <div className="card__content">
              <FormField
                disabled={channel === CHANNEL_NEW}
                type="textarea"
                name="content_description"
                label={__('Comment')}
                placeholder={__('Your comment')}
                value={commentValue}
                onChange={handleCommentChange}
              />
            </div>
            <div className="card__actions">
              <Button
                button="primary"
                disabled={channel === CHANNEL_NEW || !commentValue.length}
                type="submit"
                label={__('Post')}
              />
            </div>
          </Form>
        </section>
      )}
    </React.Fragment>
  );
}
