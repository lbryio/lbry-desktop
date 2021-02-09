// @flow
import React from 'react';
import moment from 'moment';
import Button from 'component/button';
import { Form, FormField } from 'component/common/form';
import { Modal } from 'modal/modal';
import Card from 'component/common/card';
import Tag from 'component/tag';
import MarkdownPreview from 'component/common/markdown-preview';
import { COPYRIGHT, OTHER } from 'constants/licenses';
import LbcSymbol from 'component/common/lbc-symbol';
import ChannelThumbnail from 'component/channelThumbnail';
import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';

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
  release_time: ?string,
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
};

class ModalPublishPreview extends React.PureComponent<Props> {
  onConfirmed() {
    const { filePath, publish, closeModal } = this.props;
    // Publish for real:
    publish(this.resolveFilePathName(filePath), false);
    closeModal();
  }

  resolveFilePathName(filePath: string | WebFile) {
    if (!filePath) {
      return '---';
    }

    if (typeof filePath === 'string') {
      return filePath;
    } else {
      return filePath.name;
    }
  }

  createRow(label: string, value: any) {
    return (
      <tr>
        <td>{label}</td>
        <td>{value}</td>
      </tr>
    );
  }

  togglePreviewEnabled() {
    const { enablePublishPreview, setEnablePublishPreview } = this.props;
    setEnablePublishPreview(!enablePublishPreview);
  }

  render() {
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
      release_time,
      licenseType,
      otherLicenseDescription,
      licenseUrl,
      tags,
      isVid,
      ffmpegStatus = {},
      previewResponse,
      closeModal,
      enablePublishPreview,
      setEnablePublishPreview,
      isStillEditing,
      myChannels,
    } = this.props;

    const modalTitle = isStillEditing ? __('Confirm Edit') : __('Confirm Upload');
    const confirmBtnText = isStillEditing ? __('Save') : __('Upload');
    const txFee = previewResponse ? previewResponse['total_fee'] : null;
    const isOptimizeAvail = filePath && filePath !== '' && isVid && ffmpegStatus.available;

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
        <p>{licenseType}</p>
      );

    const tagsValue =
      // Do nothing for onClick(). Setting to 'null' results in "View Tag" action -- we don't want to leave the modal.
      tags.map((tag) => <Tag key={tag.name} title={tag.name} name={tag.name} type={'flow'} onClick={() => {}} />);

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
          {channelClaim && <ChannelThumbnail uri={channelClaim.permanent_url} />}
          {channel}
        </div>
      ) : (
        <div className="channel-value">
          <Icon sectionIcon icon={ICONS.ANONYMOUS} />
          <i>{__('Anonymous')}</i>
        </div>
      );
    };

    return (
      <Modal isOpen contentLabel={modalTitle} type="card" onAborted={closeModal}>
        <Form onSubmit={() => this.onConfirmed()}>
          <Card
            title={modalTitle}
            body={
              <>
                <div className="section">
                  <table className="table table--condensed table--publish-preview">
                    <tbody>
                      {!isMarkdownPost && this.createRow(__('File'), this.resolveFilePathName(filePath))}
                      {isOptimizeAvail && this.createRow(__('Transcode'), optimize ? __('Yes') : __('No'))}
                      {this.createRow(__('Title'), title)}
                      {this.createRow(__('Description'), descriptionValue)}
                      {this.createRow(__('Channel'), channelValue(channel))}
                      {this.createRow(__('URL'), uri)}
                      {this.createRow(__('Deposit'), depositValue)}
                      {this.createRow(__('Price'), priceValue)}
                      {this.createRow(__('Language'), language)}
                      {this.createRow(__('Release Date'), moment(release_time).format('MMMM Do, YYYY'))}
                      {this.createRow(__('License'), licenseValue)}
                      {this.createRow(__('Tags'), tagsValue)}
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
                  <Button autoFocus button="primary" label={confirmBtnText} onClick={() => this.onConfirmed()} />
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
  }
}

export default ModalPublishPreview;
