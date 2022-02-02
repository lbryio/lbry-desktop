// @flow

import 'scss/component/_comment-create.scss';

import { buildValidSticker } from 'util/comments';
import { FF_MAX_CHARS_IN_COMMENT, FF_MAX_CHARS_IN_LIVESTREAM_COMMENT } from 'constants/form-field';
import { FormField, Form } from 'component/common/form';
import { getChannelIdFromClaim } from 'util/claim';
import { Lbryio } from 'lbryinc';
import { SIMPLE_SITE } from 'config';
import { useHistory } from 'react-router';
import * as ICONS from 'constants/icons';
import * as KEYCODES from 'constants/keycodes';
import * as PAGES from 'constants/pages';
import * as MODALS from 'constants/modal_types';
import Button from 'component/button';
import ChannelThumbnail from 'component/channelThumbnail';
import classnames from 'classnames';
import CreditAmount from 'component/common/credit-amount';
import EmoteSelector from './emote-selector';
import Empty from 'component/common/empty';
import FilePrice from 'component/filePrice';
import I18nMessage from 'component/i18nMessage';
import Icon from 'component/common/icon';
import OptimizedImage from 'component/optimizedImage';
import React from 'react';
import SelectChannel from 'component/selectChannel';
import StickerSelector from './sticker-selector';
import type { ElementRef } from 'react';
import UriIndicator from 'component/uriIndicator';
import usePersistedState from 'effects/use-persisted-state';
import WalletTipAmountSelector from 'component/walletTipAmountSelector';
import { useIsMobile } from 'effects/use-screensize';

import { getStripeEnvironment } from 'util/stripe';
const stripeEnvironment = getStripeEnvironment();

const TAB_FIAT = 'TabFiat';
const TAB_LBC = 'TabLBC';

type TipParams = { tipAmount: number, tipChannelName: string, channelClaimId: string };
type UserParams = { activeChannelName: ?string, activeChannelId: ?string };

type Props = {
  activeChannel: string,
  activeChannelClaim: ?ChannelClaim,
  bottom: boolean,
  hasChannels: boolean,
  claim: StreamClaim,
  claimIsMine: boolean,
  embed?: boolean,
  isFetchingChannels: boolean,
  isNested: boolean,
  isReply: boolean,
  isLivestream?: boolean,
  parentId: string,
  settingsByChannelId: { [channelId: string]: PerChannelSettings },
  shouldFetchComment: boolean,
  supportDisabled: boolean,
  uri: string,
  disableInput?: boolean,
  createComment: (string, string, string, ?string, ?string, ?string, boolean) => Promise<any>,
  doFetchCreatorSettings: (channelId: string) => Promise<any>,
  doToast: ({ message: string }) => void,
  fetchComment: (commentId: string) => Promise<any>,
  onCancelReplying?: () => void,
  onDoneReplying?: () => void,
  sendCashTip: (TipParams, UserParams, string, ?string, (any) => void) => string,
  sendTip: ({}, (any) => void, (any) => void) => void,
  setQuickReply: (any) => void,
  toast: (string) => void,
  doOpenModal: (id: string, any) => void,
};

export function CommentCreate(props: Props) {
  const {
    activeChannelClaim,
    bottom,
    hasChannels,
    claim,
    claimIsMine,
    embed,
    isFetchingChannels,
    isNested,
    isReply,
    isLivestream,
    parentId,
    settingsByChannelId,
    shouldFetchComment,
    supportDisabled,
    uri,
    disableInput,
    createComment,
    doFetchCreatorSettings,
    doToast,
    fetchComment,
    onCancelReplying,
    onDoneReplying,
    sendCashTip,
    sendTip,
    setQuickReply,
    doOpenModal,
  } = props;

  const isMobile = useIsMobile();

  const formFieldRef: ElementRef<any> = React.useRef();
  const buttonRef: ElementRef<any> = React.useRef();

  const {
    push,
    location: { pathname },
  } = useHistory();

  const [isSubmitting, setSubmitting] = React.useState(false);
  const [commentFailure, setCommentFailure] = React.useState(false);
  const [successTip, setSuccessTip] = React.useState({ txid: undefined, tipAmount: undefined });
  const [isSupportComment, setIsSupportComment] = React.useState();
  const [isReviewingSupportComment, setReviewingSupportComment] = React.useState();
  const [isReviewingStickerComment, setReviewingStickerComment] = React.useState();
  const [selectedSticker, setSelectedSticker] = React.useState();
  const [tipAmount, setTipAmount] = React.useState(1);
  const [convertedAmount, setConvertedAmount] = React.useState();
  const [commentValue, setCommentValue] = React.useState('');
  const [advancedEditor, setAdvancedEditor] = usePersistedState('comment-editor-mode', false);
  const [stickerSelector, setStickerSelector] = React.useState();
  const [activeTab, setActiveTab] = React.useState();
  const [tipError, setTipError] = React.useState();
  const [deletedComment, setDeletedComment] = React.useState(false);
  const [showEmotes, setShowEmotes] = React.useState(false);
  const [disableReviewButton, setDisableReviewButton] = React.useState();
  const [exchangeRate, setExchangeRate] = React.useState();
  const [canReceiveFiatTip, setCanReceiveFiatTip] = React.useState(undefined);

  const claimId = claim && claim.claim_id;
  const charCount = commentValue ? commentValue.length : 0;
  const disabled = deletedComment || isSubmitting || isFetchingChannels || !commentValue.length || disableInput;
  const channelId = getChannelIdFromClaim(claim);
  const channelSettings = channelId ? settingsByChannelId[channelId] : undefined;
  const minSuper = (channelSettings && channelSettings.min_tip_amount_super_chat) || 0;
  const minTip = (channelSettings && channelSettings.min_tip_amount_comment) || 0;
  const minAmount = minTip || minSuper || 0;
  const minAmountMet = minAmount === 0 || tipAmount >= minAmount;
  const stickerPrice = selectedSticker && selectedSticker.price;

  const minAmountRef = React.useRef(minAmount);
  minAmountRef.current = minAmount;

  // **************************************************************************
  // Functions
  // **************************************************************************

  function handleSelectSticker(sticker: any) {
    // $FlowFixMe
    setSelectedSticker(sticker);
    setReviewingStickerComment(true);
    setTipAmount(sticker.price || 0);
    setStickerSelector(false);

    if (sticker.price && sticker.price > 0) {
      setActiveTab(canReceiveFiatTip ? TAB_FIAT : TAB_LBC);
      setIsSupportComment(true);
    }
  }

  function handleSupportComment() {
    if (!activeChannelClaim) return;

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
        setReviewingSupportComment(false);
        return;
      }

      doSubmitTip();
    });
  }

  function doSubmitTip() {
    if (!activeChannelClaim || isSubmitting) return;

    setSubmitting(true);

    const params = { amount: tipAmount, claim_id: claimId, channel_id: activeChannelClaim.claim_id };
    const activeChannelName = activeChannelClaim && activeChannelClaim.name;
    const activeChannelId = activeChannelClaim && activeChannelClaim.claim_id;

    // setup variables for tip API
    const channelClaimId = claim.signing_channel ? claim.signing_channel.claim_id : claim.claim_id;
    const tipChannelName = claim.signing_channel ? claim.signing_channel.name : claim.name;

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
            message: __("You sent %tipAmount% Credits as a tip to %tipChannelName%, I'm sure they appreciate it!", {
              tipAmount: tipAmount, // force show decimal places
              tipChannelName,
            }),
          });

          setSuccessTip({ txid, tipAmount });
        },
        () => {
          // reset the frontend so people can send a new comment
          setSubmitting(false);
        }
      );
    } else {
      const tipParams: TipParams = { tipAmount: Math.round(tipAmount * 100) / 100, tipChannelName, channelClaimId };
      const userParams: UserParams = { activeChannelName, activeChannelId };

      sendCashTip(tipParams, userParams, claim.claim_id, stripeEnvironment, (customerTipResponse) => {
        const { payment_intent_id } = customerTipResponse;

        handleCreateComment(null, payment_intent_id, stripeEnvironment);

        setCommentValue('');
        setReviewingSupportComment(false);
        setIsSupportComment(false);
        setCommentFailure(false);
        setSubmitting(false);
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
    if (isSubmitting || disableInput) return;

    setShowEmotes(false);
    setSubmitting(true);

    const stickerValue = selectedSticker && buildValidSticker(selectedSticker.name);

    createComment(stickerValue || commentValue, claimId, parentId, txid, payment_intent_id, environment, !!stickerValue)
      .then((res) => {
        setSubmitting(false);
        if (setQuickReply) setQuickReply(res);

        if (res && res.signature) {
          if (!stickerValue) setCommentValue('');
          setReviewingSupportComment(false);
          setIsSupportComment(false);
          setCommentFailure(false);

          if (onDoneReplying) {
            onDoneReplying();
          }
        }
      })
      .catch(() => {
        setSubmitting(false);
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Notifications: Fetch top-level comments to identify if it has been deleted and can reply to it
  React.useEffect(() => {
    if (shouldFetchComment && fetchComment) {
      fetchComment(parentId).then((result) => {
        setDeletedComment(String(result).includes('Error'));
      });
    }
  }, [fetchComment, shouldFetchComment, parentId]);

  // Stickers: Get LBC-USD exchange rate if hasn't yet and selected a paid sticker
  React.useEffect(() => {
    if (stickerPrice && !exchangeRate) Lbryio.getExchangeRates().then(({ LBC_USD }) => setExchangeRate(LBC_USD));
  }, [exchangeRate, stickerPrice]);

  // Stickers: Check if creator has a tip account saved (on selector so that if a paid sticker is selected,
  // it defaults to LBC tip instead of USD)
  React.useEffect(() => {
    if (!stripeEnvironment || !stickerSelector || canReceiveFiatTip !== undefined) return;

    const channelClaimId = claim.signing_channel ? claim.signing_channel.claim_id : claim.claim_id;
    const tipChannelName = claim.signing_channel ? claim.signing_channel.name : claim.name;

    Lbryio.call(
      'account',
      'check',
      {
        channel_claim_id: channelClaimId,
        channel_name: tipChannelName,
        environment: stripeEnvironment,
      },
      'post'
    )
      .then((accountCheckResponse) => {
        if (accountCheckResponse === true && canReceiveFiatTip !== true) {
          setCanReceiveFiatTip(true);
        } else {
          setCanReceiveFiatTip(false);
        }
      })
      .catch(() => {});
  }, [canReceiveFiatTip, claim.claim_id, claim.name, claim.signing_channel, stickerSelector]);

  // Handle keyboard shortcut comment creation
  React.useEffect(() => {
    function altEnterListener(e: SyntheticKeyboardEvent<*>) {
      const inputRef = formFieldRef && formFieldRef.current && formFieldRef.current.input;

      if (inputRef && inputRef.current === document.activeElement) {
        // $FlowFixMe
        const isTyping = Boolean(e.target.attributes['typing-term']);

        if (((isLivestream && !isTyping) || e.ctrlKey || e.metaKey) && e.keyCode === KEYCODES.ENTER) {
          e.preventDefault();
          buttonRef.current.click();
        }

        if (isLivestream && isTyping && e.keyCode === KEYCODES.ENTER) {
          inputRef.current.removeAttribute('typing-term');
        }
      }
    }

    window.addEventListener('keydown', altEnterListener);

    // removes the listener so it doesn't cause problems elsewhere in the app
    return () => {
      window.removeEventListener('keydown', altEnterListener);
    };
  }, [isLivestream]);

  // **************************************************************************
  // Render
  // **************************************************************************

  const getActionButton = (
    title: string,
    label?: string,
    icon: string,
    handleClick: () => void,
    disabled?: boolean
  ) => <Button title={title} label={label} button="alt" icon={icon} onClick={handleClick} disabled={disabled} />;

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
          if (isLivestream) {
            window.open(pathPlusRedirect);
          } else {
            push(pathPlusRedirect);
          }
        }}
      >
        <FormField type="textarea" name={'comment_signup_prompt'} placeholder={__('Say something about this...')} />
        <div className="section__actions--no-margin">
          <Button disabled button="primary" label={__('Post --[button to submit something]--')} requiresAuth />
        </div>
      </div>
    );
  }

  return (
    <Form
      onSubmit={() => {}}
      className={classnames('commentCreate', {
        'commentCreate--reply': isReply,
        'commentCreate--nestedReply': isNested,
        'commentCreate--bottom': bottom,
      })}
    >
      {/* Input Box/Preview Box */}
      {stickerSelector ? (
        <StickerSelector onSelect={(sticker) => handleSelectSticker(sticker)} claimIsMine={claimIsMine} />
      ) : isReviewingStickerComment && activeChannelClaim && selectedSticker ? (
        <div className="commentCreate__stickerPreview">
          <div className="commentCreate__stickerPreviewInfo">
            <ChannelThumbnail xsmall uri={activeChannelClaim.canonical_url} />
            <UriIndicator uri={activeChannelClaim.canonical_url} link />
          </div>

          <div className="commentCreate__stickerPreviewImage">
            <OptimizedImage src={selectedSticker && selectedSticker.url} waitLoad loading="lazy" />
          </div>

          {selectedSticker.price && exchangeRate && (
            <FilePrice
              customPrices={{ priceFiat: selectedSticker.price, priceLBC: selectedSticker.price / exchangeRate }}
              isFiat
            />
          )}
        </div>
      ) : isReviewingSupportComment && activeChannelClaim ? (
        <div className="commentCreate__supportCommentPreview">
          <CreditAmount
            amount={tipAmount}
            className="commentCreate__supportCommentPreviewAmount"
            isFiat={activeTab === TAB_FIAT}
            size={activeTab === TAB_LBC ? 18 : 2}
          />

          <ChannelThumbnail xsmall uri={activeChannelClaim.canonical_url} />
          <div className="commentCreate__supportCommentBody">
            <UriIndicator uri={activeChannelClaim.canonical_url} link />
            <div>{commentValue}</div>
          </div>
        </div>
      ) : (
        <>
          {showEmotes && (
            <EmoteSelector
              commentValue={commentValue}
              setCommentValue={setCommentValue}
              closeSelector={() => setShowEmotes(false)}
            />
          )}

          <FormField
            autoFocus={isReply}
            charCount={charCount}
            className={isReply ? 'create__reply' : 'create__comment'}
            disabled={isFetchingChannels || disableInput}
            isLivestream={isLivestream}
            label={
              <div className="commentCreate__labelWrapper">
                <span className="commentCreate__label">
                  {(isReply ? __('Replying as') : isLivestream ? __('Chat as') : __('Comment as')) + ' '}
                </span>
                <SelectChannel tiny />
              </div>
            }
            name={isReply ? 'create__reply' : 'create__comment'}
            onChange={(e) => setCommentValue(SIMPLE_SITE || !advancedEditor || isReply ? e.target.value : e)}
            openEmoteMenu={() => setShowEmotes(!showEmotes)}
            placeholder={__('Say something about this...')}
            quickActionHandler={!SIMPLE_SITE ? () => setAdvancedEditor(!advancedEditor) : undefined}
            quickActionLabel={
              !SIMPLE_SITE && (isReply ? undefined : advancedEditor ? __('Simple Editor') : __('Advanced Editor'))
            }
            ref={formFieldRef}
            textAreaMaxLength={isLivestream ? FF_MAX_CHARS_IN_LIVESTREAM_COMMENT : FF_MAX_CHARS_IN_COMMENT}
            type={!SIMPLE_SITE && advancedEditor && !isReply ? 'markdown' : 'textarea'}
            value={commentValue}
            uri={uri}
          />
        </>
      )}

      {!isMobile && (isSupportComment || (isReviewingStickerComment && stickerPrice)) && (
        <WalletTipAmountSelector
          activeTab={activeTab}
          amount={tipAmount}
          uri={uri}
          convertedAmount={convertedAmount}
          customTipAmount={stickerPrice}
          exchangeRate={exchangeRate}
          fiatConversion={selectedSticker && !!selectedSticker.price}
          onChange={(amount) => setTipAmount(amount)}
          setConvertedAmount={setConvertedAmount}
          setDisableSubmitButton={setDisableReviewButton}
          setTipError={setTipError}
          tipError={tipError}
        />
      )}

      {/* Bottom Action Buttons */}
      <div className="section__actions section__actions--no-margin">
        {/* Submit Button */}
        {isReviewingSupportComment ? (
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
        ) : isReviewingStickerComment && selectedSticker ? (
          <Button
            button="primary"
            label={__('Send')}
            disabled={(isSupportComment && (tipError || disableReviewButton)) || disableInput}
            onClick={() => {
              if (isSupportComment) {
                handleSupportComment();
              } else {
                handleCreateComment();
              }
              setSelectedSticker(null);
              setReviewingStickerComment(false);
              setStickerSelector(false);
              setIsSupportComment(false);
            }}
          />
        ) : isSupportComment ? (
          <Button
            disabled={disabled || tipError || disableReviewButton || !minAmountMet}
            type="button"
            button="primary"
            icon={activeTab === TAB_LBC ? ICONS.LBC : ICONS.FINANCE}
            label={__('Review')}
            onClick={() => setReviewingSupportComment(true)}
            requiresAuth
          />
        ) : (
          (!minTip || claimIsMine) && (
            <Button
              ref={buttonRef}
              button="primary"
              disabled={disabled || stickerSelector}
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
              requiresAuth
              onClick={() => activeChannelClaim && commentValue.length && handleCreateComment()}
            />
          )
        )}

        {/** Stickers/Support Buttons **/}
        {!supportDisabled && !stickerSelector && (
          <>
            {getActionButton(
              __('Stickers'),
              isReviewingStickerComment ? __('Different Sticker') : undefined,
              ICONS.STICKER,
              () => {
                if (isReviewingStickerComment) setReviewingStickerComment(false);
                setIsSupportComment(false);
                setStickerSelector(true);
              }
            )}

            {!claimIsMine && (
              <>
                {(!isSupportComment || activeTab !== TAB_LBC) &&
                  getActionButton(
                    __('Credits'),
                    isSupportComment ? __('Switch to Credits') : undefined,
                    ICONS.LBC,
                    () => {
                      setActiveTab(TAB_LBC);

                      if (isMobile) {
                        doOpenModal(MODALS.SEND_TIP, {
                          uri,
                          isTipOnly: true,
                          hasSelectedTab: TAB_LBC,
                          setAmount: (amount) => {
                            setTipAmount(amount);
                            setReviewingSupportComment(true);
                          },
                        });
                      } else {
                        setIsSupportComment(true);
                      }
                    },
                    !commentValue.length
                  )}

                {stripeEnvironment &&
                  (!isSupportComment || activeTab !== TAB_FIAT) &&
                  getActionButton(
                    __('Cash'),
                    isSupportComment ? __('Switch to Cash') : undefined,
                    ICONS.FINANCE,
                    () => {
                      setActiveTab(TAB_FIAT);

                      if (isMobile) {
                        doOpenModal(MODALS.SEND_TIP, {
                          uri,
                          isTipOnly: true,
                          hasSelectedTab: TAB_FIAT,
                          setAmount: (amount) => {
                            setTipAmount(amount);
                            setReviewingSupportComment(true);
                          },
                        });
                      } else {
                        setIsSupportComment(true);
                      }
                    },
                    !commentValue.length
                  )}
              </>
            )}
          </>
        )}

        {/* Cancel Button */}
        {(isSupportComment ||
          isReviewingSupportComment ||
          stickerSelector ||
          isReviewingStickerComment ||
          (isReply && !minTip)) && (
          <Button
            disabled={isSupportComment && isSubmitting}
            button="link"
            label={__('Cancel')}
            onClick={() => {
              if (isSupportComment || isReviewingSupportComment) {
                if (!isReviewingSupportComment) setIsSupportComment(false);
                setReviewingSupportComment(false);
                if (stickerPrice) {
                  setReviewingStickerComment(false);
                  setStickerSelector(false);
                  setSelectedSticker(null);
                }
              } else if (stickerSelector || isReviewingStickerComment) {
                setReviewingStickerComment(false);
                setStickerSelector(false);
                setSelectedSticker(null);
              } else if (isReply && !minTip && onCancelReplying) {
                onCancelReplying();
              }
            }}
          />
        )}

        {/* Help Text */}
        {deletedComment && <div className="error__text">{__('This comment has been deleted.')}</div>}
        {!!minAmount && (
          <div className="help--notice commentCreate__minAmountNotice">
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
        )}
      </div>
    </Form>
  );
}
