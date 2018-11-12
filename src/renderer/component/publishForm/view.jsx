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
import NameHelpText from './internal/name-help-text';
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
  nameError: ?string,
  isResolvingUri: boolean,
  winningBidForClaimUri: number,
  myClaimForUri: ?Claim,
  licenseType: string,
  otherLicenseDescription: ?string,
  licenseUrl: ?string,
  uri: ?string,
  bidError: ?string,
  publishing: boolean,
  balance: number,
  isStillEditing: boolean,
  clearPublish: () => void,
  resolveUri: string => void,
  scrollToTop: () => void,
  prepareEdit: (claim: any, uri: string) => void,
  resetThumbnailStatus: () => void,
  amountNeededForTakeover: ?number,
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
    const { thumbnail } = this.props;
    if (!thumbnail) {
      this.props.resetThumbnailStatus();
    }
  }

  getNewUri(name: string, channel: string) {
    const { resolveUri } = this.props;
    // If they are midway through a channel creation, treat it as anonymous until it completes
    const channelName = channel === CHANNEL_ANONYMOUS || channel === CHANNEL_NEW ? '' : channel;

    // We are only going to store the full uri, but we need to resolve the uri with and without the channel name
    let uri;
    try {
      uri = buildURI({ contentName: name, channelName });
    } catch (e) {
      // something wrong with channel or name
    }

    if (uri) {
      if (channelName) {
        // resolve without the channel name so we know the winning bid for it
        const uriLessChannel = buildURI({ contentName: name });
        resolveUri(uriLessChannel);
      }
      resolveUri(uri);
      return uri;
    }

    return '';
  }

  handleFileChange(filePath: string, fileName: string) {
    const { updatePublishForm, channel, name } = this.props;
    const newFileParams: UpdatePublishFormData = { filePath };

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
      updatePublishForm({ nameError: undefined });
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
    const form: UpdatePublishFormData = { channel: channelName };

    if (name) {
      form.uri = this.getNewUri(name, channelName);
    }
    updatePublishForm(form);
  }

  handleBidChange(bid: number) {
    const { balance, updatePublishForm, myClaimForUri } = this.props;

    let previousBidAmount = 0;
    if (myClaimForUri) {
      previousBidAmount = myClaimForUri.amount;
    }

    const totalAvailableBidAmount = previousBidAmount + balance;

    let bidError;
    if (bid === 0) {
      bidError = __('Deposit cannot be 0');
    } else if (totalAvailableBidAmount === bid) {
      bidError = __('Please decrease your deposit to account for transaction fees');
    } else if (totalAvailableBidAmount < bid) {
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
      licenseType,
      licenseUrl,
      otherLicenseDescription,
      myClaimForUri,
      publish,
    } = this.props;

    let publishingLicense;
    switch (licenseType) {
      case COPYRIGHT:
      case OTHER:
        publishingLicense = otherLicenseDescription;
        break;
      default:
        publishingLicense = licenseType;
    }

    const publishingLicenseUrl = licenseType === COPYRIGHT ? '' : licenseUrl;

    const publishParams: PublishParams = {
      filePath: filePath || undefined,
      bid: this.props.bid || undefined,
      title: this.props.title || '',
      thumbnail: this.props.thumbnail,
      description: this.props.description,
      language: this.props.language,
      nsfw: this.props.nsfw,
      license: publishingLicense,
      licenseUrl: publishingLicenseUrl,
      otherLicenseDescription,
      name: this.props.name || undefined,
      contentIsFree: this.props.contentIsFree,
      price: this.props.price,
      uri: this.props.uri || undefined,
      channel: this.props.channel,
      isStillEditing: this.props.isStillEditing,
    };

    // Editing a claim
    if (!filePath && myClaimForUri && myClaimForUri.value) {
      const { source } = myClaimForUri.value.stream;
      publishParams.sources = source;
    }

    publish(publishParams);
  }

  checkIsFormValid() {
    const {
      name,
      nameError,
      title,
      bid,
      bidError,
      tosAccepted,
      editingURI,
      isStillEditing,
      filePath,
      uploadThumbnailStatus,
    } = this.props;

    // If they are editing, they don't need a new file chosen
    const formValidLessFile =
      name &&
      !nameError &&
      title &&
      bid &&
      !bidError &&
      tosAccepted &&
      !(uploadThumbnailStatus === THUMBNAIL_STATUSES.IN_PROGRESS);
    return editingURI && !filePath ? isStillEditing && formValidLessFile : formValidLessFile;
  }

  renderFormErrors() {
    const {
      name,
      nameError,
      title,
      bid,
      bidError,
      tosAccepted,
      editingURI,
      filePath,
      isStillEditing,
      uploadThumbnailStatus,
    } = this.props;

    const isFormValid = this.checkIsFormValid();

    // These are extra help
    // If there is an error it will be presented as an inline error as well
    return (
      !isFormValid && (
        <div className="card__content card__subtitle form-field__error">
          {!title && <div>{__('A title is required')}</div>}
          {!name && <div>{__('A URL is required')}</div>}
          {name && nameError && <div>{__('The URL you created is not valid')}</div>}
          {!bid && <div>{__('A deposit amount is required')}</div>}
          {!!bid && bidError && <div>{bidError}</div>}
          {uploadThumbnailStatus === THUMBNAIL_STATUSES.IN_PROGRESS && (
            <div>{__('Please wait for thumbnail to finish uploading')}</div>
          )}
          {!tosAccepted && <div>{__('You must agree to the Terms of Service')}</div>}
          {!!editingURI &&
            !isStillEditing &&
            !filePath && <div>{__('You need to reselect a file after changing the LBRY URL')}</div>}
        </div>
      )
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
      uri,
      bidError,
      publishing,
      clearPublish,
      thumbnailPath,
      resetThumbnailStatus,
      isStillEditing,
      amountNeededForTakeover,
    } = this.props;

    const formDisabled = (!filePath && !editingURI) || publishing;
    const formValid = this.checkIsFormValid();

    let submitLabel;
    if (isStillEditing) {
      submitLabel = !publishing ? __('Edit') : __('Editing...');
    } else {
      submitLabel = !publishing ? __('Publish') : __('Publishing...');
    }

    const shortUri = buildURI({ contentName: name });

    return (
      <Form onSubmit={this.handlePublish}>
        <section className={classnames('card card--section', { 'card--disabled': publishing })}>
          <div className="card__title">{__('Content')}</div>
          <div className="card__subtitle">
            {isStillEditing ? __('Editing a claim') : __('What are you publishing?')}{' '}
            {__('Read our')}{' '}
            <Button button="link" label={__('FAQ')} href="https://lbry.io/faq/how-to-publish" />{' '}
            {__('to learn more.')}
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
          <div className="card__content">
            <FileSelector currentPath={filePath} onFileChosen={this.handleFileChange} />
            {!!isStillEditing &&
              name && (
                <p className="card__content card__subtitle">
                  {__("If you don't choose a file, the file from your existing claim")}
                  {` "${name}" `}
                  {__('will be used.')}
                </p>
              )}
          </div>
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
            <header className="card__header">
              <h2 className="card__title">{__('Thumbnail')}</h2>
              <p className="card__subtitle">
                {uploadThumbnailStatus === THUMBNAIL_STATUSES.API_DOWN ? (
                  __('Enter a URL for your thumbnail.')
                ) : (
                  <React.Fragment>
                    {__('Upload your thumbnail (.png/.jpg/.jpeg/.gif) to')}{' '}
                    <Button button="link" label={__('spee.ch')} href="https://spee.ch/about" />.{' '}
                    {__('Recommended size: 800x450 (16:9)')}
                  </React.Fragment>
                )}
              </p>
            </header>

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
            <header className="card__header">
              <h2 className="card__title">{__('Price')}</h2>
              <p className="card__subtitle">{__('How much will this content cost?')}</p>
            </header>

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
            <header className="card__header">
              <h2 className="card__title">{__('Anonymous or under a channel?')}</h2>
              <p className="card__subtitle">
                {__('This is a username or handle that your content can be found under.')}{' '}
                {__('Ex. @Marvel, @TheBeatles, @BooksByJoe')}
              </p>
            </header>

            <div className="card__content">
              <ChannelSection channel={channel} onChannelChange={this.handleChannelChange} />
            </div>
          </section>

          <section className="card card--section">
            <header className="card__header">
              <h2 className="card__title">{__('Where can people find this content?')}</h2>
              <p className="card__subtitle">
                {__(
                  'The LBRY URL is the exact address where people find your content (ex. lbry://myvideo).'
                )}{' '}
                <Button button="link" label={__('Learn more')} href="https://lbry.io/faq/naming" />
              </p>
            </header>

            <div className="card__content">
              <FormRow>
                <FormField
                  stretch
                  label={__('Name')}
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
                    <NameHelpText
                      isStillEditing={isStillEditing}
                      uri={uri}
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
                value={bid || ''}
                error={bidError}
                min="0"
                disabled={!name}
                onChange={event => this.handleBidChange(parseFloat(event.target.value))}
                placeholder={winningBidForClaimUri ? winningBidForClaimUri + 0.1 : 0.1}
                helper={
                  <BidHelpText
                    uri={shortUri}
                    isResolvingUri={isResolvingUri}
                    amountNeededForTakeover={amountNeededForTakeover}
                  />
                }
              />
            </div>
          </section>

          <section className="card card--section">
            <div className="card__content">
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
              />
            </div>
          </section>

          <section className="card card--section">
            <header className="card__header">
              <h2 className="card__title">{__('Terms of Service')}</h2>
            </header>

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
                      label={__('LBRY Terms of Service')}
                    />
                  </span>
                }
                onChange={event => updatePublishForm({ tosAccepted: event.target.checked })}
              />
            </div>
          </section>

          <section className="card card--section">
            <div className="card__content">
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
            </div>

            {!formDisabled && !formValid && this.renderFormErrors()}
          </section>
        </div>
      </Form>
    );
  }
}

export default PublishForm;
