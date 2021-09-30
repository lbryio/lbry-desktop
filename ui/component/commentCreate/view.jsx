// @flow
import { FF_MAX_CHARS_IN_COMMENT, FF_MAX_CHARS_IN_LIVESTREAM_COMMENT } from 'constants/form-field';
import { FormField, Form } from 'component/common/form';
import { getChannelIdFromClaim } from 'util/claim';
import { Lbryio } from 'lbryinc';
import { SIMPLE_SITE } from 'config';
import { useHistory } from 'react-router';
import * as ICONS from 'constants/icons';
import * as KEYCODES from 'constants/keycodes';
import * as PAGES from 'constants/pages';
import Button from 'component/button';
import ChannelMentionSuggestions from 'component/channelMentionSuggestions';
import ChannelThumbnail from 'component/channelThumbnail';
import classnames from 'classnames';
import CreditAmount from 'component/common/credit-amount';
import Empty from 'component/common/empty';
import I18nMessage from 'component/i18nMessage';
import Icon from 'component/common/icon';
import React from 'react';
import SelectChannel from 'component/selectChannel';
import type { ElementRef } from 'react';
import UriIndicator from 'component/uriIndicator';
import usePersistedState from 'effects/use-persisted-state';
import WalletTipAmountSelector from 'component/walletTipAmountSelector';

import { getStripeEnvironment } from 'util/stripe';
let stripeEnvironment = getStripeEnvironment();

const TAB_FIAT = 'TabFiat';
const TAB_LBC = 'TabLBC';

type Props = {
  uri: string,
  claim: StreamClaim,
  channels: ?Array<ChannelClaim>,
  isNested: boolean,
  isFetchingChannels: boolean,
  parentId: string,
  isReply: boolean,
  activeChannel: string,
  activeChannelClaim: ?ChannelClaim,
  bottom: boolean,
  livestream?: boolean,
  embed?: boolean,
  claimIsMine: boolean,
  supportDisabled: boolean,
  settingsByChannelId: { [channelId: string]: PerChannelSettings },
  shouldFetchComment: boolean,
  doToast: ({ message: string }) => void,
  createComment: (string, string, string, ?string, ?string, ?string) => Promise<any>,
  onDoneReplying?: () => void,
  onCancelReplying?: () => void,
  toast: (string) => void,
  sendTip: ({}, (any) => void, (any) => void) => void,
  doFetchCreatorSettings: (channelId: string) => Promise<any>,
  setQuickReply: (any) => void,
  fetchComment: (commentId: string) => Promise<any>,
};

export function CommentCreate(props: Props) {
  const {
    uri,
    claim,
    channels,
    isNested,
    isFetchingChannels,
    isReply,
    parentId,
    activeChannelClaim,
    bottom,
    livestream,
    embed,
    claimIsMine,
    settingsByChannelId,
    supportDisabled,
    shouldFetchComment,
    doToast,
    createComment,
    onDoneReplying,
    onCancelReplying,
    sendTip,
    doFetchCreatorSettings,
    setQuickReply,
    fetchComment,
  } = props;
  const formFieldRef: ElementRef<any> = React.useRef();
  const formFieldInputRef = formFieldRef && formFieldRef.current && formFieldRef.current.input;
  const selectionIndex = formFieldInputRef && formFieldInputRef.current.selectionStart;
  const buttonRef: ElementRef<any> = React.useRef();
  const {
    push,
    location: { pathname },
  } = useHistory();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [commentFailure, setCommentFailure] = React.useState(false);
  const [successTip, setSuccessTip] = React.useState({ txid: undefined, tipAmount: undefined });
  const [isSupportComment, setIsSupportComment] = React.useState();
  const [isReviewingSupportComment, setIsReviewingSupportComment] = React.useState();
  const [tipAmount, setTipAmount] = React.useState(1);
  const [commentValue, setCommentValue] = React.useState('');
  const [advancedEditor, setAdvancedEditor] = usePersistedState('comment-editor-mode', false);
  const [activeTab, setActiveTab] = React.useState('');
  const [tipError, setTipError] = React.useState();
  const [deletedComment, setDeletedComment] = React.useState(false);
  const [shouldDisableReviewButton, setShouldDisableReviewButton] = React.useState();

  const selectedMentionIndex =
    commentValue.indexOf('@', selectionIndex) === selectionIndex
      ? commentValue.indexOf('@', selectionIndex)
      : commentValue.lastIndexOf('@', selectionIndex);
  const mentionLengthIndex =
    commentValue.indexOf(' ', selectedMentionIndex) >= 0
      ? commentValue.indexOf(' ', selectedMentionIndex)
      : commentValue.length;
  const channelMention =
    selectedMentionIndex >= 0 && selectionIndex <= mentionLengthIndex
      ? commentValue.substring(selectedMentionIndex, mentionLengthIndex)
      : '';

  const claimId = claim && claim.claim_id;
  const signingChannel = (claim && claim.signing_channel) || claim;
  const channelUri = signingChannel && signingChannel.permanent_url;
  const hasChannels = channels && channels.length;
  const charCount = commentValue ? commentValue.length : 0;
  const disabled = deletedComment || isSubmitting || isFetchingChannels || !commentValue.length;
  const channelId = getChannelIdFromClaim(claim);
  const channelSettings = channelId ? settingsByChannelId[channelId] : undefined;
  const minSuper = (channelSettings && channelSettings.min_tip_amount_super_chat) || 0;
  const minTip = (channelSettings && channelSettings.min_tip_amount_comment) || 0;
  const minAmount = minTip || minSuper || 0;
  const minAmountMet = minAmount === 0 || tipAmount >= minAmount;

  const minAmountRef = React.useRef(minAmount);
  minAmountRef.current = minAmount;

  const MinAmountNotice = minAmount ? (
    <div className="help--notice comment--min-amount-notice">
      <I18nMessage tokens={{ lbc: <CreditAmount noFormat amount={minAmount} /> }}>
        {minTip ? 'Comment min: %lbc%' : minSuper ? 'HyperChat min: %lbc%' : ''}
      </I18nMessage>
      <Icon
        customTooltipText={
          minTip
            ? __('This channel requires a minimum tip for each comment.')
            : minSuper
            ? __('This channel requires a minimum amount for HyperChats to be visible.')
            : ''
        }
        className="icon--help"
        icon={ICONS.HELP}
        tooltip
        size={16}
      />
    </div>
  ) : null;

  // **************************************************************************
  // Functions
  // **************************************************************************

  function handleCommentChange(event) {
    let commentValue;
    if (isReply) {
      commentValue = event.target.value;
    } else {
      commentValue = !SIMPLE_SITE && advancedEditor ? event : event.target.value;
    }

    setCommentValue(commentValue);
  }

  function handleSelectMention(mentionValue) {
    let newMentionValue = mentionValue.replace('lbry://', '');
    if (newMentionValue.includes('#')) {
      const fullId = newMentionValue.substring(newMentionValue.indexOf('#') + 1, newMentionValue.length);
      newMentionValue = newMentionValue
        .substring(0, newMentionValue.indexOf('#') + (fullId.length > 2 ? 2 : newMentionValue.length))
        .replace('#', ':');
    }

    setCommentValue(
      commentValue.substring(0, selectedMentionIndex) +
        `${newMentionValue}` +
        (commentValue.length > mentionLengthIndex + 1
          ? commentValue.substring(mentionLengthIndex, commentValue.length)
          : ' ')
    );
  }

  function altEnterListener(e: SyntheticKeyboardEvent<*>) {
    if ((livestream || e.ctrlKey || e.metaKey) && e.keyCode === KEYCODES.ENTER) {
      e.preventDefault();
      buttonRef.current.click();
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

    if (!channelId) {
      doToast({
        message: __('Unable to verify channel settings. Try refreshing the page.'),
        isError: true,
      });
      return;
    }

    // if comment post didn't work, but tip was already made, try again to create comment
    if (commentFailure && tipAmount === successTip.tipAmount) {
      handleCreateComment(successTip.txid);
      return;
    } else {
      setSuccessTip({ txid: undefined, tipAmount: undefined });
    }

    // !! Beware of stale closure when editing the then-block, including doSubmitTip().
    doFetchCreatorSettings(channelId).then(() => {
      const lockedMinAmount = minAmount; // value during closure.
      const currentMinAmount = minAmountRef.current; // value from latest doFetchCreatorSettings().

      if (lockedMinAmount !== currentMinAmount) {
        doToast({
          message: __('The creator just updated the minimum setting. Please revise or double-check your tip amount.'),
          isError: true,
        });
        setIsReviewingSupportComment(false);
        return;
      }

      doSubmitTip();
    });
  }

  function doSubmitTip() {
    if (!activeChannelClaim) {
      return;
    }

    const params = {
      amount: tipAmount,
      claim_id: claimId,
      channel_id: activeChannelClaim.claim_id,
    };

    const activeChannelName = activeChannelClaim && activeChannelClaim.name;
    const activeChannelId = activeChannelClaim && activeChannelClaim.claim_id;

    // setup variables for tip API
    let channelClaimId, tipChannelName;
    // if there is a signing channel it's on a file
    if (claim.signing_channel) {
      channelClaimId = claim.signing_channel.claim_id;
      tipChannelName = claim.signing_channel.name;

      // otherwise it's on the channel page
    } else {
      channelClaimId = claim.claim_id;
      tipChannelName = claim.name;
    }

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

          doToast({
            message: __(
              "You sent %tipAmount% LBRY Credits as a tip to %tipChannelName%, I'm sure they appreciate it!",
              {
                tipAmount: tipAmount, // force show decimal places
                tipChannelName,
              }
            ),
          });

          setSuccessTip({ txid, tipAmount });
        },
        () => {
          // reset the frontend so people can send a new comment
          setIsSubmitting(false);
        }
      );
    } else {
      const sourceClaimId = claim.claim_id;
      const roundedAmount = Math.round(tipAmount * 100) / 100;

      Lbryio.call(
        'customer',
        'tip',
        {
          // round to deal with floating point precision
          amount: Math.round(100 * roundedAmount), // convert from dollars to cents
          creator_channel_name: tipChannelName, // creator_channel_name
          creator_channel_claim_id: channelClaimId,
          tipper_channel_name: activeChannelName,
          tipper_channel_claim_id: activeChannelId,
          currency: 'USD',
          anonymous: false,
          source_claim_id: sourceClaimId,
          environment: stripeEnvironment,
        },
        'post'
      )
        .then((customerTipResponse) => {
          const paymentIntendId = customerTipResponse.payment_intent_id;

          handleCreateComment(null, paymentIntendId, stripeEnvironment);

          setCommentValue('');
          setIsReviewingSupportComment(false);
          setIsSupportComment(false);
          setCommentFailure(false);
          setIsSubmitting(false);

          doToast({
            message: __("You sent $%formattedAmount% as a tip to %tipChannelName%, I'm sure they appreciate it!", {
              formattedAmount: roundedAmount.toFixed(2), // force show decimal places
              tipChannelName,
            }),
          });

          // handleCreateComment(null);
        })
        .catch((error) => {
          doToast({
            message:
              error.message !== 'payment intent failed to confirm'
                ? error.message
                : 'Sorry, there was an error in processing your payment!',
            isError: true,
          });
        });
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

    createComment(commentValue, claimId, parentId, txid, payment_intent_id, environment)
      .then((res) => {
        setIsSubmitting(false);
        if (setQuickReply) setQuickReply(res);

        if (res && res.signature) {
          setCommentValue('');
          setIsReviewingSupportComment(false);
          setIsSupportComment(false);
          setCommentFailure(false);

          if (onDoneReplying) {
            onDoneReplying();
          }
        }
      })
      .catch(() => {
        setIsSubmitting(false);
        setCommentFailure(true);

        if (channelId) {
          // It could be that the creator added a minimum tip setting.
          // Manually update for now until a websocket msg is available.
          doFetchCreatorSettings(channelId);
        }
      });
  }

  // **************************************************************************
  // Effects
  // **************************************************************************

  // Fetch channel constraints if not already.
  React.useEffect(() => {
    if (!channelSettings && channelId) {
      doFetchCreatorSettings(channelId);
    }
  }, [channelId, channelSettings, doFetchCreatorSettings]);

  // Notifications: Fetch top-level comments to identify if it has been deleted and can reply to it
  React.useEffect(() => {
    if (shouldFetchComment && fetchComment) {
      fetchComment(parentId).then((result) => {
        setDeletedComment(String(result).includes('Error'));
      });
    }
  }, [fetchComment, shouldFetchComment, parentId]);

  // **************************************************************************
  // Render
  // **************************************************************************

  if (channelSettings && !channelSettings.comments_enabled) {
    return <Empty padded text={__('This channel has disabled comments on their page.')} />;
  }

  if (!isFetchingChannels && !hasChannels) {
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
        <FormField type="textarea" name={'comment_signup_prompt'} placeholder={__('Say something about this...')} />
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
          <CreditAmount
            className="comment__sc-preview-amount"
            isFiat={activeTab === TAB_FIAT}
            amount={tipAmount}
            size={activeTab === TAB_LBC ? 18 : 2}
          />

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
            disabled={disabled || !minAmountMet}
            label={
              isSubmitting
                ? __('Sending...')
                : commentFailure && tipAmount === successTip.tipAmount
                ? __('Re-submit')
                : __('Send')
            }
            onClick={handleSupportComment}
          />
          <Button
            disabled={isSubmitting}
            button="link"
            label={__('Cancel')}
            onClick={() => setIsReviewingSupportComment(false)}
          />
          {MinAmountNotice}
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
      {!advancedEditor && (
        <ChannelMentionSuggestions
          uri={uri}
          isLivestream={livestream}
          inputRef={formFieldInputRef}
          mentionTerm={channelMention}
          creatorUri={channelUri}
          customSelectAction={handleSelectMention}
        />
      )}
      <FormField
        disabled={isFetchingChannels}
        type={SIMPLE_SITE ? 'textarea' : advancedEditor && !isReply ? 'markdown' : 'textarea'}
        name={isReply ? 'content_reply' : 'content_description'}
        ref={formFieldRef}
        className={isReply ? 'content_reply' : 'content_comment'}
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
        quickActionHandler={() => !SIMPLE_SITE && setAdvancedEditor(!advancedEditor)}
        onFocus={onTextareaFocus}
        onBlur={onTextareaBlur}
        placeholder={__('Say something about this...')}
        value={commentValue}
        charCount={charCount}
        onChange={handleCommentChange}
        autoFocus={isReply}
        textAreaMaxLength={livestream ? FF_MAX_CHARS_IN_LIVESTREAM_COMMENT : FF_MAX_CHARS_IN_COMMENT}
      />
      {isSupportComment && (
        <WalletTipAmountSelector
          onTipErrorChange={setTipError}
          shouldDisableReviewButton={setShouldDisableReviewButton}
          claim={claim}
          activeTab={activeTab}
          amount={tipAmount}
          onChange={(amount) => setTipAmount(amount)}
        />
      )}
      <div className="section__actions section__actions--no-margin">
        {isSupportComment ? (
          <>
            <Button
              disabled={disabled || tipError || shouldDisableReviewButton || !minAmountMet}
              type="button"
              button="primary"
              icon={activeTab === TAB_LBC ? ICONS.LBC : ICONS.FINANCE}
              label={__('Review')}
              onClick={() => setIsReviewingSupportComment(true)}
              requiresAuth={IS_WEB}
            />

            <Button
              disabled={isSubmitting}
              button="link"
              label={__('Cancel')}
              onClick={() => setIsSupportComment(false)}
            />
          </>
        ) : (
          <>
            {(!minTip || claimIsMine) && (
              <Button
                ref={buttonRef}
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
            )}
            {!supportDisabled && !claimIsMine && (
              <>
                <Button
                  disabled={disabled}
                  button="alt"
                  className="thatButton"
                  icon={ICONS.LBC}
                  onClick={() => {
                    setIsSupportComment(true);
                    setActiveTab(TAB_LBC);
                  }}
                />
                {/* @if TARGET='web' */}
                {stripeEnvironment && (
                  <Button
                    disabled={disabled}
                    button="alt"
                    className="thisButton"
                    icon={ICONS.FINANCE}
                    onClick={() => {
                      setIsSupportComment(true);
                      setActiveTab(TAB_FIAT);
                    }}
                  />
                )}
                {/* @endif */}
              </>
            )}
            {isReply && !minTip && (
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
        {deletedComment && <div className="error__text">{__('This comment has been deleted.')}</div>}
        {MinAmountNotice}
      </div>
    </Form>
  );
}
