// @flow

/*
  On submit, this component calls publish, which dispatches doPublishDesktop.
  doPublishDesktop calls lbry-redux Lbry publish method using lbry-redux publish state as params.
  Publish simply instructs the SDK to find the file path on disk and publish it with the provided metadata.
  On web, the Lbry publish method call is overridden in platform/web/api-setup, using a function in platform/web/publish.
  File upload is carried out in the background by that function.
 */
import fs from 'fs';
import { remote } from 'electron';
import { SITE_NAME } from 'config';
import { CHANNEL_NEW, CHANNEL_ANONYMOUS } from 'constants/claim';
import React, { useEffect } from 'react';
import { buildURI, isURIValid, isNameValid, THUMBNAIL_STATUSES } from 'lbry-redux';
import Button from 'component/button';
import SelectChannel from 'component/selectChannel';
import classnames from 'classnames';
import TagsSelect from 'component/tagsSelect';
import PublishDescription from 'component/publishDescription';
import PublishPrice from 'component/publishPrice';
import PublishFile from 'component/publishFile';
import PublishName from 'component/publishName';
import PublishAdditionalOptions from 'component/publishAdditionalOptions';
import PublishFormErrors from 'component/publishFormErrors';
import SelectThumbnail from 'component/selectThumbnail';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import * as PUBLISH_MODES from 'constants/publish_types';

const { dialog } = remote;
const currentWindow = remote.getCurrentWindow();
const MODES = Object.values(PUBLISH_MODES);

type Props = {
  disabled: boolean,
  tags: Array<Tag>,
  publish: (?string) => void,
  filePath: ?string,
  fileText: ?string,
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
  onChannelChange: string => void,
  ytSignupPending: boolean,
};

function PublishForm(props: Props) {
  const [mode, setMode] = React.useState(PUBLISH_MODES.FILE);
  const [autoSwitchMode, setAutoSwitchMode] = React.useState(true);

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
    onChannelChange,
    ytSignupPending,
  } = props;

  const TAGS_LIMIT = 5;
  const fileFormDisabled = mode === PUBLISH_MODES.FILE && !filePath;
  const storyFormDisabled = mode === PUBLISH_MODES.STORY && (!fileText || fileText === '');
  const formDisabled = ((fileFormDisabled || storyFormDisabled) && !editingURI) || publishing;
  const isInProgress = filePath || editingURI || name || title;

  // If they are editing, they don't need a new file chosen
  const formValidLessFile =
    name &&
    isNameValid(name, false) &&
    title &&
    bid &&
    !bidError &&
    !(uploadThumbnailStatus === THUMBNAIL_STATUSES.IN_PROGRESS);

  const isOverwritingExistingClaim = !editingURI && myClaimForUri;

  const formValid = isOverwritingExistingClaim
    ? false
    : editingURI && !filePath
    ? isStillEditing && formValidLessFile
    : formValidLessFile;

  let submitLabel;
  if (isStillEditing) {
    submitLabel = !publishing ? __('Save') : __('Saving...');
  } else {
    submitLabel = !publishing ? __('Upload') : __('Uploading...');
  }

  useEffect(() => {
    if (!thumbnail) {
      resetThumbnailStatus();
    }
  }, [thumbnail, resetThumbnailStatus]);

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

  function handleChannelNameChange(channel) {
    onChannelChange(channel);
    updatePublishForm({ channel });
  }

  function showSaveDialog() {
    return dialog.showSaveDialog(currentWindow, {
      filters: [{ name: 'Text', extensions: ['md', 'markdown', 'txt'] }],
    });
  }

  function createWebFile() {
    if (fileText) {
      const fileName = name || title || 'story';
      return new File([fileText], `${fileName}.md`, { type: 'text/markdown' });
    }
  }

  async function saveFileChanges() {
    let output = filePath;
    if (!output || output === '') {
      output = await showSaveDialog();
    }
    // User saved the file on a custom location
    if (typeof output === 'string') {
      // Save file changes
      return new Promise((resolve, reject) => {
        fs.writeFile(output, fileText, (error, data) => {
          // Handle error, cant save changes or create file
          error ? reject(error) : resolve(output);
        });
      });
    }
  }

  function verifyStoryContent() {
    const isEmpty = !fileText || fileText.length === 0 || fileText === '';
    // TODO: Verify file size limit, and character size as well ?
    return !isEmpty;
  }

  async function handlePublish() {
    // Publish story:
    // If here is no file selected yet on desktop, show file dialog and let the
    // user choose a file path. On web a new File is created
    if (mode === PUBLISH_MODES.STORY) {
      let outputFile = filePath;
      // If user modified content on the text editor:
      // Save changes and updat file path
      if (fileEdited) {
        // @if TARGET='app'
        outputFile = await saveFileChanges();
        // @endif

        // @if TARGET='web'
        outputFile = createWebFile();
        // @endif

        // New content stored locally and is not empty
        if (outputFile) {
          updatePublishForm({ filePath: outputFile });
        }
      }

      // Verify if story has a valid content and is not emoty
      // On web file size limit will be verified as well
      const verified = verifyStoryContent();

      if (verified) {
        publish(outputFile);
      }
    }
    // Publish file
    if (mode === PUBLISH_MODES.FILE) {
      publish(filePath);
    }
  }

  function changePublishMode(modeName) {
    setMode(modeName);
  }

  // Update mode on editing
  useEffect(() => {
    if (autoSwitchMode && editingURI && myClaimForUri) {
      const { media_type: mediaType } = myClaimForUri.value.source;
      // Change publish mode to "story" if editing content type is markdown
      if (mediaType === 'text/markdown' && mode !== PUBLISH_MODES.STORY) {
        setMode(PUBLISH_MODES.STORY);
        // Prevent forced mode
        setAutoSwitchMode(false);
      }
    }
  }, [autoSwitchMode, editingURI, myClaimForUri, mode, setMode, setAutoSwitchMode]);

  // Editing claim uri
  const uri = myClaimForUri ? myClaimForUri.permanent_url : undefined;

  return (
    <div className="card-stack">
      <div className="button-tab-group">
        {MODES.map((modeName, index) => (
          <Button
            key={index}
            icon={modeName}
            label={modeName}
            button="alt"
            onClick={() => {
              changePublishMode(modeName);
            }}
            className={classnames('button-toggle', { 'button-toggle--active': mode === modeName })}
          />
        ))}
      </div>
      <PublishFile
        uri={uri}
        mode={mode}
        disabled={disabled || publishing}
        inProgress={isInProgress}
        setPublishMode={setMode}
        setPrevFileText={setPrevFileText}
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
                <SelectChannel channel={channel} onChannelChange={handleChannelNameChange} />
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
        <div className="card__actions">
          <Button
            button="primary"
            onClick={handlePublish}
            label={submitLabel}
            disabled={
              formDisabled || !formValid || uploadThumbnailStatus === THUMBNAIL_STATUSES.IN_PROGRESS || ytSignupPending
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
