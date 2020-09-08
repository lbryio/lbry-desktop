// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import TagsSearch from 'component/tagsSearch';
import { FF_MAX_CHARS_IN_DESCRIPTION } from 'constants/form-field';
import ErrorText from 'component/common/error-text';
import ChannelThumbnail from 'component/channelThumbnail';
import { isNameValid, parseURI } from 'lbry-redux';
import ClaimAbandonButton from 'component/claimAbandonButton';
import { useHistory } from 'react-router-dom';
import { MINIMUM_PUBLISH_BID, INVALID_NAME_ERROR, ESTIMATED_FEE } from 'constants/claim';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'component/common/tabs';
import Card from 'component/common/card';
import * as PAGES from 'constants/pages';
import analytics from 'analytics';
const MAX_TAG_SELECT = 5;

type Props = {
  claim: ChannelClaim,
  title: string,
  amount: number,
  coverUrl: string,
  thumbnailUrl: string,
  location: { search: string },
  description: string,
  website: string,
  email: string,
  balance: number,
  tags: Array<string>,
  locations: Array<string>,
  languages: Array<string>,
  updateChannel: any => Promise<any>,
  updatingChannel: boolean,
  updateError: string,
  createChannel: any => Promise<any>,
  createError: string,
  creatingChannel: boolean,
  clearChannelErrors: () => void,
  onDone: () => void,
  openModal: (
    id: string,
    { onUpdate: string => void, assetName: string, helpText: string, currentValue: string, title: string }
  ) => void,
  uri: string,
};

function ChannelForm(props: Props) {
  const {
    uri,
    claim,
    amount,
    title,
    description,
    website,
    email,
    thumbnailUrl,
    coverUrl,
    tags,
    locations,
    languages,
    onDone,
    updateChannel,
    updateError,
    updatingChannel,
    createChannel,
    creatingChannel,
    createError,
    clearChannelErrors,
    openModal,
    disabled,
  } = props;
  const [nameError, setNameError] = React.useState(undefined);
  const [bidError, setBidError] = React.useState('');
  const { claim_id: claimId } = claim || {};
  const [params, setParams]: [any, (any) => void] = React.useState(getChannelParams());
  const { channelName } = parseURI(uri);
  const name = params.name;
  const isNewChannel = !uri;
  const { replace } = useHistory();

  function getChannelParams() {
    // fill this in with sdk data
    const channelParams: {
      website: string,
      email: string,
      coverUrl: string,
      thumbnailUrl: string,
      description: string,
      title: string,
      amount: number,
      languages: ?Array<string>,
      locations: ?Array<string>,
      tags: ?Array<{ name: string }>,
      claim_id?: string,
    } = {
      website,
      email,
      coverUrl,
      thumbnailUrl,
      description,
      title,
      amount: amount || 0.001,
      languages: languages || [],
      locations: locations || [],
      tags: tags
        ? tags.map(tag => {
            return { name: tag };
          })
        : [],
    };

    if (claimId) {
      channelParams['claim_id'] = claimId;
    }

    return channelParams;
  }

  function handleBidChange(bid: number) {
    const { balance, amount } = props;
    const totalAvailableBidAmount = (parseFloat(amount) || 0.0) + (parseFloat(balance) || 0.0);

    setParams({ ...params, amount: bid });

    if (bid <= 0.0 || isNaN(bid)) {
      setBidError(__('Deposit cannot be 0'));
    } else if (totalAvailableBidAmount < bid) {
      setBidError(__('Deposit cannot be higher than your balance'));
    } else if (totalAvailableBidAmount - bid < ESTIMATED_FEE) {
      setBidError(__('Please decrease your deposit to account for transaction fees'));
    } else if (bid < MINIMUM_PUBLISH_BID) {
      setBidError(__('Your deposit must be higher'));
    } else {
      setBidError('');
    }
  }

  function handleThumbnailChange(thumbnailUrl: string) {
    setParams({ ...params, thumbnailUrl });
  }

  function handleCoverChange(coverUrl: string) {
    setParams({ ...params, coverUrl });
  }

  function handleSubmit() {
    if (uri) {
      updateChannel(params).then(success => {
        if (success) {
          onDone();
        }
      });
    } else {
      createChannel(params).then(success => {
        if (success) {
          analytics.apiLogPublish(success);
          onDone();
        }
      });
    }
  }

  React.useEffect(() => {
    let nameError;
    if (!name && name !== undefined) {
      nameError = __('A name is required for your url');
    } else if (!isNameValid(name, false)) {
      nameError = INVALID_NAME_ERROR;
    }

    setNameError(nameError);
  }, [name]);

  React.useEffect(() => {
    clearChannelErrors();
  }, [clearChannelErrors]);

  // TODO clear and bail after submit
  return (
    <>
      <div className={classnames('main--contained', { 'card--disabled': disabled })}>
        <header className="channel-cover">
          <div className="channel__quick-actions">
            <Button
              button="alt"
              title={__('Cover')}
              onClick={() =>
                openModal(MODALS.IMAGE_UPLOAD, {
                  onUpdate: coverUrl => handleCoverChange(coverUrl),
                  title: __('Edit Cover Image'),
                  helpText: __('(6.25:1)'),
                  assetName: __('Cover Image'),
                  currentValue: params.coverUrl,
                })
              }
              icon={ICONS.CAMERA}
              iconSize={18}
            />
          </div>
          {params.coverUrl && <img className="channel-cover__custom" src={params.coverUrl} />}
          <div className="channel__primary-info">
            <div className="channel__edit-thumb">
              <Button
                button="alt"
                title={__('Edit')}
                onClick={() =>
                  openModal(MODALS.IMAGE_UPLOAD, {
                    onUpdate: v => handleThumbnailChange(v),
                    title: __('Edit Thumbnail Image'),
                    helpText: __('(1:1)'),
                    assetName: __('Thumbnail'),
                    currentValue: params.thumbnailUrl,
                  })
                }
                icon={ICONS.CAMERA}
                iconSize={18}
              />
            </div>
            <ChannelThumbnail
              className="channel__thumbnail--channel-page"
              uri={uri}
              thumbnailPreview={params.thumbnailUrl}
              allowGifs
            />
            <h1 className="channel__title">
              {params.title || (channelName && '@' + channelName) || (params.name && '@' + params.name)}
            </h1>
          </div>
          <div className="channel-cover__gradient" />
        </header>

        <Tabs>
          <TabList className="tabs__list--channel-page">
            <Tab>{__('General')}</Tab>
            <Tab>{__('LBC Details')}</Tab>
            <Tab>{__('Tags')}</Tab>
            <Tab>{__('Other')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Card
                body={
                  <>
                    <fieldset-group class="fieldset-group--smushed fieldset-group--disabled-prefix">
                      <fieldset-section>
                        <label htmlFor="channel_name">{__('Name')}</label>
                        <div className="form-field__prefix">@</div>
                      </fieldset-section>

                      <FormField
                        autoFocus={isNewChannel}
                        type="text"
                        name="channel_name"
                        placeholder={__('MyAwesomeChannel')}
                        value={params.name || channelName}
                        error={nameError}
                        disabled={!isNewChannel}
                        onChange={e => setParams({ ...params, name: e.target.value })}
                      />
                    </fieldset-group>
                    {!isNewChannel && <span className="form-field__help">{__('This field cannot be changed.')}</span>}

                    <FormField
                      type="text"
                      name="channel_title2"
                      label={__('Title')}
                      placeholder={__('My Awesome Channel')}
                      value={params.title}
                      onChange={e => setParams({ ...params, title: e.target.value })}
                    />
                    <FormField
                      type="markdown"
                      name="content_description2"
                      label={__('Description')}
                      placeholder={__('Description of your content')}
                      value={params.description}
                      onChange={text => setParams({ ...params, description: text })}
                      textAreaMaxLength={FF_MAX_CHARS_IN_DESCRIPTION}
                    />
                  </>
                }
              />
            </TabPanel>
            <TabPanel>
              <Card
                body={
                  <FormField
                    className="form-field--price-amount"
                    type="number"
                    name="content_bid2"
                    step="any"
                    label={__('Deposit (LBC)')}
                    postfix="LBC"
                    value={params.amount}
                    error={bidError}
                    min="0.0"
                    disabled={false}
                    onChange={event => handleBidChange(parseFloat(event.target.value))}
                    placeholder={0.1}
                    helper={__('Increasing your deposit can help your channel be discovered more easily.')}
                  />
                }
              />
            </TabPanel>
            <TabPanel>
              <Card
                body={
                  <TagsSearch
                    suggestMature
                    disableAutoFocus
                    limitSelect={MAX_TAG_SELECT}
                    tagsPassedIn={params.tags || []}
                    label={__('Selected Tags')}
                    onRemove={clickedTag => {
                      const newTags = params.tags.slice().filter(tag => tag.name !== clickedTag.name);
                      setParams({ ...params, tags: newTags });
                    }}
                    onSelect={newTags => {
                      newTags.forEach(newTag => {
                        if (!params.tags.map(savedTag => savedTag.name).includes(newTag.name)) {
                          setParams({ ...params, tags: [...params.tags, newTag] });
                        } else {
                          // If it already exists and the user types it in, remove it
                          setParams({ ...params, tags: params.tags.filter(tag => tag.name !== newTag.name) });
                        }
                      });
                    }}
                  />
                }
              />
            </TabPanel>
            <TabPanel>
              <Card
                body={
                  <>
                    <FormField
                      type="text"
                      name="channel_website2"
                      label={__('Website')}
                      placeholder={__('aprettygoodsite.com')}
                      disabled={false}
                      value={params.website}
                      onChange={e => setParams({ ...params, website: e.target.value })}
                    />
                    <FormField
                      type="text"
                      name="content_email2"
                      label={__('Email')}
                      placeholder={__('yourstruly@example.com')}
                      disabled={false}
                      value={params.email}
                      onChange={e => setParams({ ...params, email: e.target.value })}
                    />
                  </>
                }
              />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Card
          className="card--after-tabs"
          actions={
            <>
              <div className="section__actions">
                <Button
                  button="primary"
                  disabled={
                    creatingChannel || updatingChannel || nameError || bidError || (isNewChannel && !params.name)
                  }
                  label={creatingChannel || updatingChannel ? __('Submitting') : __('Submit')}
                  onClick={handleSubmit}
                />
                <Button button="link" label={__('Cancel')} onClick={onDone} />
              </div>
              {updateError || createError ? (
                <ErrorText>{updateError || createError}</ErrorText>
              ) : (
                <p className="help">
                  {__('After submitting, it will take a few minutes for your changes to be live for everyone.')}
                </p>
              )}
              {!isNewChannel && (
                <div className="section__actions">
                  <ClaimAbandonButton uri={uri} abandonActionCallback={() => replace(`/$/${PAGES.CHANNELS}`)} />
                </div>
              )}
            </>
          }
        />
      </div>
    </>
  );
}

export default ChannelForm;
