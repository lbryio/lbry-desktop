// @flow
import React, { useEffect, Fragment } from 'react';
import { CHANNEL_NEW, CHANNEL_ANONYMOUS } from 'constants/claim';
import { buildURI, isURIValid, isNameValid, THUMBNAIL_STATUSES } from 'lbry-redux';
import Button from 'component/button';
import ChannelSection from 'component/selectChannel';
import classnames from 'classnames';
import UnsupportedOnWeb from 'component/common/unsupported-on-web';
import TagSelect from 'component/tagsSelect';
import PublishText from 'component/publishText';
import PublishPrice from 'component/publishPrice';
import PublishFile from 'component/publishFile';
import PublishName from 'component/publishName';
import PublishAdditionalOptions from 'component/publishAdditionalOptions';
import PublishFormErrors from 'component/publishFormErrors';
import SelectThumbnail from 'component/selectThumbnail';

type Props = {
  tags: Array<Tag>,
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
  fee: {
    amount: string,
    currency: string,
  },
  channel: string,
  name: ?string,
  nameError: ?string,
  isResolvingUri: boolean,
  winningBidForClaimUri: number,
  myClaimForUri: ?StreamClaim,
  licenseType: string,
  otherLicenseDescription: ?string,
  licenseUrl: ?string,
  uri: ?string,
  publishing: boolean,
  balance: number,
  isStillEditing: boolean,
  clearPublish: () => void,
  resolveUri: string => void,
  scrollToTop: () => void,
  prepareEdit: (claim: any, uri: string) => void,
  resetThumbnailStatus: () => void,
  amountNeededForTakeover: ?number,
  // Add back type
  updatePublishForm: any => void,
};

function PublishForm(props: Props) {
  const {
    thumbnail,
    name,
    channel,
    editingURI,
    resolveUri,
    title,
    bid,
    uploadThumbnailStatus,
    resetThumbnailStatus,
    updatePublishForm,
    filePath,
    publishing,
    clearPublish,
    isStillEditing,
    tags,
    publish,
  } = props;
  const formDisabled = (!filePath && !editingURI) || publishing;
  // If they are editing, they don't need a new file chosen
  const formValidLessFile =
    name && isNameValid(name, false) && title && bid && !(uploadThumbnailStatus === THUMBNAIL_STATUSES.IN_PROGRESS);
  const formValid = editingURI && !filePath ? isStillEditing && formValidLessFile : formValidLessFile;

  let submitLabel;
  if (isStillEditing) {
    submitLabel = !publishing ? __('Edit') : __('Editing...');
  } else {
    submitLabel = !publishing ? __('Publish') : __('Publishing...');
  }

  useEffect(() => {
    if (!thumbnail) {
      resetThumbnailStatus();
    }
  }, [thumbnail, resetThumbnailStatus]);

  // Every time the channel or name changes, resolve the uris to find winning bid amounts
  useEffect(() => {
    // If they are midway through a channel creation, treat it as anonymous until it completes
    const channelName = channel === CHANNEL_ANONYMOUS || channel === CHANNEL_NEW ? '' : channel;

    // We are only going to store the full uri, but we need to resolve the uri with and without the channel name
    let uri;
    try {
      uri = buildURI({ contentName: name, channelName });
    } catch (e) {}

    if (channelName) {
      // resolve without the channel name so we know the winning bid for it
      try {
        const uriLessChannel = buildURI({ contentName: name });
        resolveUri(uriLessChannel);
      } catch (e) {}
    }

    const isValid = isURIValid(uri);
    if (uri && isValid) {
      resolveUri(uri);
      updatePublishForm({ uri });
    }
  }, [name, channel, resolveUri, updatePublishForm]);

  return (
    <Fragment>
      <UnsupportedOnWeb />

      <PublishFile />
      <div className={classnames({ 'card--disabled': formDisabled })}>
        <PublishText disabled={formDisabled} />
        <div className="card card--section">
          {/* This should probably be PublishThumbnail */}
          <SelectThumbnail />
        </div>
        <div className="card card--section">
          <TagSelect
            title={false}
            suggestMature
            help={__('The better your tags are, the easier it will be for people to discover your content.')}
            empty={__('No tags added')}
            onSelect={newTag => {
              if (!tags.map(savedTag => savedTag.name).includes(newTag.name)) {
                updatePublishForm({ tags: [...tags, newTag] });
              } else {
                // If it already exists and the user types it in, remove it
                updatePublishForm({ tags: tags.filter(tag => tag.name !== newTag.name) });
              }
            }}
            onRemove={clickedTag => {
              const newTags = tags.slice().filter(tag => tag.name !== clickedTag.name);
              updatePublishForm({ tags: newTags });
            }}
            tagsChosen={tags}
          />
        </div>
        <section className="card card--section">
          <ChannelSection channel={channel} onChannelChange={channel => updatePublishForm({ channel })} />
          <p className="help">
            {__('This is a username or handle that your content can be found under.')}{' '}
            {__('Ex. @Marvel, @TheBeatles, @BooksByJoe')}
          </p>
        </section>

        <PublishName disabled={formDisabled} />
        <PublishPrice disabled={formDisabled} />
        <PublishAdditionalOptions disabled={formDisabled} />

        <section>
          {!formDisabled && !formValid && <PublishFormErrors />}

          <div className="card__actions">
            <Button
              button="primary"
              onClick={publish}
              label={submitLabel}
              disabled={formDisabled || !formValid || uploadThumbnailStatus === THUMBNAIL_STATUSES.IN_PROGRESS}
            />
            <Button button="link" onClick={clearPublish} label={__('Cancel')} />
          </div>
          <p className="help">
            {__('By continuing, you accept the')}{' '}
            <Button button="link" href="https://www.lbry.com/termsofservice" label={__('LBRY Terms of Service')} />.
          </p>
        </section>
      </div>
    </Fragment>
  );
}

export default PublishForm;
