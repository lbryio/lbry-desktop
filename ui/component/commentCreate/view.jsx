// @flow
import { CHANNEL_NEW } from 'constants/claim';
import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import ChannelSelection from 'component/selectChannel';
import usePersistedState from 'effects/use-persisted-state';
import * as MODALS from 'constants/modal_types';
import I18nMessage from 'component/i18nMessage';

type Props = {
  commentingEnabled: boolean,
  uri: string,
  claim: StreamClaim,
  openModal: (id: string, { onCommentAcknowledge: () => void }) => void,
  createComment: (string, string, string, ?string) => void,
  channels: ?Array<ChannelClaim>,
  parentId?: string,
  onDoneReplying?: () => void,
  onCancelReplying?: () => void,
};

export function CommentCreate(props: Props) {
  const {
    commentingEnabled,
    createComment,
    claim,
    openModal,
    channels,
    parentId,
    onDoneReplying,
    onCancelReplying,
  } = props;
  const { claim_id: claimId } = claim;
  const isReply = !!parentId;
  const [commentValue, setCommentValue] = React.useState('');
  const [commentAck, setCommentAck] = usePersistedState('comment-acknowledge', false);
  const [channel, setChannel] = usePersistedState('comment-channel', '');
  const [charCount, setCharCount] = useState(commentValue.length);
  const [advancedEditor, setAdvancedEditor] = usePersistedState('comment-editor-mode', false);

  const topChannel =
    channels &&
    channels.reduce((top, channel) => {
      const topClaimCount = (top && top.meta && top.meta.claims_in_channel) || 0;
      const currentClaimCount = (channel && channel.meta && channel.meta.claims_in_channel) || 0;
      return topClaimCount >= currentClaimCount ? top : channel;
    });

  useEffect(() => {
    // set default channel
    if ((channel === '' || channel === 'anonymous') && topChannel) {
      handleChannelChange(topChannel.name);
    }
  }, [channel, topChannel]);

  function handleCommentChange(event) {
    let commentValue;
    if (isReply) {
      commentValue = event.target.value;
    } else {
      commentValue = advancedEditor ? event : event.target.value;
    }

    setCommentValue(commentValue);
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
    if (channel !== CHANNEL_NEW && commentValue.length) {
      createComment(commentValue, claimId, channel, parentId);
    }
    setCommentValue('');
    if (onDoneReplying) {
      onDoneReplying();
    }
  }

  function toggleEditorMode() {
    setAdvancedEditor(!advancedEditor);
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
    <Form onSubmit={handleSubmit} className={classnames('comment__create', { 'comment__create--reply': isReply })}>
      {!isReply && <ChannelSelection channel={channel} hideAnon onChannelChange={handleChannelChange} />}
      <FormField
        disabled={channel === CHANNEL_NEW}
        type={advancedEditor && !isReply ? 'markdown' : 'textarea'}
        name={isReply ? 'content_reply' : 'content_description'}
        label={isReply ? __('Replying as %reply_channel%', { reply_channel: channel }) : __('Comment')}
        quickActionLabel={isReply ? undefined : advancedEditor ? __('Simple Editor') : __('Advanced Editor')}
        quickActionHandler={isReply ? undefined : toggleEditorMode}
        onFocus={onTextareaFocus}
        placeholder={__('Say something about this...')}
        value={commentValue}
        charCount={charCount}
        onChange={handleCommentChange}
        autoFocus={isReply}
      />
      <div className="section__actions">
        <Button
          button="primary"
          disabled={channel === CHANNEL_NEW || !commentValue.length}
          type="submit"
          label={isReply ? __('Reply') : __('Post')}
          requiresAuth={IS_WEB}
        />
        {isReply && (
          <Button
            button="link"
            label={__('Cancel')}
            onClick={() => {
              if (onCancelReplying) {
                onCancelReplying();
              }
            }}
          />
        )}
      </div>
    </Form>
  );
}
