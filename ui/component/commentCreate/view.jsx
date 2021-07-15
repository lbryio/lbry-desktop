// @flow
import type { ElementRef } from 'react';
import { SIMPLE_SITE } from 'config';
import * as PAGES from 'constants/pages';
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import SelectChannel from 'component/selectChannel';
import usePersistedState from 'effects/use-persisted-state';
import { FF_MAX_CHARS_IN_COMMENT, FF_MAX_CHARS_IN_LIVESTREAM_COMMENT } from 'constants/form-field';
import { useHistory } from 'react-router';
import WalletTipAmountSelector from 'component/walletTipAmountSelector';
import CreditAmount from 'component/common/credit-amount';
import ChannelThumbnail from 'component/channelThumbnail';
import UriIndicator from 'component/uriIndicator';
import Empty from 'component/common/empty';

const TAB_FIAT = 'TabFiat';
const TAB_LBC = 'TabLBC';

type Props = {
  uri: string,
  claim: StreamClaim,
  createComment: (string, string, string, ?string, ?string, ?string) => Promise<any>,
  commentsDisabledBySettings: boolean,
  channels: ?Array<ChannelClaim>,
  onDoneReplying?: () => void,
  onCancelReplying?: () => void,
  isNested: boolean,
  isFetchingChannels: boolean,
  parentId: string,
  isReply: boolean,
  activeChannel: string,
  activeChannelClaim: ?ChannelClaim,
  livestream?: boolean,
  toast: (string) => void,
  claimIsMine: boolean,
  sendTip: ({}, (any) => void, (any) => void) => void,
  justCommented: Array<string>,
};

export function CommentCreate(props: Props) {
  const {
    createComment,
    commentsDisabledBySettings,
    claim,
    channels,
    onDoneReplying,
    onCancelReplying,
    isNested,
    isFetchingChannels,
    isReply,
    parentId,
    activeChannelClaim,
    livestream,
    claimIsMine,
    sendTip,
    justCommented,
  } = props;
  const buttonref: ElementRef<any> = React.useRef();
  const {
    push,
    location: { pathname },
  } = useHistory();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [commentFailure, setCommentFailure] = React.useState(false);
  const [successTip, setSuccessTip] = React.useState({ txid: undefined, tipAmount: undefined });
  const { claim_id: claimId } = claim;
  const [isSupportComment, setIsSupportComment] = React.useState();
  const [isReviewingSupportComment, setIsReviewingSupportComment] = React.useState();
  const [tipAmount, setTipAmount] = React.useState(1);
  const [commentValue, setCommentValue] = React.useState('');
  const [advancedEditor, setAdvancedEditor] = usePersistedState('comment-editor-mode', false);
  const hasChannels = channels && channels.length;
  const disabled = isSubmitting || !activeChannelClaim || !commentValue.length;
  const charCount = commentValue.length;

  const [activeTab, setActiveTab] = React.useState('');

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
    if ((e.ctrlKey || e.metaKey) && e.keyCode === KEYCODE_ENTER) {
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
      handleCreateComment();
    }
  }

  function handleSupportComment() {
    if (!activeChannelClaim) {
      return;
    }

    // todo: what is happening with this line?
    if (commentFailure && tipAmount === successTip.tipAmount) {
      handleCreateComment(successTip.txid);
      return;
    } else {
      setSuccessTip({ txid: undefined, tipAmount: undefined });
    }

    const params = {
      amount: tipAmount,
      claim_id: claimId,
      channel_id: activeChannelClaim.claim_id,
    };

    setIsSubmitting(true);

    if (activeTab === TAB_LBC) {
      // call sendTip and then run the callback from the response
      // second parameter is callback
      sendTip(
        params,
        (response) => {
          const { txid } = response;
          // todo: why the setTimeout?
          setTimeout(() => {
            handleCreateComment(txid);
          }, 1500);
          setSuccessTip({ txid, tipAmount });
        },
        () => {
          // reset the frontend so people can send a new comment
          setIsSubmitting(false);
        }
      );
    } else {

      const stripeEnvironment = 'test';
      const paymentIntentId = 'pi_1JDDZUIrsVv9ySuhbVmQvXs2';

      handleCreateComment(null, paymentIntentId, stripeEnvironment);

      // TODO: get transaction id, blah blah
      // hit create comment with fiat amount etc

      setCommentValue('');
      setIsReviewingSupportComment(false);
      setIsSupportComment(false);
      setCommentFailure(false);
      setIsSubmitting(false);

      // alert('Sorry fiat tip is not implemented yet!');
    }
  }

  /**
   *
   * @param {string} [txid] Optional transaction id generated by
   * @param {string} [payment_intent_id] Optional payment_intent_id from Stripe payment
   * @param {string} [environment] Optional environment for Stripe (test|live)
   */
  function handleCreateComment(txid, payment_intent_id, environment) {
    setIsSubmitting(true);

    console.log('txid pii env')
    console.log(txid, payment_intent_id, environment)

    createComment(commentValue, claimId, parentId, txid, payment_intent_id, environment)
      .then((res) => {
        // allow a new comment to be sent on frontend
        setIsSubmitting(false);

        console.log(res);


        if (res && res.signature) {
          setCommentValue('');
          setIsReviewingSupportComment(false);
          setIsSupportComment(false);
          setCommentFailure(false);
          justCommented.push(res.comment_id);

          if (onDoneReplying) {
            onDoneReplying();
          }
        }
      })
      .catch((e) => {
        console.log(e);
        setIsSubmitting(false);
        setCommentFailure(true);
      });
  }

  function toggleEditorMode() {
    setAdvancedEditor(!advancedEditor);
  }

  if (commentsDisabledBySettings) {
    return <Empty padded text={__('This channel has disabled comments on their page.')} />;
  }

  if (!hasChannels) {
    return (
      <div
        role="button"
        onClick={() => {
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
        <div className="section__actions--no-margin">
          <Button disabled button="primary" label={__('Post --[button to submit something]--')} requiresAuth={IS_WEB} />
        </div>
      </div>
    );
  }

  if (isReviewingSupportComment && activeChannelClaim) {
    return (
      <div className="comment__create">
        <div className="comment__sc-preview">
          <CreditAmount className="comment__scpreview-amount" isFiat={activeTab === TAB_FIAT} amount={tipAmount} size={18} />

          <ChannelThumbnail xsmall uri={activeChannelClaim.canonical_url} />
          <div>
            <UriIndicator uri={activeChannelClaim.name} link />
            <div>{commentValue}</div>
          </div>
        </div>
        <div className="section__actions--no-margin">
          <Button
            autoFocus
            button="primary"
            disabled={disabled}
            // whether to show sending, send, or resubmit
            label={isSubmitting ? __('Sending...') : (commentFailure && tipAmount === successTip.tipAmount) ? __('Re-submit') : __('Send')}
            onClick={handleSupportComment}
          />
          <Button button="link" label={__('Cancel')} onClick={() => setIsReviewingSupportComment(false)} />
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
      })}
    >
      <FormField
        disabled={!activeChannelClaim}
        type={SIMPLE_SITE ? 'textarea' : advancedEditor && !isReply ? 'markdown' : 'textarea'}
        name={isReply ? 'content_reply' : 'content_description'}
        label={
          <span className="comment-new__label-wrapper">
            {!livestream && (
              <div className="comment-new__label">{isReply ? __('Replying as') + ' ' : __('Comment as') + ' '}</div>
            )}
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
      {isSupportComment && <WalletTipAmountSelector activeTab={activeTab} amount={tipAmount} onChange={(amount) => setTipAmount(amount)} />}
      <div className="section__actions section__actions--no-margin">
        {isSupportComment ? (
          <>
            <Button
              disabled={disabled}
              type="button"
              button="primary"
              icon={activeTab === TAB_LBC ? ICONS.LBC : ICONS.FINANCE}
              label={__('Review')}
              onClick={() => setIsReviewingSupportComment(true)}
            />

            <Button disabled={disabled} button="link" label={__('Cancel')} onClick={() => setIsSupportComment(false)} />
          </>
        ) : (
          <>
            <Button
              ref={buttonref}
              button="primary"
              disabled={disabled}
              type="submit"
              label={
                isReply
                  ? isSubmitting
                    ? __('Replying...')
                    : __('Reply')
                  : isSubmitting
                  ? __('Commenting...')
                  : __('Comment --[button to submit something]--')
              }
              requiresAuth={IS_WEB}
            />
            {/* TODO: add here */}
            {!claimIsMine && (
              <Button disabled={disabled} button="alt" className="thatButton" icon={ICONS.LBC} onClick={() => {
                setIsSupportComment(true);
                setActiveTab(TAB_LBC);
                // alert('hitting!');
              }} />
            )}
            {!claimIsMine && (
              <Button disabled={disabled} button="alt" className="thisButton" icon={ICONS.FINANCE} onClick={() => {
                setIsSupportComment(true);
                setActiveTab(TAB_FIAT);
                // alert('hitting!');
              }} />
            )}
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
          </>
        )}
      </div>
    </Form>
  );
}
