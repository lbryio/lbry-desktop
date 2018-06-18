// @flow
import * as React from 'react';
import { isNameValid, buildURI, regexInvalidURI, THUMBNAIL_STATUSES } from 'lbry-redux';
import { Form, FormField, FormRow, FormFieldPrice, Submit } from 'component/common/form';
import Button from 'component/button';
import ChannelSection from 'component/selectChannel';
import classnames from 'classnames';
import type { PublishParams, UpdatePublishFormData } from 'redux/reducers/publish';
import FileSelector from 'component/common/file-selector';
import SelectThumbnail from 'component/selectThumbnail';
import { COPYRIGHT, OTHER } from 'constants/licenses';
import { CHANNEL_NEW, CHANNEL_ANONYMOUS, MINIMUM_PUBLISH_BID } from 'constants/claim';
import * as icons from 'constants/icons';
import type { Claim } from 'types/claim';
import BidHelpText from './internal/bid-help-text';
import LicenseType from './internal/license-type';

type Props = {
  publish: PublishParams => void,
  filePath: ?string,
  bid: ?number,
  editingURI: ?string,
  title: ?string,
  thumbnail: ?string,
  uploadThumbnailStatus: ?string,
  thumbnailPath: ?string,
  description: ?string,
  language: string,
  nsfw: boolean,
  contentIsFree: boolean,
  price: {
    amount: number,
    currency: string,
  },
  channel: string,
  name: ?string,
  tosAccepted: boolean,
  updatePublishForm: UpdatePublishFormData => void,
  bid: number,
  nameError: ?string,
  isResolvingUri: boolean,
  winningBidForClaimUri: number,
  myClaimForUri: ?Claim,
  licenseType: string,
  otherLicenseDescription: ?string,
  licenseUrl: ?string,
  copyrightNotice: ?string,
  uri: ?string,
  bidError: ?string,
  publishing: boolean,
  balance: number,
  isStillEditing: boolean,
  clearPublish: () => void,
  resolveUri: string => void,
  scrollToTop: () => void,
  prepareEdit: ({}) => void,
  resetThumbnailStatus: () => void,
};

class PublishForm extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    (this: any).handleFileChange = this.handleFileChange.bind(this);
    (this: any).checkIsFormValid = this.checkIsFormValid.bind(this);
    (this: any).renderFormErrors = this.renderFormErrors.bind(this);
    (this: any).handlePublish = this.handlePublish.bind(this);
    (this: any).handleCancelPublish = this.handleCancelPublish.bind(this);
    (this: any).handleNameChange = this.handleNameChange.bind(this);
    (this: any).handleChannelChange = this.handleChannelChange.bind(this);
    (this: any).editExistingClaim = this.editExistingClaim.bind(this);
    (this: any).getNewUri = this.getNewUri.bind(this);
  }

  componentWillMount() {
    const { isStillEditing, thumbnail } = this.props;
    if (!isStillEditing || !thumbnail) {
      this.props.resetThumbnailStatus();
    }
  }

  getNewUri(name: string, channel: string) {
    const { resolveUri } = this.props;
    // If they are midway through a channel creation, treat it as anonymous until it completes
    const channelName = channel === CHANNEL_ANONYMOUS || channel === CHANNEL_NEW ? '' : channel;

    let uri;
    try {
      uri = buildURI({ contentName: name, channelName });
    } catch (e) {
      // something wrong with channel or name
    }

    if (uri) {
      resolveUri(uri);
      return uri;
    }

    return '';
  }

  handleFileChange(filePath: string, fileName: string) {
    const { updatePublishForm, channel, name } = this.props;
    const newFileParams: {
      filePath: string,
      name?: string,
      uri?: string,
    } = { filePath };

    if (!name) {
      const parsedFileName = fileName.replace(regexInvalidURI, '');
      const uri = this.getNewUri(parsedFileName, channel);
      newFileParams.name = parsedFileName;
      newFileParams.uri = uri;
    }

    updatePublishForm(newFileParams);
  }

  handleNameChange(name: ?string) {
    const { channel, updatePublishForm } = this.props;

    if (!name) {
      updatePublishForm({ name, nameError: undefined });
      return;
    }

    if (!isNameValid(name, false)) {
      updatePublishForm({
        name,
        nameError: __('LBRY names must contain only letters, numbers and dashes.'),
      });
      return;
    }

    const uri = this.getNewUri(name, channel);
    updatePublishForm({
      name,
      uri,
      nameError: undefined,
    });
  }

  handleChannelChange(channelName: string) {
    const { name, updatePublishForm } = this.props;
    const form = { channel: channelName };

    if (name) {
      form.uri = this.getNewUri(name, channelName);
    }
    updatePublishForm(form);
  }

  handleBidChange(bid: number) {
    const { balance, updatePublishForm } = this.props;

    let bidError;
    if (bid === 0) {
      bidError = __('Deposit cannot be 0');
    } else if (balance === bid) {
      bidError = __('Please decrease your deposit to account for transaction fees');
    } else if (balance < bid) {
      bidError = __('Deposit cannot be higher than your balance');
    } else if (bid <= MINIMUM_PUBLISH_BID) {
      bidError = __('Your deposit must be higher');
    }

    updatePublishForm({ bid, bidError });
  }

  editExistingClaim(myClaimForUri: ?{}, uri: string) {
    const { prepareEdit, scrollToTop } = this.props;
    if (myClaimForUri) {
      prepareEdit(myClaimForUri, uri);
      scrollToTop();
    }
  }

  handleCancelPublish() {
    const { clearPublish, scrollToTop } = this.props;
    scrollToTop();
    clearPublish();
  }

  handlePublish() {
    const {
      filePath,
      copyrightNotice,
      licenseType,
      licenseUrl,
      otherLicenseDescription,
      myClaimForUri,
      publish,
    } = this.props;

    let publishingLicense;
    switch (licenseType) {
      case COPYRIGHT:
        publishingLicense = copyrightNotice;
        break;
      case OTHER:
        publishingLicense = otherLicenseDescription;
        break;
      default:
        publishingLicense = licenseType;
    }

    const publishingLicenseUrl = licenseType === COPYRIGHT ? '' : licenseUrl;

    const publishParams = {
      filePath,
      bid: this.props.bid,
      title: this.props.title,
      thumbnail: this.props.thumbnail,
      description: this.props.description,
      language: this.props.language,
      nsfw: this.props.nsfw,
      license: publishingLicense,
      licenseUrl: publishingLicenseUrl,
      otherLicenseDescription,
      copyrightNotice,
      name: this.props.name,
      contentIsFree: this.props.contentIsFree,
      price: this.props.price,
      uri: this.props.uri,
      channel: this.props.channel,
      isStillEditing: this.props.isStillEditing,
    };

    // Editing a claim
    if (!filePath && myClaimForUri) {
      const { source } = myClaimForUri.value.stream;
      publishParams.sources = source;
    }

    publish(publishParams);
  }

  checkIsFormValid() {
    const { name, nameError, title, bid, bidError, tosAccepted } = this.props;
    return name && !nameError && title && bid && !bidError && tosAccepted;
  }

  renderFormErrors() {
    const { name, nameError, title, bid, bidError, tosAccepted } = this.props;

    if (nameError || bidError) {
      // There will be inline errors if either of these exist
      // These are just extra help at the bottom of the screen
      // There could be multiple bid errors, so just duplicate it at the bottom
      return (
        <div className="card__subtitle form-field__error">
          {nameError && <div>{__('The URL you created is not valid.')}</div>}
          {bidError && <div>{bidError}</div>}
        </div>
      );
    }

    return (
      <div className="card__content card__subtitle card__subtitle--block form-field__error">
        {!title && <div>{__('A title is required')}</div>}
        {!name && <div>{__('A URL is required')}</div>}
        {!bid && <div>{__('A bid amount is required')}</div>}
        {!tosAccepted && <div>{__('You must agree to the terms of service')}</div>}
      </div>
    );
  }

  render() {
    const {
      filePath,
      editingURI,
      title,
      thumbnail,
      uploadThumbnailStatus,
      description,
      language,
      nsfw,
      contentIsFree,
      price,
      channel,
      name,
      tosAccepted,
      updatePublishForm,
      bid,
      nameError,
      isResolvingUri,
      winningBidForClaimUri,
      myClaimForUri,
      licenseType,
      otherLicenseDescription,
      licenseUrl,
      copyrightNotice,
      uri,
      bidError,
      publishing,
      clearPublish,
      thumbnailPath,
      resetThumbnailStatus,
      isStillEditing,
    } = this.props;

    const formDisabled = (!filePath && !editingURI) || publishing;
    const formValid = this.checkIsFormValid();

    let submitLabel;
    if (isStillEditing) {
      submitLabel = !publishing ? __('Edit') : __('Editing...');
    } else {
      submitLabel = !publishing ? __('Publish') : __('Publishing...');
    }

    return (
      <Form onSubmit={this.handlePublish}>
        <section className={classnames('card card--section')}>
          <div className="card__title">{__('Content')}</div>
          <div className="card__subtitle">
            {editingURI ? __('Editing a claim') : __('What are you publishing?')}
          </div>
          {(filePath || !!editingURI) && (
            <div className="card-media__internal-links">
              <Button
                button="inverse"
                icon={icons.CLOSE}
                label={__('Clear')}
                onClick={clearPublish}
              />
            </div>
          )}
          <FileSelector currentPath={filePath} onFileChosen={this.handleFileChange} />
          {!!editingURI && (
            <p className="card__content card__subtitle">
              {__("If you don't choose a file, the file from your existing claim")}
              {` "${name}" `}
              {__('will be used.')}
            </p>
          )}
        </section>
        <div className={classnames({ 'card--disabled': formDisabled })}>
          <section className="card card--section">
            <FormRow>
              <FormField
                stretch
                type="text"
                name="content_title"
                label={__('Title')}
                placeholder={__('Titular Title')}
                disabled={formDisabled}
                value={title}
                onChange={e => updatePublishForm({ title: e.target.value })}
              />
            </FormRow>
            <FormRow padded>
              <FormField
                stretch
                type="markdown"
                name="content_description"
                label={__('Description')}
                placeholder={__('Description of your content')}
                value={description}
                disabled={formDisabled}
                onChange={text => updatePublishForm({ description: text })}
              />
            </FormRow>
          </section>

          <section className="card card--section">
            <div className="card__title">{__('Thumbnail')}</div>
            <div className="card__subtitle">
              {uploadThumbnailStatus === THUMBNAIL_STATUSES.API_DOWN ? (
                __('Enter a url for your thumbnail.')
              ) : (
                <React.Fragment>
                  {__(
                    'Upload your thumbnail to spee.ch, or enter the url manually. Learn more about spee.ch '
                  )}
                  <Button button="link" label={__('here')} href="https://spee.ch/about" />.
                </React.Fragment>
              )}
            </div>
            <SelectThumbnail
              thumbnailPath={thumbnailPath}
              thumbnail={thumbnail}
              uploadThumbnailStatus={uploadThumbnailStatus}
              updatePublishForm={updatePublishForm}
              formDisabled={formDisabled}
              resetThumbnailStatus={resetThumbnailStatus}
            />
          </section>

          <section className="card card--section">
            <div className="card__title">{__('Price')}</div>
            <div className="card__subtitle">{__('How much will this content cost?')}</div>
            <div className="card__content">
              <FormField
                type="radio"
                name="content_free"
                postfix={__('Free')}
                checked={contentIsFree}
                disabled={formDisabled}
                onChange={() => updatePublishForm({ contentIsFree: true })}
              />
              <FormField
                type="radio"
                name="content_cost"
                postfix={__('Choose price')}
                checked={!contentIsFree}
                disabled={formDisabled}
                onChange={() => updatePublishForm({ contentIsFree: false })}
              />
              {!contentIsFree && (
                <FormFieldPrice
                  name="content_cost_amount"
                  min="0"
                  price={price}
                  onChange={newPrice => updatePublishForm({ price: newPrice })}
                />
              )}
              {price.currency !== 'LBC' && (
                <p className="form-field__help">
                  {__(
                    'All content fees are charged in LBC. For non-LBC payment methods, the number of credits charged will be adjusted based on the value of LBRY credits at the time of purchase.'
                  )}
                </p>
              )}
            </div>
          </section>

          <section className="card card--section">
            <div className="card__title">{__('Anonymous or under a channel?')}</div>
            <p className="card__subtitle">
              {__('This is a username or handle that your content can be found under.')}{' '}
              {__('Ex. @Marvel, @TheBeatles, @BooksByJoe')}
            </p>
            <ChannelSection channel={channel} onChannelChange={this.handleChannelChange} />
          </section>

          <section className="card card--section">
            <div className="card__title">{__('Where can people find this content?')}</div>
            <p className="card__subtitle">
              {__(
                'The LBRY URL is the exact address where people find your content (ex. lbry://myvideo).'
              )}{' '}
              <Button button="link" label={__('Learn more')} href="https://lbry.io/faq/naming" />
            </p>
            <div className="card__content">
              <FormRow>
                <FormField
                  stretch
                  prefix={`lbry://${
                    !channel || channel === CHANNEL_ANONYMOUS || channel === CHANNEL_NEW
                      ? ''
                      : `${channel}/`
                  }`}
                  type="text"
                  name="content_name"
                  placeholder="myname"
                  value={name}
                  onChange={event => this.handleNameChange(event.target.value)}
                  error={nameError}
                  helper={
                    <BidHelpText
                      isStillEditing={isStillEditing}
                      uri={uri}
                      editingURI={editingURI}
                      isResolvingUri={isResolvingUri}
                      winningBidForClaimUri={winningBidForClaimUri}
                      myClaimForUri={myClaimForUri}
                      onEditMyClaim={this.editExistingClaim}
                    />
                  }
                />
              </FormRow>
            </div>
            <div className={classnames('card__content', { 'card--disabled': !name })}>
              <FormField
                className="input--price-amount"
                type="number"
                name="content_bid"
                step="any"
                label={__('Deposit')}
                postfix="LBC"
                value={bid}
                error={bidError}
                min="0"
                disabled={!name}
                onChange={event => this.handleBidChange(parseFloat(event.target.value))}
                helper={__('This LBC remains yours and the deposit can be undone at any time.')}
                placeholder={winningBidForClaimUri ? winningBidForClaimUri + 0.1 : 0.1}
              />
            </div>
          </section>

          <section className="card card--section">
            <FormRow>
              <FormField
                type="checkbox"
                name="content_is_mature"
                postfix={__('Mature audiences only')}
                checked={nsfw}
                onChange={event => updatePublishForm({ nsfw: event.target.checked })}
              />
            </FormRow>

            <FormRow padded>
              <FormField
                label={__('Language')}
                type="select"
                name="content_language"
                value={language}
                onChange={event => updatePublishForm({ language: event.target.value })}
              >
                <option value="en">{__('English')}</option>
                <option value="zh">{__('Chinese')}</option>
                <option value="fr">{__('French')}</option>
                <option value="de">{__('German')}</option>
                <option value="jp">{__('Japanese')}</option>
                <option value="ru">{__('Russian')}</option>
                <option value="es">{__('Spanish')}</option>
              </FormField>
            </FormRow>

            <LicenseType
              licenseType={licenseType}
              otherLicenseDescription={otherLicenseDescription}
              licenseUrl={licenseUrl}
              copyrightNotice={copyrightNotice}
              handleLicenseChange={(newLicenseType, newLicenseUrl) =>
                updatePublishForm({
                  licenseType: newLicenseType,
                  licenseUrl: newLicenseUrl,
                })
              }
              handleLicenseDescriptionChange={event =>
                updatePublishForm({
                  otherLicenseDescription: event.target.value,
                })
              }
              handleLicenseUrlChange={event =>
                updatePublishForm({ licenseUrl: event.target.value })
              }
              handleCopyrightNoticeChange={event =>
                updatePublishForm({ copyrightNotice: event.target.value })
              }
            />
          </section>

          <section className="card card--section">
            <div className="card__title">{__('Terms of Service')}</div>
            <div className="card__content">
              <FormField
                name="lbry_tos"
                type="checkbox"
                checked={tosAccepted}
                postfix={
                  <span>
                    {__('I agree to the')}{' '}
                    <Button
                      button="link"
                      href="https://www.lbry.io/termsofservice"
                      label={__('LBRY terms of service')}
                    />
                  </span>
                }
                onChange={event => updatePublishForm({ tosAccepted: event.target.checked })}
              />
            </div>
          </section>

          <div className="card__actions">
            <Submit
              label={submitLabel}
              disabled={
                formDisabled ||
                !formValid ||
                uploadThumbnailStatus === THUMBNAIL_STATUSES.IN_PROGRESS
              }
            />
            <Button button="alt" onClick={this.handleCancelPublish} label={__('Cancel')} />
          </div>
          {!formDisabled && !formValid && this.renderFormErrors()}
        </div>
      </Form>
    );
  }
}

export default PublishForm;
