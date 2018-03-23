// @flow
import * as React from 'react';
import lbry from 'lbry';
import { isNameValid, buildURI, regexInvalidURI } from 'lbryURI';
import { Form, FormField, FormRow, FormFieldPrice, Submit } from 'component/common/form';
import Button from 'component/button';
import Modal from 'modal/modal';
import BusyIndicator from 'component/common/busy-indicator';
import ChannelSection from 'component/selectChannel';
import Icon from 'component/common/icon';
import classnames from 'classnames';
import path from 'path';
import type { PublishParams, UpdatePublishFormData } from 'redux/actions/publish';
import FileSelector from 'component/common/file-selector';
import BidHelpText from './internal/bid-help-text';
import LicenseType from './internal/license-type';
import { COPYRIGHT, OTHER } from 'constants/licenses';
import { MINIMUM_PUBLISH_BID } from 'constants/claim';
import { CHANNEL_NEW, CHANNEL_ANONYMOUS } from 'constants/claim';
import * as icons from 'constants/icons';

type Props = {
  publish: PublishParams => void,
  filePath: ?string,
  bid: ?number,
  editing: ?string,
  prefillClaim: {
    name?: string,
  },
  title: ?string,
  thumbnail: ?string,
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
  myClaimForUri: ?{
    amount: number,
  },
  licenseType: string,
  otherLicenseDescription: ?string,
  licenseUrl: ?string,
  copyrightNotice: ?string,
  uri: ?string,
  bidError: ?string,
  publishing: boolean,
  balance: number,
  clearError: () => void,
  clearPublish: () => void,
  clearFilePath: () => void,
  resolveUri: string => void,
  scrollToTop: () => void,
  prepareEdit: ({}) => void,
};

class PublishForm extends React.PureComponent<Props> {
  static defaultProps = {
    prefillClaim: {},
  };

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
    (this: any).getSubmitLabel = this.getSubmitLabel.bind(this);
  }

  handlePublish() {
    const {
      publish,
      filePath,
      bid,
      title,
      thumbnail,
      description,
      language,
      nsfw,
      channel,
      licenseType,
      licenseUrl,
      otherLicenseDescription,
      copyrightNotice,
      name,
      contentIsFree,
      price,
      uri,
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

    let publishingLicenseUrl = licenseType === COPYRIGHT ? '' : licenseUrl;

    const publishParams = {
      filePath,
      bid,
      title,
      thumbnail,
      description,
      language,
      nsfw,
      channel,
      license: publishingLicense,
      licenseUrl: publishingLicenseUrl,
      otherLicenseDescription,
      copyrightNotice,
      name,
      contentIsFree,
      price,
      uri,
    };

    publish(publishParams);
  }

  handleCancelPublish() {
    const { clearPublish, scrollToTop } = this.props;
    scrollToTop();
    clearPublish();
  }

  editExistingClaim() {
    const { myClaimForUri, prepareEdit, scrollToTop } = this.props;
    if (myClaimForUri) {
      prepareEdit(myClaimForUri);
      scrollToTop();
    }
  }

  handleFileChange(filePath: string, fileName: string) {
    const { updatePublishForm, clearFilePath, channel } = this.props;
    const parsedFileName = fileName.replace(regexInvalidURI, '');
    const uri = this.getNewUri(parsedFileName, channel);

    if (filePath) {
      updatePublishForm({ filePath, name: parsedFileName, uri });
      return;
    }
  }

  handleNameChange(name: ?string) {
    const { channel, updatePublishForm, resolveUri } = this.props;

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
    const { name, updatePublishForm, resolveUri } = this.props;
    if (name) {
      const uri = this.getNewUri(name, channelName);
      updatePublishForm({ channel: channelName, uri });
    } else {
      updatePublishForm({ channel: channelName });
    }
  }

  handleBidChange(bid: number) {
    const { balance, updatePublishForm } = this.props;

    let bidError;
    if (balance <= bid) {
      bidError = __('Not enough credits');
    } else if (bid <= MINIMUM_PUBLISH_BID) {
      bidError = __('Your bid must be higher');
    }

    updatePublishForm({ bid, bidError });
  }

  // Returns a new uri to be used in the form and begins to resolve that uri for bid help text
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

  getSubmitLabel() {
    const { editing, publishing }  = this.props;
    if (editing) {
      return !publishing ?  __('Edit') : __('Editing...');
    }

    return !publishing ? __('Publish') : __('Publishing...');
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
      editing,
      prefillClaim,
      title,
      thumbnail,
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
    } = this.props;

    const formDisabled = (!filePath && !editing) || publishing;
    const formValid = this.checkIsFormValid();

    return (
      <Form onSubmit={this.handlePublish}>
        <section className={classnames('card card--section')}>
          <div className="card__title">{__('Content')}</div>
          <div className="card__subtitle">
            {editing ? __('Editing a claim') : __('What are you publishing?')}
          </div>
          {(filePath || !!editing) && (
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
          {!!editing && (
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
                type="text"
                name="content_thumbnail"
                label={__('Thumbnail')}
                placeholder="http://spee.ch/mylogo"
                value={thumbnail}
                disabled={formDisabled}
                onChange={e => updatePublishForm({ thumbnail: e.target.value })}
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

              <FormFieldPrice
                name="content_cost_amount"
                min="0"
                price={price}
                onChange={newPrice => updatePublishForm({ price: newPrice })}
                disabled={formDisabled || contentIsFree}
              />
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
                    channel === CHANNEL_ANONYMOUS || channel === CHANNEL_NEW ? '' : `${channel}/`
                  }`}
                  type="text"
                  name="content_name"
                  placeholder="myname"
                  value={name}
                  onChange={event => this.handleNameChange(event.target.value)}
                  error={nameError}
                  helper={
                    <BidHelpText
                      uri={uri}
                      name={name}
                      isResolvingUri={isResolvingUri}
                      winningBidForClaimUri={winningBidForClaimUri}
                      claimIsMine={!!myClaimForUri}
                      claimBeingEdited={editing}
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
              handleLicenseChange={( newLicenseType, newLicenseUrl) =>
                updatePublishForm({
                  licenseType: newLicenseType,
                  licenseUrl: newLicenseUrl
                })
              }
              handleLicenseDescriptionChange={event =>
                updatePublishForm({
                  otherLicenseDescription: event.target.value
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
              label={this.getSubmitLabel()}
              disabled={formDisabled || !formValid || publishing}
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
