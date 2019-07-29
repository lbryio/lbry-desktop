// @flow
import { CHANNEL_NEW } from 'constants/claim';
import React from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import ChannelSection from 'component/selectChannel';
import UnsupportedOnWeb from 'component/common/unsupported-on-web';
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
    <section>
      <UnsupportedOnWeb type="feature" />
      {/* @if TARGET='app' */}
      {commentAck !== true && (
        <div>
          <p>{__('A few things to know before participating in the comment alpha:')}</p>
          <ul>
            <li>
              {__('During the alpha, all comments are sent to a LBRY, Inc. server, not the LBRY network itself.')}
            </li>
            <li>
              {__(
                'During the alpha, comments are not decentralized or censorship resistant (but we repeat ourselves).'
              )}
            </li>
            <li>
              {__(
                'For the initial release, deleting or editing comments is not possible. Please be mindful of this when posting.'
              )}
            </li>
            <li>
              {__(
                'When the alpha ends, we will attempt to transition comments, but do not promise to do so. Any transition will likely involve publishing previous comments under a single archive handle.'
              )}
            </li>
          </ul>
          <Button button="primary" onClick={handleCommentAck} label={__('Got it!')} />
        </div>
      )}
      {commentAck === true && (
        <Form onSubmit={handleSubmit}>
          <ChannelSection channel={channel} onChannelChange={handleChannelChange} />
          <FormField
            disabled={channel === CHANNEL_NEW}
            type="textarea"
            name="content_description"
            label={__('Comment')}
            placeholder={__('Your comment')}
            value={commentValue}
            onChange={handleCommentChange}
          />
          <div className="card__actions">
            <Button
              button="primary"
              disabled={channel === CHANNEL_NEW || !commentValue.length}
              type="submit"
              label={__('Post')}
            />
          </div>
        </Form>
      )}
      {/* @endif */}
    </section>
  );
}
