// @flow
import React from 'react';
import moment from 'moment';
import classnames from 'classnames';

import './style.scss';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';
import { Modal } from 'modal/modal';
import Card from 'component/common/card';
import Tag from 'component/tag';
import MarkdownPreview from 'component/common/markdown-preview';
import { getLanguageName } from 'constants/languages';
import { COPYRIGHT, OTHER } from 'constants/licenses';
import LbcSymbol from 'component/common/lbc-symbol';
import ChannelThumbnail from 'component/channelThumbnail';
import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';
import { NO_FILE } from 'redux/actions/publish';
import { PAYWALL } from 'constants/publish';
import * as STRIPE from 'constants/stripe';
import { TO_SECONDS } from 'util/stripe';
import { removeInternalTags } from 'util/tags';
import { secondsToDhms } from 'util/time';

type Props = {
  filePath: string | WebFile,
  isMarkdownPost: boolean,
  optimize: boolean,
  title: ?string,
  description: ?string,
  channel: ?string,
  bid: ?number,
  uri: ?string,
  paywall: Paywall,
  fee: Price,
  fiatPurchaseEnabled: boolean,
  fiatPurchaseFee: Price,
  fiatRentalEnabled: boolean,
  fiatRentalFee: Price,
  fiatRentalExpiration: Duration,
  language: string,
  releaseTimeEdited: ?number,
  licenseType: string,
  otherLicenseDescription: ?string,
  licenseUrl: ?string,
  tags: Array<Tag>,
  isVid: boolean,
  ffmpegStatus: any,
  previewResponse: PublishResponse,
  publish: (?string, ?boolean) => void,
  closeModal: () => void,
  enablePublishPreview: boolean,
  setEnablePublishPreview: (boolean) => void,
  isStillEditing: boolean,
  myChannels: ?Array<ChannelClaim>,
  publishSuccess: boolean,
  publishing: boolean,
  isLivestreamClaim: boolean,
  remoteFile: string,
  tiersWithExclusiveContent: MembershipTiers,
  tiersWithExclusiveLivestream: MembershipTiers,
  myMembershipTiers: MembershipTiers,
  restrictingTiers: string,
  appLanguage: string,
};

// class ModalPublishPreview extends React.PureComponent<Props> {
const ModalPublishPreview = (props: Props) => {
  const {
    filePath,
    isMarkdownPost,
    optimize,
    title,
    description,
    channel,
    bid,
    uri,
    paywall,
    fee,

    fiatPurchaseEnabled,
    fiatPurchaseFee,
    fiatRentalEnabled,
    fiatRentalFee,
    fiatRentalExpiration,

    language,
    releaseTimeEdited,
    licenseType,
    otherLicenseDescription,
    licenseUrl,
    tags,
    isVid,
    ffmpegStatus = {},
    previewResponse,
    enablePublishPreview,
    setEnablePublishPreview,
    isStillEditing,
    myChannels,
    publishSuccess,
    publishing,
    publish,
    closeModal,
    isLivestreamClaim,
    remoteFile,
    tiersWithExclusiveContent,
    tiersWithExclusiveLivestream,
    myMembershipTiers,
    restrictingTiers,
    appLanguage,
  } = props;

  const livestream =
    (uri && isLivestreamClaim) ||
    //   $FlowFixMe
    (previewResponse?.outputs[0] && previewResponse.outputs[0].value && !previewResponse.outputs[0].value.source);
  // leave the confirm modal up if we're not going straight to upload/reflecting

  const formattedTitle = truncateWithEllipsis(title, 128);
  const formattedUri = truncateWithEllipsis(uri, 128);
  const releasesInFuture = releaseTimeEdited && moment(releaseTimeEdited * 1000).isAfter();
  const txFee = previewResponse ? previewResponse['total_fee'] : null;
  const isOptimizeAvail = filePath && filePath !== '' && isVid && ffmpegStatus.available;
  const modalTitle = getModalTitle();
  const confirmBtnText = getConfirmButtonText();
  const tiers = livestream ? tiersWithExclusiveLivestream : tiersWithExclusiveContent; // See #2285

  const membershipsToUseIds = tiers && tiers.map((membershipTier) => membershipTier?.Membership?.id);

  // **************************************************************************
  // **************************************************************************

  function createRow(label: string, value: any, hide?: boolean) {
    return hide ? null : (
      <tr>
        <td>{label}</td>
        <td>{value}</td>
      </tr>
    );
  }

  function truncateWithEllipsis(str, maxChars) {
    if (str && str.length > maxChars) {
      return str.slice(0, maxChars).trim() + '...';
    }
    return str;
  }

  function getFilePathName(filePath: string | WebFile) {
    if (!filePath) {
      return NO_FILE;
    }

    if (typeof filePath === 'string') {
      return filePath;
    } else {
      return filePath.name;
    }
  }

  function getModalTitle() {
    if (isStillEditing) {
      if (livestream || isLivestreamClaim) {
        return __('Confirm Update');
      } else {
        return __('Confirm Edit');
      }
    } else if (livestream || isLivestreamClaim || remoteFile) {
      return releasesInFuture
        ? __('Schedule Livestream')
        : (!livestream || !isLivestreamClaim) && remoteFile
        ? __('Publish Replay')
        : __('Create Livestream');
    } else if (isMarkdownPost) {
      return __('Confirm Post');
    } else {
      return __('Confirm Upload');
    }
  }

  function getConfirmButtonText() {
    if (!publishing) {
      return __('Confirm');
    } else {
      return __('Confirming...');
    }
  }

  function getDescription() {
    return description ? (
      <div className="media__info-text-preview">
        <MarkdownPreview content={description} simpleLinks />
      </div>
    ) : null;
  }

  function getLicense() {
    return licenseType === COPYRIGHT ? (
      <p>© {otherLicenseDescription}</p>
    ) : licenseType === OTHER ? (
      <p>
        {otherLicenseDescription}
        <br />
        {licenseUrl}
      </p>
    ) : (
      <p>{__(licenseType)}</p>
    );
  }

  function getDeposit() {
    return bid ? <LbcSymbol postfix={`${bid}`} size={14} /> : <p>---</p>;
  }

  function getPriceLabel() {
    if (paywall === PAYWALL.FIAT) {
      return `${__('Price')} *`;
    }
    return __('Price');
  }

  function getPriceValue() {
    switch (paywall) {
      case PAYWALL.FREE:
        return __('Free');

      case PAYWALL.SDK:
        if (fee.currency === 'LBC') {
          return <LbcSymbol postfix={fee.amount} />;
        } else {
          return `${fee.amount} ${fee.currency}`;
        }

      case PAYWALL.FIAT:
        const rentalSeconds = fiatRentalExpiration.value * (TO_SECONDS[fiatRentalExpiration.unit] || 3600);
        return (
          <>
            {fiatPurchaseEnabled && fiatPurchaseFee && (
              <div className="publish-preview__fiat-price">
                <Icon icon={ICONS.BUY} />
                <p>
                  {__('Purchase for %currency%%amount%', {
                    currency: STRIPE.CURRENCY[fiatPurchaseFee.currency].symbol,
                    amount: fiatPurchaseFee.amount,
                  })}
                </p>
              </div>
            )}
            {fiatRentalEnabled && fiatRentalFee && fiatRentalExpiration && (
              <div className="publish-preview__fiat-price">
                <Icon icon={ICONS.TIME} />
                <p>
                  {__('Rent %duration% for %currency%%amount%', {
                    duration: secondsToDhms(rentalSeconds),
                    currency: STRIPE.CURRENCY[fiatRentalFee.currency].symbol,
                    amount: fiatRentalFee.amount,
                  })}
                </p>
              </div>
            )}
          </>
        );

      default:
        console.error(`Unhandled paywall type: ${paywall}`); // eslint-disable-line no-console
        return '?';
    }
  }

  function getTagsValue(tags) {
    const visibleTags = removeInternalTags(tags);
    return visibleTags.map((tag) => (
      <Tag
        key={tag.name}
        title={tag.name}
        name={tag.name}
        type="flow"
        onClick={() => {}} // Do nothing. Don't set to null since that results in "View Tag" action.
      />
    ));
  }

  function getChannelValue(channel) {
    const channelClaim = myChannels && myChannels.find((x) => x.name === channel);
    return channel ? (
      <div className="channel-value">
        {channelClaim && <ChannelThumbnail xsmall noLazyLoad uri={channelClaim.permanent_url} />}
        {channel}
      </div>
    ) : (
      <div className="channel-value">
        <Icon sectionIcon icon={ICONS.ANONYMOUS} />
        <i>{__('Anonymous')}</i>
      </div>
    );
  }

  function getReleaseTimeLabel() {
    return releasesInFuture ? __('Scheduled for') : __('Release date');
  }

  function getReleaseTimeValue(time) {
    if (time) {
      try {
        return new Date(time * 1000).toLocaleString(appLanguage);
      } catch {
        return moment(new Date(time * 1000)).format('MMMM Do, YYYY - h:mm a');
      }
    } else {
      return '';
    }
  }

  function getTierRestrictionValue() {
    if (myMembershipTiers && restrictingTiers) {
      const rt = restrictingTiers.split(',');

      return (
        <div className="publish-preview__tier-restrictions">
          {myMembershipTiers.map((tier: MembershipTier) => {
            const tierId = tier?.Membership?.id || '0';
            const tierRestrictionOn = rt.includes(tierId.toString());

            return tierRestrictionOn ? (
              <FormField
                key={tierId}
                name={tierId}
                type="checkbox"
                defaultChecked
                label={tier?.Membership?.name || tierId}
                className={classnames({
                  'hide-tier': !membershipsToUseIds.includes(tier.Membership.id),
                })}
              />
            ) : (
              <div key={tierId} className="dummy-tier" />
            );
          })}
        </div>
      );
    }
    return null;
  }

  function onConfirmed() {
    // Publish for real:
    publish(getFilePathName(filePath), false);
    // @if TARGET='app'
    closeModal();
    // @endif
  }

  // **************************************************************************
  // **************************************************************************

  // @if TARGET='web'
  React.useEffect(() => {
    if (publishing && !livestream) {
      closeModal();
    } else if (publishSuccess) {
      closeModal();
    }
  }, [publishSuccess, publishing, livestream, closeModal]);
  // @endif

  React.useEffect(() => {
    if (myMembershipTiers) {
      const elementsToHide = document.getElementsByClassName('hide-tier');

      if (elementsToHide) {
        for (const element of elementsToHide) {
          // $FlowFixMe
          element.parentElement.style.display = 'none';
        }
      }
    }
  }, [myMembershipTiers]);

  // **************************************************************************
  // **************************************************************************

  return (
    <Modal isOpen contentLabel={modalTitle} type="card" onAborted={closeModal}>
      <Form onSubmit={onConfirmed}>
        <Card
          title={modalTitle}
          body={
            <>
              <div className="section">
                <table className="table table--condensed table--publish-preview">
                  <tbody>
                    {!livestream && !isMarkdownPost && createRow(__('File'), getFilePathName(filePath))}
                    {livestream && remoteFile && createRow(__('Replay'), __('Remote File Selected'))}
                    {livestream && filePath && createRow(__('Replay'), __('Manual Upload'))}
                    {isOptimizeAvail && createRow(__('Transcode'), optimize ? __('Yes') : __('No'))}
                    {createRow(__('Title'), formattedTitle)}
                    {createRow(__('Description'), getDescription())}
                    {createRow(__('Channel'), getChannelValue(channel))}
                    {createRow(__('URL'), formattedUri)}
                    {createRow(__('Deposit'), getDeposit())}
                    {createRow(getPriceLabel(), getPriceValue())}
                    {createRow(__('Language'), language ? getLanguageName(language) : '')}
                    {releaseTimeEdited && createRow(getReleaseTimeLabel(), getReleaseTimeValue(releaseTimeEdited))}
                    {createRow(__('License'), getLicense())}
                    {createRow(__('Restricted to'), getTierRestrictionValue(), !tiers || !restrictingTiers)}
                    {createRow(__('Tags'), getTagsValue(tags))}
                  </tbody>
                </table>
              </div>
              {paywall === PAYWALL.FIAT && (
                <div className="publish-preview__fee-footnote">{`* ${__('processing and platform fees apply')}`}</div>
              )}
              {txFee && (
                <div className="publish-preview__blockchain-fee" aria-label={__('Estimated transaction fee:')}>
                  <b>{__('Est. transaction fee:')}</b>&nbsp;&nbsp;
                  <em>
                    <LbcSymbol postfix={txFee} />
                  </em>
                </div>
              )}
            </>
          }
          actions={
            <>
              <div className="section__actions">
                <Button autoFocus button="primary" disabled={publishing} label={confirmBtnText} onClick={onConfirmed} />
                <Button button="link" label={__('Cancel')} onClick={closeModal} />
              </div>
              <p className="help">{__('Once the transaction is sent, it cannot be reversed.')}</p>
              <FormField
                type="checkbox"
                name="sync_toggle"
                label={__('Skip preview and confirmation')}
                checked={!enablePublishPreview}
                onChange={() => setEnablePublishPreview(!enablePublishPreview)}
              />
            </>
          }
        />
      </Form>
    </Modal>
  );
};

export default ModalPublishPreview;
