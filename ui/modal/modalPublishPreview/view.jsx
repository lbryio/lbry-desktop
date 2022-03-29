// @flow
import React from 'react';
import moment from 'moment';
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
import { INTERNAL_TAGS } from 'constants/tags';

type Props = {
  filePath: string | WebFile,
  isMarkdownPost: boolean,
  optimize: boolean,
  title: ?string,
  description: ?string,
  channel: ?string,
  bid: ?number,
  uri: ?string,
  contentIsFree: boolean,
  fee: {
    amount: string,
    currency: string,
  },
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
    contentIsFree,
    fee,
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
    appLanguage,
  } = props;

  const maxCharsBeforeOverflow = 128;

  const formattedTitle = React.useMemo(() => {
    if (title && title.length > maxCharsBeforeOverflow) {
      return title.slice(0, maxCharsBeforeOverflow).trim() + '...';
    }
    return title;
  }, [title]);

  const formattedUri = React.useMemo(() => {
    if (uri && uri.length > maxCharsBeforeOverflow) {
      return uri.slice(0, maxCharsBeforeOverflow).trim() + '...';
    }
    return uri;
  }, [uri]);

  const livestream =
    (uri && isLivestreamClaim) ||
    //   $FlowFixMe
    (previewResponse.outputs[0] && previewResponse.outputs[0].value && !previewResponse.outputs[0].value.source);
  // leave the confirm modal up if we're not going straight to upload/reflecting
  // @if TARGET='web'
  React.useEffect(() => {
    if (publishing && !livestream) {
      closeModal();
    } else if (publishSuccess) {
      closeModal();
    }
  }, [publishSuccess, publishing, livestream]);
  // @endif
  function onConfirmed() {
    // Publish for real:
    publish(getFilePathName(filePath), false);
    // @if TARGET='app'
    closeModal();
    // @endif
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

  function createRow(label: string, value: any) {
    return (
      <tr>
        <td>{label}</td>
        <td>{value}</td>
      </tr>
    );
  }

  const releasesInFuture = releaseTimeEdited && moment(releaseTimeEdited * 1000).isAfter();

  const txFee = previewResponse ? previewResponse['total_fee'] : null;
  //   $FlowFixMe add outputs[0] etc to PublishResponse type
  const isOptimizeAvail = filePath && filePath !== '' && isVid && ffmpegStatus.available;
  let modalTitle;
  if (isStillEditing) {
    if (livestream) {
      modalTitle = __('Confirm Update');
    } else {
      modalTitle = __('Confirm Edit');
    }
  } else if (livestream) {
    modalTitle = releasesInFuture ? __('Schedule Livestream') : __('Create Livestream');
  } else {
    modalTitle = __('Confirm Upload');
  }

  let confirmBtnText;
  if (!publishing) {
    if (isStillEditing) {
      confirmBtnText = __('Save');
    } else if (livestream) {
      confirmBtnText = __('Create');
    } else {
      confirmBtnText = __('Upload');
    }
  } else {
    if (isStillEditing) {
      confirmBtnText = __('Saving');
    } else if (livestream) {
      confirmBtnText = __('Creating');
    } else {
      confirmBtnText = __('Uploading');
    }
  }

  const releaseDateText = releasesInFuture ? __('Scheduled for') : __('Release date');

  const descriptionValue = description ? (
    <div className="media__info-text-preview">
      <MarkdownPreview content={description} simpleLinks />
    </div>
  ) : null;

  const licenseValue =
    licenseType === COPYRIGHT ? (
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

  const visibleTags = tags.filter((tag) => !INTERNAL_TAGS.includes(tag.name));

  const tagsValue =
    // Do nothing for onClick(). Setting to 'null' results in "View Tag" action -- we don't want to leave the modal.
    visibleTags.map((tag) => <Tag key={tag.name} title={tag.name} name={tag.name} type={'flow'} onClick={() => {}} />);

  const depositValue = bid ? <LbcSymbol postfix={`${bid}`} size={14} /> : <p>---</p>;

  let priceValue = __('Free');
  if (!contentIsFree) {
    if (fee.currency === 'LBC') {
      priceValue = <LbcSymbol postfix={fee.amount} />;
    } else {
      priceValue = `${fee.amount} ${fee.currency}`;
    }
  }

  const channelValue = (channel) => {
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
  };

  const releaseTimeStr = (time) => {
    if (time) {
      try {
        return new Date(time * 1000).toLocaleString(appLanguage);
      } catch {
        return moment(new Date(time * 1000)).format('MMMM Do, YYYY - h:mm a');
      }
    } else {
      return '';
    }
  };

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
                    {isOptimizeAvail && createRow(__('Transcode'), optimize ? __('Yes') : __('No'))}
                    {createRow(__('Title'), formattedTitle)}
                    {createRow(__('Description'), descriptionValue)}
                    {createRow(__('Channel'), channelValue(channel))}
                    {createRow(__('URL'), formattedUri)}
                    {createRow(__('Deposit'), depositValue)}
                    {createRow(__('Price'), priceValue)}
                    {createRow(__('Language'), language ? getLanguageName(language) : '')}
                    {releaseTimeEdited && createRow(releaseDateText, releaseTimeStr(releaseTimeEdited))}
                    {createRow(__('License'), licenseValue)}
                    {createRow(__('Tags'), tagsValue)}
                  </tbody>
                </table>
              </div>
              {txFee && (
                <div className="section" aria-label={__('Estimated transaction fee:')}>
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
