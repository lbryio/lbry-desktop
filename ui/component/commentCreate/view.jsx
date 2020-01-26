// @flow
import { CHANNEL_NEW, MINIMUM_PUBLISH_BID } from 'constants/claim';
import React, { useEffect, useState } from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import ChannelSection from 'component/selectChannel';
import usePersistedState from 'effects/use-persisted-state';
import * as MODALS from 'constants/modal_types';
import I18nMessage from 'component/i18nMessage';

type Props = {
  commentingEnabled: boolean,
  uri: string,
  claim: StreamClaim,
  openModal: (id: string, { onCommentAcknowledge: () => void }) => void,
  createComment: (string, string, string) => void,
  balance: number,
  isPending: boolean,
  sendSupport: (number, string, boolean) => void,
};

export function CommentCreate(props: Props) {
  const { commentingEnabled, createComment, claim, openModal, balance, isPending, sendSupport } = props;
  const { claim_id: claimId } = claim;
  const [commentValue, setCommentValue] = usePersistedState(`comment-${claimId}`, '');
  const [commentAck, setCommentAck] = usePersistedState('comment-acknowledge', false);
  const [channel, setChannel] = usePersistedState('comment-channel', 'anonymous');
  const [charCount, setCharCount] = useState(commentValue.length);
  const [isTipping, setTippingStatus] = usePersistedState('comment-is-tipping', false);
  const [tipAmount, setTipAmount] = usePersistedState('comment-tip', 0.0);
  const [tipError, setTipError] = useState('');

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
    if (channel !== CHANNEL_NEW && commentValue.length && !(isPending || tipError)) {
      sendSupport(tipAmount, claimId, false);
      createComment(commentValue, claimId, channel);
    }
    setCommentValue('');
    setTippingStatus(false);
  }

  function handleTippingStatus() {
    setTippingStatus(!isTipping);
  }

  function handleTipAmountChanged(event) {
    const regexp = RegExp(/^(\d*([.]\d{0,8})?)$/);
    const validTipInput = regexp.test(event.target.value);
    const tipAmount = parseFloat(event.target);
    let _tipError = '';

    if (!tipAmount) {
      _tipError = __('Amount must be a number');
    } else if (tipAmount <= 0) {
      _tipError = __('Amount must be a positive number');
    } else if (tipAmount < MINIMUM_PUBLISH_BID) {
      _tipError = __('Amount must be higher');
    } else if (!validTipInput) {
      _tipError = __('Amount must have no more than 8 decimal places');
    } else if (tipAmount === balance) {
      _tipError = __('Please decrease the amount to account for transaction fees');
    } else if (tipAmount > balance) {
      _tipError = __('Not enough credits');
    }

    setTipAmount(event.target.value);
    setTipError(_tipError);
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
    <Form onSubmit={handleSubmit}>
      <ChannelSection channel={channel} onChannelChange={handleChannelChange} />
      <FormField
        disabled={channel === CHANNEL_NEW}
        type="textarea"
        name="content_description"
        onFocus={onTextareaFocus}
        placeholder={__('Say something about this...')}
        value={commentValue}
        charCount={charCount}
        onChange={handleCommentChange}
      />
      <FormField
        name="coment-is-tipping"
        type="checkbox"
        label={__('Include Tip')}
        checked={isTipping}
        onChange={handleTippingStatus}
      />
      {isTipping && (
        <FormField
          name="comment-tip-amount"
          className="form-field--price-amount"
          min="0"
          step="any"
          type="number"
          placeholder="1.23"
          onChange={handleTipAmountChanged}
          error={tipError}
        />
      )}
      <div className="section__actions">
        <Button
          button="primary"
          disabled={channel === CHANNEL_NEW || !commentValue.length || isPending || tipError}
          type="submit"
          label={__('Post')}
          requiresAuth={IS_WEB}
          onClick={handleSubmit}
        />
      </div>
    </Form>
  );
}
