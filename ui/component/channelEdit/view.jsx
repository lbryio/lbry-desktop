// @flow
import React, { useState } from 'react';
import { FormField } from 'component/common/form';
import Button from 'component/button';
import SelectAsset from 'component/selectAsset';
import * as PAGES from 'constants/pages';
import { MINIMUM_PUBLISH_BID } from 'constants/claim';
import TagsSearch from 'component/tagsSearch';

type Props = {
  claim: ChannelClaim,
  title: ?string,
  amount: string,
  coverUrl: ?string,
  thumbnailUrl: ?string,
  location: { search: string },
  description: string,
  website: string,
  email: string,
  balance: number,
  tags: Array<string>,
  locations: Array<string>,
  languages: Array<string>,
  updateChannel: any => void,
  updateThumb: string => void,
  updateCover: string => void,
  setEditing: boolean => void,
};

function ChannelForm(props: Props) {
  const {
    claim,
    title,
    coverUrl,
    description,
    website,
    email,
    thumbnailUrl,
    tags,
    locations,
    languages,
    amount,
    setEditing,
    updateChannel,
    updateThumb,
    updateCover,
  } = props;
  const { claim_id: claimId } = claim;

  // fill this in with sdk data
  const channelParams = {
    website,
    email,
    coverUrl,
    thumbnailUrl,
    description,
    title,
    amount,
    claim_id: claimId,
    languages: languages || [],
    locations: locations || [],
    tags: tags
      ? tags.map(tag => {
          return { name: tag };
        })
      : [],
  };

  const [params, setParams] = useState(channelParams);
  const [bidError, setBidError] = useState('');

  // If a user changes tabs, update the url so it stays on the same page if they refresh.
  // We don't want to use links here because we can't animate the tab change and using links
  // would alter the Tab label's role attribute, which should stay role="tab" to work with keyboards/screen readers.

  const handleBidChange = (bid: number) => {
    const { balance, amount } = props;
    const totalAvailableBidAmount = parseFloat(amount) + parseFloat(balance);
    setParams({ ...params, amount: bid });
    setBidError('');
    if (bid <= 0.0 || isNaN(bid)) {
      setBidError(__('Deposit cannot be 0'));
    } else if (totalAvailableBidAmount === bid) {
      setBidError(__('Please decrease your deposit to account for transaction fees'));
    } else if (totalAvailableBidAmount < bid) {
      setBidError(__('Deposit cannot be higher than your balance'));
    } else if (bid < MINIMUM_PUBLISH_BID) {
      setBidError(__('Your deposit must be higher'));
    }
  };

  const handleThumbnailChange = (thumbnailUrl: string) => {
    setParams({ ...params, thumbnailUrl });
    updateThumb(thumbnailUrl);
  };

  const handleCoverChange = (coverUrl: string) => {
    setParams({ ...params, coverUrl });
    updateCover(coverUrl);
  };

  const handleSubmit = () => {
    updateChannel(params);
    setEditing(false);
  };
  // TODO clear and bail after submit
  return (
    <section className={'card--section'}>
      <SelectAsset
        onUpdate={v => handleThumbnailChange(v)}
        currentValue={params.thumbnailUrl}
        assetName={'Thumbnail'}
        recommended={__('Recommended ratio is 1:1')}
      />

      <SelectAsset
        onUpdate={v => handleCoverChange(v)}
        currentValue={params.coverUrl}
        assetName={'Cover'}
        recommended={__('Recommended ratio is 6.25:1')}
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
      />

      <TagsSearch
        suggestMature
        disabledAutoFocus
        tagsPassedIn={params.tags || []}
        label={__('Tags Selected')}
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
      <div className={'card__actions'}>
        <Button button="primary" label={__('Submit')} onClick={handleSubmit} />
        <Button button="link" label={__('Cancel')} navigate={`$/${PAGES.CHANNELS}`} />
      </div>
      <p className="help">
        {__('After submitting, you will not see the changes immediately. Please check back in a few minutes.')}
      </p>
    </section>
  );
}

export default ChannelForm;
