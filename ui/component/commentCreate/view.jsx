// @flow
import { SIMPLE_SITE } from 'config';
import * as PAGES from 'constants/pages';
import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import SelectChannel from 'component/selectChannel';
import usePersistedState from 'effects/use-persisted-state';
import { FF_MAX_CHARS_IN_COMMENT, FF_MAX_CHARS_IN_LIVESTREAM_COMMENT } from 'constants/form-field';
import { useHistory } from 'react-router';
import type { ElementRef } from 'react';
import emoji from 'emoji-dictionary';

const COMMENT_SLOW_MODE_SECONDS = 5;
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
  activeChannelClaim: ?ChannelClaim,
  bottom: boolean,
  onSubmit: (string, string) => void,
  livestream: boolean,
  embed?: boolean,
  toast: (string) => void,
  claimIsMine: boolean,
  commentingEnabled: boolean,
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
    activeChannelClaim,
    onSubmit,
    bottom,
    livestream,
    embed,
    toast,
    claimIsMine,
    commentingEnabled,
  } = props;
  const buttonref: ElementRef<any> = React.useRef();
  const {
    push,
    location: { pathname },
  } = useHistory();
  const { claim_id: claimId } = claim;
  const [commentValue, setCommentValue] = React.useState('');
  const [lastCommentTime, setLastCommentTime] = React.useState();
  const [charCount, setCharCount] = useState(commentValue.length);
  const [advancedEditor, setAdvancedEditor] = usePersistedState('comment-editor-mode', false);
  const hasChannels = channels && channels.length;
  const disabled = isPostingComment || !activeChannelClaim || !commentValue.length;

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
    if (activeChannelClaim && commentValue.length) {
      const timeUntilCanComment = !lastCommentTime
        ? 0
        : (lastCommentTime - Date.now()) / 1000 + COMMENT_SLOW_MODE_SECONDS;

      if (livestream && !claimIsMine && timeUntilCanComment > 0) {
        toast(__('Slowmode is on. You can comment again in %time% seconds.', { time: Math.ceil(timeUntilCanComment) }));
        return;
      }

      createComment(commentValue, claimId, parentId).then((res) => {
        if (res && res.signature) {
          setCommentValue('');
          setLastCommentTime(Date.now());

          if (onSubmit) {
            onSubmit(commentValue, activeChannelClaim.name);
          }

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

  if (!commentingEnabled || !hasChannels) {
    return (
      <div
        role="button"
        onClick={() => {
          if (embed) {
            window.open(`https://odysee.com/$/${PAGES.AUTH}?redirect=/$/${PAGES.LIVESTREAM}`);
            return;
          }

          const pathPlusRedirect = `/$/${PAGES.CHANNEL_NEW}?redirect=${pathname}`;
          if (livestream) {
            window.open(pathPlusRedirect);
          } else {
            push(pathPlusRedirect);
          }
        }}
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
        disabled={!activeChannelClaim}
        type={SIMPLE_SITE ? 'textarea' : advancedEditor && !isReply ? 'markdown' : 'textarea'}
        name={isReply ? 'content_reply' : 'content_description'}
        label={
          <span className="comment-new__label-wrapper">
            <div className="comment-new__label">{isReply ? __('Replying as') + ' ' : __('Comment as') + ' '}</div>
            <SelectChannel tiny />
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
          {LIVESTREAM_EMOJIS.map((emoji) => (
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
