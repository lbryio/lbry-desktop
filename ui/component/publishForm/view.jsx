// @flow

/*
  On submit, this component calls publish, which dispatches doPublishDesktop.
  doPublishDesktop calls lbry-redux Lbry publish method using lbry-redux publish state as params.
  Publish simply instructs the SDK to find the file path on disk and publish it with the provided metadata.
  On web, the Lbry publish method call is overridden in platform/web/api-setup, using a function in platform/web/publish.
  File upload is carried out in the background by that function.
 */

import { LIVE_STREAM_CHANNEL, LIVE_STREAM_CHANNEL_CLAIM_ID } from 'constants/livestream';
import { SITE_NAME } from 'config';
import { CHANNEL_NEW, CHANNEL_ANONYMOUS } from 'constants/claim';
import React, { useEffect, useState } from 'react';
import { buildURI, isURIValid, isNameValid, THUMBNAIL_STATUSES } from 'lbry-redux';
import Button from 'component/button';
import SelectChannel from 'component/selectChannel';
import classnames from 'classnames';
import TagsSelect from 'component/tagsSelect';
import PublishDescription from 'component/publishDescription';
import PublishPrice from 'component/publishPrice';
import PublishFile from 'component/publishFile';
// import PublishName from 'component/publishName';
import PublishAdditionalOptions from 'component/publishAdditionalOptions';
import PublishFormErrors from 'component/publishFormErrors';
import SelectThumbnail from 'component/selectThumbnail';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import * as PUBLISH_MODES from 'constants/publish_types';
import { FormField } from 'component/common/form';

// @if TARGET='app'
import fs from 'fs';
import tempy from 'tempy';
// @endif

const MODES = Object.values(PUBLISH_MODES);

const MODE_TO_I18N_STR = {
  [PUBLISH_MODES.FILE]: 'File',
  [PUBLISH_MODES.POST]: 'Post --[noun, markdown post tab button]--',
};

type Props = {
  disabled: boolean,
  tags: Array<Tag>,
  publish: (source?: string | File, ?boolean) => void,
  filePath: string | File,
  fileText: string,
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
  useLBRYUploader: ?boolean,
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
  checkAvailability: string => void,
  ytSignupPending: boolean,
  modal: { id: string, modalProps: {} },
  enablePublishPreview: boolean,
  myChannels: ?Array<ChannelClaim>,
  isLivestreamPublish: boolean,
};

function PublishForm(props: Props) {
  const [mode, setMode] = React.useState(PUBLISH_MODES.FILE);
  const [autoSwitchMode, setAutoSwitchMode] = React.useState(true);

  // Used to checl if the url name has changed:
  // A new file needs to be provided
  const [prevName, setPrevName] = React.useState(false);
  // Used to checl if the file has been modified by user
  const [fileEdited, setFileEdited] = React.useState(false);
  const [prevFileText, setPrevFileText] = React.useState('');

  const {
    thumbnail,
    name,
    channel,
    editingURI,
    myClaimForUri,
    resolveUri,
    title,
    bid,
    bidError,
    uploadThumbnailStatus,
    resetThumbnailStatus,
    updatePublishForm,
    filePath,
    fileText,
    publishing,
    clearPublish,
    isStillEditing,
    tags,
    publish,
    disabled = false,
    checkAvailability,
    ytSignupPending,
    modal,
    enablePublishPreview,
    myChannels,
    isLivestreamPublish,
  } = props;

  // livestream hardcoded bidnezz
  const isLivestreamCreator =
    myChannels &&
    myChannels.find(channelClaim => channelClaim.claim_id === LIVE_STREAM_CHANNEL_CLAIM_ID) &&
    channel === LIVE_STREAM_CHANNEL;

  // Used to check if name should be auto-populated from title
  const [autoPopulateNameFromTitle, setAutoPopulateNameFromTitle] = useState(!isStillEditing);

  const TAGS_LIMIT = 5;
  const fileFormDisabled = mode === PUBLISH_MODES.FILE && !filePath;
  const emptyPostError = mode === PUBLISH_MODES.POST && (!fileText || fileText.trim() === '');
  const formDisabled = (fileFormDisabled && !editingURI) || emptyPostError || publishing;
  const isInProgress = filePath || editingURI || name || title;

  // Editing content info
  const uri = myClaimForUri ? myClaimForUri.permanent_url : undefined;
  const fileMimeType =
    myClaimForUri && myClaimForUri.value && myClaimForUri.value.source
      ? myClaimForUri.value.source.media_type
      : undefined;
  const nameEdited = isStillEditing && name !== prevName;

  // If they are editing, they don't need a new file chosen
  const formValidLessFile =
    name &&
    isNameValid(name, false) &&
    title &&
    bid &&
    !bidError &&
    !emptyPostError &&
    !(uploadThumbnailStatus === THUMBNAIL_STATUSES.IN_PROGRESS);

  const isOverwritingExistingClaim = !editingURI && myClaimForUri;

  const formValid = isOverwritingExistingClaim
    ? false
    : editingURI && !filePath
    ? isStillEditing && formValidLessFile
    : formValidLessFile;

  const [previewing, setPreviewing] = React.useState(false);
  useEffect(() => {
    if (!modal) {
      setTimeout(() => {
        setPreviewing(false);
      }, 250);
    }
  }, [modal]);

  let submitLabel;
  if (isStillEditing) {
    submitLabel = !publishing ? __('Save') : __('Saving...');
  } else if (previewing) {
    submitLabel = __('Preparing...');
  } else {
    submitLabel = !publishing ? __('Upload') : __('Uploading...');
  }

  useEffect(() => {
    if (!thumbnail) {
      resetThumbnailStatus();
    }
  }, [thumbnail, resetThumbnailStatus]);

  // Save current name of the editing claim
  useEffect(() => {
    if (isStillEditing && (!prevName || !prevName.trim() === '')) {
      if (name !== prevName) {
        setPrevName(name);
      }
    }
  }, [name, prevName, setPrevName, isStillEditing]);

  // Check for content changes on the text editor
  useEffect(() => {
    if (!fileEdited && fileText !== prevFileText && fileText !== '') {
      setFileEdited(true);
    } else if (fileEdited && fileText === prevFileText) {
      setFileEdited(false);
    }
  }, [fileText, prevFileText, fileEdited]);

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
    if (uri && isValid && checkAvailability && name) {
      resolveUri(uri);
      checkAvailability(name);
      updatePublishForm({ uri });
    }
  }, [name, channel, resolveUri, updatePublishForm, checkAvailability]);

  useEffect(() => {
    updatePublishForm({ isMarkdownPost: mode === PUBLISH_MODES.POST });
  }, [mode, updatePublishForm]);

  function handleChannelNameChange(channel) {
    updatePublishForm({ channel });
  }

  // @if TARGET='web'
  function createWebFile() {
    if (fileText) {
      const fileName = name || title;
      if (fileName) {
        return new File([fileText], `${fileName}.md`, { type: 'text/markdown' });
      }
    }
  }
  // @endif

  // @if TARGET='app'
  // Save file changes locally ( desktop )
  function saveFileChanges() {
    let output;
    if (!output || output === '') {
      // Generate a temporary file:
      output = tempy.file({ name: 'post.md' });
    } else if (typeof filePath === 'string') {
      // Use current file
      output = filePath;
    }
    // Create a temporary file and save file changes
    if (output && output !== '') {
      // Save file changes
      return new Promise((resolve, reject) => {
        fs.writeFile(output, fileText, (error, data) => {
          // Handle error, cant save changes or create file
          error ? reject(error) : resolve(output);
        });
      });
    }
  }
  // @endif

  async function handlePublish() {
    let outputFile = filePath;
    let runPublish = false;

    // Publish post:
    // If here is no file selected yet on desktop, show file dialog and let the
    // user choose a file path. On web a new File is created
    if (mode === PUBLISH_MODES.POST && !emptyPostError) {
      // If user modified content on the text editor or editing name has changed:
      // Save changes and update file path
      if (fileEdited || nameEdited) {
        // @if TARGET='app'
        outputFile = await saveFileChanges();
        // @endif

        // @if TARGET='web'
        outputFile = createWebFile();
        // @endif

        // New content stored locally and is not empty
        if (outputFile) {
          updatePublishForm({ filePath: outputFile });
          runPublish = true;
        }
      } else {
        // Only metadata has changed.
        runPublish = true;
      }
    }
    // Publish file
    if (mode === PUBLISH_MODES.FILE) {
      runPublish = true;
    }

    if (runPublish) {
      if (enablePublishPreview) {
        setPreviewing(true);
        publish(outputFile, true);
      } else {
        publish(outputFile, false);
      }
    }
  }

  // Update mode on editing
  useEffect(() => {
    if (autoSwitchMode && editingURI && myClaimForUri) {
      // Change publish mode to "post" if editing content type is markdown
      if (fileMimeType === 'text/markdown' && mode !== PUBLISH_MODES.POST) {
        setMode(PUBLISH_MODES.POST);
        // Prevent forced mode
        setAutoSwitchMode(false);
      }
    }
  }, [autoSwitchMode, editingURI, fileMimeType, myClaimForUri, mode, setMode, setAutoSwitchMode]);

  // Editing claim uri
  return (
    <div className="card-stack">
      <Card
        className={disabled ? 'card--disabled' : undefined}
        actions={
          <React.Fragment>
            <SelectChannel channel={channel} onChannelChange={handleChannelNameChange} />
            <p className="help">
              {__('This is a username or handle that your content can be found under.')}{' '}
              {__('Ex. @Marvel, @TheBeatles, @BooksByJoe')}
            </p>
          </React.Fragment>
        }
      />

      {isLivestreamCreator && (
        <div className="livestream__creator-message livestream__publish-checkbox">
          <h4>{__('Hi %channel%!', { channel })}</h4>
          <p>
            Check this box if you have entered video information for your livestream. It doesn't matter what file you
            choose for now, just make the sure the title, description, and tags are correct. Everything else is setup!
          </p>
          <p>
            When you edit this file, there will be another checkbox to turn this back into a regular video so it can be
            listed on your channel's page.
          </p>

          <FormField
            type={isStillEditing ? 'radio' : 'checkbox'}
            label={__('This is for my livestream')}
            name="is_livestream_checkbox"
            checked={isLivestreamPublish}
            onChange={e => updatePublishForm({ isLivestreamPublish: e.target.checked })}
          />
          {isStillEditing && (
            <FormField
              type="radio"
              label={'I am done livestreaming'}
              name="is_livestream_checkbox_done"
              checked={!isLivestreamPublish}
              onChange={e => updatePublishForm({ isLivestreamPublish: !e.target.checked })}
            />
          )}
        </div>
      )}

      <PublishFile
        uri={uri}
        mode={mode}
        fileMimeType={fileMimeType}
        disabled={disabled || publishing}
        inProgress={isInProgress}
        setPublishMode={setMode}
        setPrevFileText={setPrevFileText}
        autoPopulateName={autoPopulateNameFromTitle}
        setAutoPopulateName={setAutoPopulateNameFromTitle}
        header={
          <>
            {MODES.map((modeName, index) => (
              <Button
                key={index}
                icon={modeName}
                label={__(MODE_TO_I18N_STR[String(modeName)] || '---')}
                button="alt"
                onClick={() => {
                  setMode(modeName);
                }}
                className={classnames('button-toggle', { 'button-toggle--active': mode === modeName })}
              />
            ))}
          </>
        }
      />
      {!publishing && (
        <div className={classnames({ 'card--disabled': formDisabled })}>
          {mode === PUBLISH_MODES.FILE && <PublishDescription disabled={formDisabled} />}
          <Card actions={<SelectThumbnail />} />
          <TagsSelect
            suggestMature
            disableAutoFocus
            hideHeader
            label={__('Selected Tags')}
            empty={__('No tags added')}
            limitSelect={TAGS_LIMIT}
            help={__(
              "Add tags that are relevant to your content so those who're looking for it can find it more easily. If mature content, ensure it is tagged mature. Tag abuse and missing mature tags will not be tolerated."
            )}
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

          {/* <PublishName
            disabled={isStillEditing || formDisabled}
            autoPopulateName={autoPopulateNameFromTitle}
            setAutoPopulateName={setAutoPopulateNameFromTitle}
          /> */}
          <PublishPrice disabled={formDisabled} />
          <PublishAdditionalOptions disabled={formDisabled} />
        </div>
      )}

      <section>
        <div className="card__actions">
          <Button
            button="primary"
            onClick={handlePublish}
            label={submitLabel}
            disabled={
              formDisabled ||
              !formValid ||
              uploadThumbnailStatus === THUMBNAIL_STATUSES.IN_PROGRESS ||
              ytSignupPending ||
              previewing
            }
          />
          <Button button="link" onClick={clearPublish} label={__('Cancel')} />
        </div>
        <p className="help">
          {!formDisabled && !formValid ? (
            <PublishFormErrors mode={mode} />
          ) : (
            <I18nMessage
              tokens={{
                lbry_terms_of_service: (
                  <Button
                    button="link"
                    href="https://www.lbry.com/termsofservice"
                    label={__('%site_name% Terms of Service', { site_name: SITE_NAME })}
                  />
                ),
              }}
            >
              By continuing, you accept the %lbry_terms_of_service%.
            </I18nMessage>
          )}
        </p>
      </section>
    </div>
  );
}

export default PublishForm;
