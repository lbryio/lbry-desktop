// @flow

/*
  On submit, this component calls publish, which dispatches doPublishDesktop.
  doPublishDesktop calls lbry-redux Lbry publish method using lbry-redux publish state as params.
  Publish simply instructs the SDK to find the file path on disk and publish it with the provided metadata.
  On web, the Lbry publish method call is overridden in platform/web/api-setup, using a function in platform/web/publish.
  File upload is carried out in the background by that function.
 */

import { SITE_NAME, ENABLE_NO_SOURCE_CLAIMS, SIMPLE_SITE, CHANNEL_STAKED_LEVEL_LIVESTREAM } from 'config';
import React, { useEffect } from 'react';
import { buildURI, isURIValid, isNameValid, THUMBNAIL_STATUSES } from 'lbry-redux';
import Button from 'component/button';
import ChannelSelect from 'component/channelSelector';
import classnames from 'classnames';
import TagsSelect from 'component/tagsSelect';
import PublishDescription from 'component/publishDescription';
import PublishPrice from 'component/publishPrice';
import PublishFile from 'component/publishFile';
import PublishBid from 'component/publishBid';
import PublishAdditionalOptions from 'component/publishAdditionalOptions';
import PublishFormErrors from 'component/publishFormErrors';
import SelectThumbnail from 'component/selectThumbnail';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import * as PUBLISH_MODES from 'constants/publish_types';
import { useHistory } from 'react-router';
import Spinner from 'component/spinner';

// @if TARGET='app'
import fs from 'fs';
import tempy from 'tempy';
// @endif

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
  resolveUri: (string) => void,
  scrollToTop: () => void,
  prepareEdit: (claim: any, uri: string) => void,
  resetThumbnailStatus: () => void,
  amountNeededForTakeover: ?number,
  // Add back type
  updatePublishForm: (any) => void,
  checkAvailability: (string) => void,
  ytSignupPending: boolean,
  modal: { id: string, modalProps: {} },
  enablePublishPreview: boolean,
  activeChannelClaim: ?ChannelClaim,
  incognito: boolean,
  user: ?User,
  activeChannelStakedLevel: number,
};

function PublishForm(props: Props) {
  // Detect upload type from query in URL
  const {
    thumbnail,
    name,
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
    activeChannelClaim,
    incognito,
    user,
    activeChannelStakedLevel,
  } = props;

  const { replace, location } = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const uploadType = urlParams.get('type');
  const livestreamEnabled =
    ENABLE_NO_SOURCE_CLAIMS &&
    user &&
    !user.odysee_live_disabled &&
    (activeChannelStakedLevel >= CHANNEL_STAKED_LEVEL_LIVESTREAM || user.odysee_live_enabled);
  // $FlowFixMe
  const MODES = livestreamEnabled
    ? Object.values(PUBLISH_MODES)
    : Object.values(PUBLISH_MODES).filter((mode) => mode !== PUBLISH_MODES.LIVESTREAM);

  const MODE_TO_I18N_STR = {
    [PUBLISH_MODES.FILE]: SIMPLE_SITE ? 'Video' : 'File',
    [PUBLISH_MODES.POST]: 'Post --[noun, markdown post tab button]--',
    [PUBLISH_MODES.LIVESTREAM]: 'Livestream --[noun, livestream tab button]--',
  };
  // Component state
  const [mode, setMode] = React.useState(uploadType || PUBLISH_MODES.FILE);
  const [autoSwitchMode, setAutoSwitchMode] = React.useState(true);

  // Used to check if the url name has changed:
  // A new file needs to be provided
  const [prevName, setPrevName] = React.useState(false);
  // Used to check if the file has been modified by user
  const [fileEdited, setFileEdited] = React.useState(false);
  const [prevFileText, setPrevFileText] = React.useState('');

  const TAGS_LIMIT = 5;
  const fileFormDisabled = mode === PUBLISH_MODES.FILE && !filePath;
  const emptyPostError = mode === PUBLISH_MODES.POST && (!fileText || fileText.trim() === '');
  const formDisabled = (fileFormDisabled && !editingURI) || emptyPostError || publishing;
  const isInProgress = filePath || editingURI || name || title;
  const activeChannelName = activeChannelClaim && activeChannelClaim.name;
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

  const isLivestream = mode === PUBLISH_MODES.LIVESTREAM;
  let submitLabel;
  if (publishing) {
    if (isStillEditing) {
      submitLabel = __('Saving...');
    } else if (isLivestream) {
      submitLabel = __('Creating...');
    } else {
      submitLabel = __('Uploading...');
    }
  } else if (previewing) {
    submitLabel = __('Preparing...');
  } else {
    if (isStillEditing) {
      submitLabel = __('Save');
    } else if (isLivestream) {
      submitLabel = __('Create');
    } else {
      submitLabel = __('Upload');
    }
  }

  // if you enter the page and it is stuck in publishing, "stop it."
  useEffect(() => {
    if (publishing) {
      clearPublish();
    }
  }, []);

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
    // We are only going to store the full uri, but we need to resolve the uri with and without the channel name
    let uri;
    try {
      uri = name && buildURI({ streamName: name, activeChannelName });
    } catch (e) {}

    if (activeChannelName && name) {
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
  }, [name, activeChannelName, resolveUri, updatePublishForm, checkAvailability]);

  useEffect(() => {
    // because editingURI is lbry://channel_short/claim_long and that particular shape won't map to the claimId yet
    if (editingURI) {
      resolveUri(editingURI);
    }
  }, [editingURI, resolveUri]);

  useEffect(() => {
    updatePublishForm({
      isMarkdownPost: mode === PUBLISH_MODES.POST,
      isLivestreamPublish: isLivestream,
    });
  }, [mode, updatePublishForm]);

  useEffect(() => {
    if (incognito) {
      updatePublishForm({ channel: undefined });

      // Anonymous livestreams aren't supported
      if (isLivestream) {
        setMode(PUBLISH_MODES.FILE);
      }
    } else if (activeChannelName) {
      updatePublishForm({ channel: activeChannelName });
    }
  }, [activeChannelName, incognito, updatePublishForm]);

  useEffect(() => {
    const _uploadType = uploadType && uploadType.toLowerCase();

    // Default to standard file publish if none specified
    if (!_uploadType) {
      setMode(PUBLISH_MODES.FILE);
      return;
    }

    // File publish
    if (_uploadType === PUBLISH_MODES.FILE.toLowerCase()) {
      setMode(PUBLISH_MODES.FILE);
      return;
    }
    // Post publish
    if (_uploadType === PUBLISH_MODES.POST.toLowerCase()) {
      setMode(PUBLISH_MODES.POST);
      return;
    }
    // LiveStream publish
    if (_uploadType === PUBLISH_MODES.LIVESTREAM.toLowerCase() && livestreamEnabled) {
      setMode(PUBLISH_MODES.LIVESTREAM);
      return;
    }

    // Default to standard file publish
    setMode(PUBLISH_MODES.FILE);
  }, [uploadType, livestreamEnabled]);

  useEffect(() => {
    if (!uploadType) return;
    const newParams = new URLSearchParams();
    newParams.set('type', mode.toLowerCase());
    replace({ search: newParams.toString() });
  }, [mode, uploadType]);

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
    if (mode === PUBLISH_MODES.FILE || isLivestream) {
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

  if (publishing) {
    return (
      <div className="main--empty">
        <h1 className="section__subtitle">{__('Publishing...')}</h1>
        <Spinner delayed />
      </div>
    );
  }
  // Editing claim uri
  return (
    <div className="card-stack">
      <ChannelSelect hideAnon={isLivestream} disabled={disabled} />

      <PublishFile
        uri={uri}
        mode={mode}
        fileMimeType={fileMimeType}
        disabled={disabled || publishing}
        inProgress={isInProgress}
        setPublishMode={setMode}
        setPrevFileText={setPrevFileText}
        header={
          <>
            {MODES.map((modeName) => (
              <Button
                key={String(modeName)}
                icon={modeName}
                label={__(MODE_TO_I18N_STR[String(modeName)] || '---')}
                button="alt"
                onClick={() => {
                  // $FlowFixMe
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
            suggestMature={!SIMPLE_SITE}
            disableAutoFocus
            hideHeader
            label={__('Selected Tags')}
            empty={__('No tags added')}
            limitSelect={TAGS_LIMIT}
            help={__(
              "Add tags that are relevant to your content so those who're looking for it can find it more easily. If your content is best suited for mature audiences, ensure it is tagged 'mature'."
            )}
            placeholder={__('gaming, crypto')}
            onSelect={(newTags) => {
              const validatedTags = [];
              newTags.forEach((newTag) => {
                if (!tags.some((tag) => tag.name === newTag.name)) {
                  validatedTags.push(newTag);
                }
              });
              updatePublishForm({ tags: [...tags, ...validatedTags] });
            }}
            onRemove={(clickedTag) => {
              const newTags = tags.slice().filter((tag) => tag.name !== clickedTag.name);
              updatePublishForm({ tags: newTags });
            }}
            tagsChosen={tags}
          />

          <PublishBid disabled={isStillEditing || formDisabled} />
          {!isLivestream && <PublishPrice disabled={formDisabled} />}
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
          <Button button="link" onClick={clearPublish} label={__('New')} />
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
