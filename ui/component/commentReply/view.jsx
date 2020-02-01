// @flow
import { CHANNEL_NEW } from 'constants/claim';
import React, { useEffect, useState } from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import ChannelSection from 'component/selectChannel';
import usePersistedState from 'effects/use-persisted-state';
import * as MODALS from 'constants/modal_types';
import I18nMessage from '../i18nMessage/view';

type Props = {
  commentingEnabled: boolean,
  uri: string,
  claim: StreamClaim,
  parentId: string,
  openModal: (id: string, { onCommentAcknowledge: () => void }) => void,
  replyComment: (string, string, string, string) => void,
  setReplying: (boolean) => void
};

export function CommentReply(props: Props) {
  const { commentingEnabled, replyComment, setReplying, claim, openModal, parentId, uri} = props;
  const { claim_id: claimId } = claim;
  const [commentValue, setCommentValue] = usePersistedState(`comment-${claimId}`, '');
  const [commentAck, setCommentAck] = usePersistedState('comment-acknowledge', false);
  const [channel, setChannel] = usePersistedState('comment-channel', 'anonymous');
  const [charCount, setCharCount] = useState(commentValue.length);

  function handleCommentChange(event) {
    setCommentValue(event.target.value);
  }

  function handleChannelChange(channel) {
    setChannel(channel);
  }

  function handleCommentAck() {
    setCommentAck(true);
  }

  function onTextareaFocus() {
    if (!commentAck) {
      openModal(MODALS.COMMENT_ACKNOWEDGEMENT, { onCommentAcknowledge: handleCommentAck });
    }
  }

  function handleSubmit() {
    if (channel !== CHANNEL_NEW && commentValue.length); replyComment(commentValue, claimId, channel, parentId);
    setCommentValue('');
  }

  useEffect(() => setCharCount(commentValue.length), [commentValue]);

  if (!commentingEnabled) {
    return (
      <I18nMessage tokens={{ sign_in_link: <Button button="link" requiresAuth label={__('sign in')} /> }}>
        Please %sign_in_link% to comment.
      </I18nMessage>
    );
  }

  return (
    <Form className="comment__reply-form" onSubmit={handleSubmit}>
      <ChannelSection channel={channel} onChannelChange={handleChannelChange} />
      <FormField
        disabled={channel === CHANNEL_NEW}
        type="textarea"
        name="content_description"
        label={__('Comment')}
        onFocus={onTextareaFocus}
        placeholder={__('Say something about this...')}
        value={commentValue}
        charCount={charCount}
        onChange={handleCommentChange}
      />
      <div className="section__actions">
        <Button
          button="primary"
          disabled={channel === CHANNEL_NEW || !commentValue.length}
          type="submit"
          label={__('Post')}
          requiresAuth={IS_WEB}
        />
        <Button
          button="link"
          label={__('Cancel')}
          onClick={() => setReplying(false)}
        />
      </div>
    </Form>
  );
}
