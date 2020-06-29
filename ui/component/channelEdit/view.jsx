// @flow
import React, { useState, useEffect } from 'react';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import TagsSearch from 'component/tagsSearch';
import { FF_MAX_CHARS_IN_DESCRIPTION } from 'constants/form-field';
import ErrorText from 'component/common/error-text';
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import ChannelThumbnail from 'component/channelThumbnail';
import { isNameValid, parseURI } from 'lbry-redux';
import ClaimAbandonButton from 'component/claimAbandonButton';
import { MINIMUM_PUBLISH_BID, INVALID_NAME_ERROR, ESTIMATED_FEE } from 'constants/claim';

type Props = {
  claim: ChannelClaim,
  title: string,
  amount: string,
  cover: string,
  thumbnail: string,
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
  onDone: () => void,
  openModal: (id: string, { onUpdate: string => void, label: string, helptext: string, currentValue: string }) => void,
  uri: string,
};

function ChannelForm(props: Props) {
  const {
    uri,
    claim,
    title,
    description,
    website,
    email,
    thumbnail,
    cover,
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
    openModal,
  } = props;
  const { claim_id: claimId } = claim || {};
  // fill this in with sdk data
  const channelParams = {
    website,
    email,
    cover,
    thumbnail,
    description,
    title,
    amount: 0.001,
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

  const { channelName } = parseURI(uri);
  const [params, setParams]: [any, (any) => void] = useState(channelParams);
  const [nameError, setNameError] = useState(undefined);
  const [bidError, setBidError] = useState('');

  const name = params.name;

  useEffect(() => {
    let nameError;
    if (!name && name !== undefined) {
      nameError = __('A name is required for your url');
    } else if (!isNameValid(name, false)) {
      nameError = INVALID_NAME_ERROR;
    }

    setNameError(nameError);
  }, [name]);
  // If a user changes tabs, update the url so it stays on the same page if they refresh.
  // We don't want to use links here because we can't animate the tab change and using links
  // would alter the Tab label's role attribute, which should stay role="tab" to work with keyboards/screen readers.

  const handleBidChange = (bid: number) => {
    const { balance, amount } = props;
    const totalAvailableBidAmount = parseFloat(amount) || 0.0 + parseFloat(balance) || 0.0;
    setParams({ ...params, amount: bid });

    if (bid <= 0.0 || isNaN(bid)) {
      setBidError(__('Deposit cannot be 0'));
    } else if (totalAvailableBidAmount - bid < ESTIMATED_FEE) {
      setBidError(__('Please decrease your deposit to account for transaction fees'));
    } else if (totalAvailableBidAmount < bid) {
      setBidError(__('Deposit cannot be higher than your balance'));
    } else if (bid < MINIMUM_PUBLISH_BID) {
      setBidError(__('Your deposit must be higher'));
    } else {
      setBidError('');
    }
  };

  const handleThumbnailChange = (thumbnailUrl: string) => {
    setParams({ ...params, thumbnail: thumbnailUrl });
  };

  const handleCoverChange = (coverUrl: string) => {
    setParams({ ...params, cover: coverUrl });
  };

  const handleSubmit = () => {
    if (uri) {
      updateChannel(params).then(success => {
        if (success) {
          onDone();
        }
      });
    } else {
      createChannel(params).then(success => {
        if (success) {
          onDone();
        }
      });
    }
  };

  // TODO clear and bail after submit
  return (
    <>
      <div className="main--contained">
        <header className="channel-cover--edit">
          <span className={'channel__uri-preview'}>{uri || `lbry://@${params.name || '...'}`}</span>
          {uri && (
            <div className="channel__quick-actions">
              <ClaimAbandonButton uri={uri} />
            </div>
          )}
          <div className="channel__edit-cover">
            <Button
              button="alt"
              title={__('Cover')}
              onClick={() =>
                openModal(MODALS.IMAGE_UPLOAD, {
                  onUpdate: v => handleCoverChange(v),
                  label: 'Cover',
                  helptext: 'This shoul de such a size',
                  currentValue: params.cover,
                })
              }
              icon={ICONS.CAMERA}
              iconSize={18}
            />
          </div>
          {params.cover && <img className="channel-cover__custom" src={params.cover} />}
          <div className="channel__primary-info">
            <div className="channel__edit-thumb">
              <Button
                button="alt"
                title={__('Edit')}
                onClick={() =>
                  openModal(MODALS.IMAGE_UPLOAD, {
                    onUpdate: v => handleThumbnailChange(v),
                    label: 'Thumbnail',
                    helptext: 'This shoul de such a size',
                    currentValue: params.thumbnail,
                  })
                }
                icon={ICONS.CAMERA}
                iconSize={18}
              />
            </div>
            <ChannelThumbnail
              className="channel__thumbnail--channel-page"
              uri={uri}
              thumbnailPreview={params.thumbnail}
              allowGifs
            />
            <h1 className="channel__title">
              {params.title || (channelName && '@' + channelName) || (params.name && '@' + params.name)}
            </h1>
          </div>
          <div className="channel-cover__gradient" />
        </header>
        <div className="card">
          <section className={'section card--section'}>
            {!uri && (
              <FormField
                type="text"
                name="channel_name"
                label={__('Name')}
                placeholder={__('required')}
                disabled={false}
                value={params.name}
                error={nameError}
                onChange={e => setParams({ ...params, name: e.target.value })}
              />
            )}

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
            />
            <FormField
              type="text"
              name="channel_title2"
              label={__('Title')}
              placeholder={__('Titular Title')}
              disabled={false}
              value={params.title}
              onChange={e => setParams({ ...params, title: e.target.value })}
            />

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

            <FormField
              type="markdown"
              name="content_description2"
              label={__('Description')}
              placeholder={__('Description of your content')}
              value={params.description}
              disabled={false}
              onChange={text => setParams({ ...params, description: text })}
              textAreaMaxLength={FF_MAX_CHARS_IN_DESCRIPTION}
            />
            <label>{__('Tags')}</label>
            <div className="tags__border">
              <TagsSearch
                suggestMature
                disableAutoFocus
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
            </div>
            <div className={'section__actions'}>
              <Button
                button="primary"
                label={creatingChannel || updatingChannel ? __('Submitting') : __('Submit')}
                onClick={handleSubmit}
              />
              <Button button="link" label={__('Cancel')} onClick={onDone} />
            </div>
            {updateError || createError ? (
              <ErrorText>{updateError || createError}</ErrorText>
            ) : (
              <p className="help">
                {__('After submitting, you will not see the changes immediately. Please check back in a few minutes.')}
              </p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default ChannelForm;
