// @flow
import { SIMPLE_SITE } from 'config';
import * as PAGES from 'constants/pages';
import { CHANNEL_NEW } from 'constants/claim';
import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import ChannelSelection from 'component/selectChannel';
import usePersistedState from 'effects/use-persisted-state';
import { FF_MAX_CHARS_IN_COMMENT, FF_MAX_CHARS_IN_LIVESTREAM_COMMENT } from 'constants/form-field';
import { useHistory } from 'react-router';
import type { ElementRef } from 'react';
import emoji from 'emoji-dictionary';

const LIVESTREAM_EMOJIS = [
  emoji.getUnicode('rocket'),
  emoji.getUnicode('jeans'),
  emoji.getUnicode('fire'),
  emoji.getUnicode('heart'),
  emoji.getUnicode('open_mouth'),
];

type Props = {
  uri: string,
  claim: StreamClaim,
  createComment: (string, string, string, ?string) => Promise<any>,
  channels: ?Array<ChannelClaim>,
  onDoneReplying?: () => void,
  onCancelReplying?: () => void,
  isNested: boolean,
  isFetchingChannels: boolean,
  parentId: string,
  isReply: boolean,
  isPostingComment: boolean,
  activeChannel: string,
  setCommentChannel: string => void,
  bottom: boolean,
  onSubmit: (string, string) => void,
  livestream: boolean,
  authenticated: boolean,
};

export function CommentCreate(props: Props) {
  const {
    createComment,
    claim,
    channels,
    onDoneReplying,
    onCancelReplying,
    isNested,
    isFetchingChannels,
    isReply,
    parentId,
    isPostingComment,
    activeChannel,
    setCommentChannel,
    onSubmit,
    bottom,
    livestream,
    authenticated,
  } = props;
  const buttonref: ElementRef<any> = React.useRef();
  const {
    push,
    location: { pathname },
  } = useHistory();
  const { claim_id: claimId } = claim;
  const [commentValue, setCommentValue] = React.useState('');
  const [charCount, setCharCount] = useState(commentValue.length);
  const [advancedEditor, setAdvancedEditor] = usePersistedState('comment-editor-mode', false);
  const hasChannels = channels && channels.length;
  const disabled = isPostingComment || activeChannel === CHANNEL_NEW || !commentValue.length;
  const topChannel =
    channels &&
    channels.reduce((top, channel) => {
      const topClaimCount = (top && top.meta && top.meta.claims_in_channel) || 0;
      const currentClaimCount = (activeChannel && channel.meta && channel.meta.claims_in_channel) || 0;
      return topClaimCount >= currentClaimCount ? top : channel;
    });

  useEffect(() => {
    // set default channel
    if ((activeChannel === '' || activeChannel === 'anonymous') && topChannel) {
      setCommentChannel(topChannel.name);
    }
  }, [activeChannel, topChannel, setCommentChannel]);

  function handleCommentChange(event) {
    let commentValue;
    if (isReply) {
      commentValue = event.target.value;
    } else {
      commentValue = !SIMPLE_SITE && advancedEditor ? event : event.target.value;
    }

    setCommentValue(commentValue);
  }

  function altEnterListener(e: SyntheticKeyboardEvent<*>) {
    const KEYCODE_ENTER = 13;
    if ((livestream || e.ctrlKey || e.metaKey) && e.keyCode === KEYCODE_ENTER) {
      e.preventDefault();
      buttonref.current.click();
    }
  }

  function onTextareaFocus() {
    window.addEventListener('keydown', altEnterListener);
  }

  function onTextareaBlur() {
    window.removeEventListener('keydown', altEnterListener);
  }

  function handleSubmit() {
    if (activeChannel !== CHANNEL_NEW && commentValue.length) {
      createComment(commentValue, claimId, activeChannel, parentId).then(res => {
        if (onSubmit) {
          onSubmit(commentValue, activeChannel);
        }

        if (res && res.signature) {
          setCommentValue('');

          if (onDoneReplying) {
            onDoneReplying();
          }
        }
      });
    }
  }

  function toggleEditorMode() {
    setAdvancedEditor(!advancedEditor);
  }

  useEffect(() => setCharCount(commentValue.length), [commentValue]);

  if (!authenticated || !hasChannels) {
    return (
      <div
        role="button"
        onClick={() =>
          authenticated
            ? push(`/$/${PAGES.CHANNEL_NEW}?redirect=${pathname}`)
            : push(`/$/${PAGES.AUTH}?redirect=${pathname}`)
        }
      >
        <FormField
          type="textarea"
          name={'comment_signup_prompt'}
          placeholder={__('Say something about this...')}
          label={isFetchingChannels ? __('Comment') : undefined}
        />
        <div className="section__actions">
          <Button disabled button="primary" label={__('Post --[button to submit something]--')} />
        </div>
      </div>
    );
  }

  return (
    <Form
      onSubmit={handleSubmit}
      className={classnames('comment__create', {
        'comment__create--reply': isReply,
        'comment__create--nested-reply': isNested,
        'comment__create--bottom': bottom,
      })}
    >
      <FormField
        disabled={activeChannel === CHANNEL_NEW}
        type={SIMPLE_SITE ? 'textarea' : advancedEditor && !isReply ? 'markdown' : 'textarea'}
        name={isReply ? 'content_reply' : 'content_description'}
        label={
          <span className="comment-new__label-wrapper">
            <div className="comment-new__label">{isReply ? __('Replying as') + ' ' : __('Comment as') + ' '}</div>
            <ChannelSelection channel={activeChannel} hideAnon tiny hideNew onChannelChange={setCommentChannel} />
          </span>
        }
        quickActionLabel={
          !SIMPLE_SITE && (isReply ? undefined : advancedEditor ? __('Simple Editor') : __('Advanced Editor'))
        }
        quickActionHandler={!SIMPLE_SITE && toggleEditorMode}
        onFocus={onTextareaFocus}
        onBlur={onTextareaBlur}
        placeholder={__('Say something about this...')}
        value={commentValue}
        charCount={charCount}
        onChange={handleCommentChange}
        autoFocus={isReply}
        textAreaMaxLength={livestream ? FF_MAX_CHARS_IN_LIVESTREAM_COMMENT : FF_MAX_CHARS_IN_COMMENT}
      />
      {livestream && hasChannels && (
        <div className="livestream__emoji-actions">
          {LIVESTREAM_EMOJIS.map(emoji => (
            <Button
              key={emoji}
              disabled={isPostingComment}
              type="button"
              button="alt"
              className="button--emoji"
              label={emoji}
              onClick={() => {
                setCommentValue(commentValue ? `${commentValue} ${emoji}` : emoji);
              }}
            />
          ))}
        </div>
      )}
      <div
        className={classnames('section__actions', {
          'section__actions--no-margin': !livestream,
        })}
      >
        <Button
          ref={buttonref}
          button="primary"
          disabled={disabled}
          type="submit"
          label={
            isReply
              ? isPostingComment
                ? __('Replying...')
                : __('Reply')
              : isPostingComment
              ? __('Posting...')
              : __('Post --[button to submit something]--')
          }
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
