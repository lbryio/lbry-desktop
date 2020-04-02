// @flow

/*
  On submit, this component calls publish, which dispatches doPublishDesktop.
  doPublishDesktop calls lbry-redux Lbry publish method using lbry-redux publish state as params.
  Publish simply instructs the SDK to find the file path on disk and publish it with the provided metadata.
  On web, the Lbry publish method call is overridden in platform/web/api-setup, using a function in platform/web/publish.
  File upload is carried out in the background by that function.
 */
import React, { useEffect } from 'react';
import { CHANNEL_NEW, CHANNEL_ANONYMOUS } from 'constants/claim';
import { buildURI, isURIValid, isNameValid, THUMBNAIL_STATUSES } from 'lbry-redux';
import Button from 'component/button';
import SelectChannel from 'component/selectChannel';
import classnames from 'classnames';
import TagsSelect from 'component/tagsSelect';
import PublishText from 'component/publishText';
import PublishPrice from 'component/publishPrice';
import PublishFile from 'component/publishFile';
import PublishName from 'component/publishName';
import PublishAdditionalOptions from 'component/publishAdditionalOptions';
import PublishFormErrors from 'component/publishFormErrors';
import SelectThumbnail from 'component/selectThumbnail';
import Card from 'component/common/card';

type Props = {
  disabled: boolean,
  tags: Array<Tag>,
  publish: (?string) => void,
  filePath: ?string,
  bid: ?number,
  bidError: ?string,
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
    bidError,
    uploadThumbnailStatus,
    resetThumbnailStatus,
    updatePublishForm,
    filePath,
    publishing,
    clearPublish,
    isStillEditing,
    tags,
    publish,
    disabled = false,
  } = props;
  const TAGS_LIMIT = 5;
  const formDisabled = (!filePath && !editingURI) || publishing;
  const isInProgress = filePath || editingURI || name || title;

  // If they are editing, they don't need a new file chosen
  const formValidLessFile =
    name &&
    isNameValid(name, false) &&
    title &&
    bid &&
    !bidError &&
    !(uploadThumbnailStatus === THUMBNAIL_STATUSES.IN_PROGRESS);
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
      uri = name && buildURI({ streamName: name, channelName });
    } catch (e) {}

    if (channelName && name) {
      // resolve without the channel name so we know the winning bid for it
      try {
        const uriLessChannel = buildURI({ streamName: name });
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
    <div className="card-stack">
      <PublishFile disabled={disabled || publishing} inProgress={isInProgress} />
      {!publishing && (
        <div className={classnames({ 'card--disabled': formDisabled })}>
          <PublishText disabled={formDisabled} />
          <Card actions={<SelectThumbnail />} />

          <TagsSelect
            suggestMature
            disableAutoFocus
            hideHeader
            label={__('Selected Tags')}
            empty={__('No tags added')}
            limitSelect={TAGS_LIMIT}
            help={__(
              'Add tags that are relevant to your content. If mature content, ensure it is tagged mature. Tag abuse and missing mature tags will not be tolerated.'
            )}
            placeholder={__('gaming, crypto')}
            onSelect={newTags => {
              const validatedTags = [];
              newTags.forEach(newTag => {
                if (!tags.some(tag => tag.name === newTag.name)) {
                  validatedTags.push(newTag);
                }
              });
              updatePublishForm({ tags: [...tags, ...validatedTags] });
            }}
            onRemove={clickedTag => {
              const newTags = tags.slice().filter(tag => tag.name !== clickedTag.name);
              updatePublishForm({ tags: newTags });
            }}
            tagsChosen={tags}
          />

          <Card
            actions={
              <React.Fragment>
                <SelectChannel channel={channel} onChannelChange={channel => updatePublishForm({ channel })} />
                <p className="help">
                  {__('This is a username or handle that your content can be found under.')}{' '}
                  {__('Ex. @Marvel, @TheBeatles, @BooksByJoe')}
                </p>
              </React.Fragment>
            }
          />

          <PublishName disabled={formDisabled} />
          <PublishPrice disabled={formDisabled} />
          <PublishAdditionalOptions disabled={formDisabled} />
        </div>
      )}
      <section>
        {!formDisabled && !formValid && <PublishFormErrors />}

        <div className="card__actions">
          <Button
            button="primary"
            onClick={() => publish(filePath)}
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
  );
}

export default PublishForm;
