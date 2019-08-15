// @flow
import React, { useState } from 'react';
import { Form, FormField } from 'component/common/form';
import Button from 'component/button';
import SelectAsset from 'component/selectAsset';
import TagSelect from 'component/tagsSelect';

type Props = {
  claim: ChannelClaim,
  title: ?string,
  amount: string,
  cover: ?string,
  thumbnail: ?string,
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
    cover,
    description,
    website,
    email,
    thumbnail,
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
    website: website,
    email: email,
    languages: languages || [],
    cover: cover,
    description: description,
    locations: locations || [],
    title: title,
    thumbnail: thumbnail,
    tags: tags
      ? tags.map(tag => {
          return { name: tag };
        })
      : [],
    claim_id: claimId,
    amount: amount,
  };

  const [params, setParams] = useState(channelParams);
  const [bidError, setBidError] = useState('');

  const MINIMUM_PUBLISH_BID = 0.00000001;
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
    } else if (bid <= MINIMUM_PUBLISH_BID) {
      setBidError(__('Your deposit must be higher'));
    }
  };

  const handleThumbnailChange = (url: string) => {
    setParams({ ...params, thumbnail: url });
    updateThumb(url);
  };

  const handleCoverChange = (url: string) => {
    setParams({ ...params, cover: url });
    updateCover(url);
  };
  // TODO clear and bail after submit
  return (
    <section className={'card--section'}>
      <div className="card__subtitle">
        <p>{__('We can explain...')}</p>
        <p>
          {__(
            "We know this page won't win any design awards, we just wanted to release a very basic version that works so people can use it right now. There is a much nicer version being worked on."
          )}
        </p>
      </div>
      <Form onSubmit={channelParams => updateChannel(channelParams)}>
        <SelectAsset
          onUpdate={v => handleThumbnailChange(v)}
          currentValue={params.thumbnail}
          assetName={'Thumbnail'}
          recommended={'(300 x 300)'}
        />

        <SelectAsset
          onUpdate={v => handleCoverChange(v)}
          currentValue={params.cover}
          assetName={'Cover'}
          recommended={'(1000 x 160)'}
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
        <TagSelect
          title={false}
          suggestMature
          help={__('The better your tags are, the easier it will be for people to discover your channel.')}
          empty={__('No tags added')}
          onSelect={newTag => {
            if (!params.tags.map(savedTag => savedTag.name).includes(newTag.name)) {
              setParams({ ...params, tags: [...params.tags, newTag] });
            } else {
              // If it already exists and the user types it in, remove it
              setParams({ ...params, tags: params.tags.filter(tag => tag.name !== newTag.name) });
            }
          }}
          onRemove={clickedTag => {
            const newTags = params.tags.slice().filter(tag => tag.name !== clickedTag.name);
            setParams({ ...params, tags: newTags });
          }}
          tagsChosen={params.tags || []}
        />
        <div className={'card__actions'}>
          <Button
            button="primary"
            label={__('Submit')}
            onClick={() => {
              updateChannel(params);
              setEditing(false);
            }}
          />
          <Button
            button="link"
            label={__('Cancel')}
            onClick={() => {
              setParams({ ...channelParams });
              setEditing(false);
            }}
          />
        </div>
      </Form>
    </section>
  );
}

export default ChannelForm;
