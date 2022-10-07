// @flow

/*
  On submit, this component calls publish, which dispatches doPublishDesktop.
  doPublishDesktop calls lbry-redux Lbry publish method using lbry-redux publish state as params.
  Publish simply instructs the SDK to find the file path on disk and publish it with the provided metadata.
  On web, the Lbry publish method call is overridden in platform/web/api-setup, using a function in platform/web/publish.
  File upload is carried out in the background by that function.
 */

import { SITE_NAME, ENABLE_NO_SOURCE_CLAIMS, SIMPLE_SITE } from 'config';
import React, { useEffect, useState } from 'react';
import { buildURI, isURIValid, isNameValid } from 'util/lbryURI';
import * as THUMBNAIL_STATUSES from 'constants/thumbnail_upload_statuses';
import Button from 'component/button';
import ChannelSelect from 'component/channelSelector';
import classnames from 'classnames';
import TagsSelect from 'component/tagsSelect';
import PublishDescription from 'component/publish/shared/publishDescription';
import PublishAdditionalOptions from 'component/publish/shared/publishAdditionalOptions';
import PublishFormErrors from 'component/publish/shared/publishFormErrors';
import PublishStreamReleaseDate from 'component/publish/shared/publishStreamReleaseDate';
import PublishFile from 'component/publish/upload/publishFile';
import PublishProtectedContent from 'component/publishProtectedContent';

import SelectThumbnail from 'component/selectThumbnail';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import * as PUBLISH_MODES from 'constants/publish_types';
import { useHistory } from 'react-router';
import Spinner from 'component/spinner';
import { SOURCE_NONE } from 'constants/publish_sources';

import * as ICONS from 'constants/icons';
import Icon from 'component/common/icon';

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
  thumbnailError: ?boolean,
  uploadThumbnailStatus: ?string,
  thumbnailPath: ?string,
  description: ?string,
  language: string,
  releaseTimeError: ?string,
  nsfw: boolean,
  contentIsFree: boolean,
  fee: {
    amount: string,
    currency: string,
  },
  name: ?string,
  nameError: ?string,
  winningBidForClaimUri: number,
  myClaimForUri: ?StreamClaim,
  licenseType: string,
  otherLicenseDescription: ?string,
  licenseUrl: ?string,
  useLBRYUploader: ?boolean,
  publishing: boolean,
  publishSuccess: boolean,
  publishError?: boolean,
  balance: number,
  isStillEditing: boolean,
  clearPublish: () => void,
  resolveUri: (string) => void,
  resetThumbnailStatus: () => void,
  // Add back type
  updatePublishForm: (any) => void,
  checkAvailability: (string) => void,
  ytSignupPending: boolean,
  modal: { id: string, modalProps: {} },
  enablePublishPreview: boolean,
  activeChannelClaim: ?ChannelClaim,
  incognito: boolean,
  user: ?User,
  permanentUrl: ?string,
  remoteUrl: ?string,
  isClaimingInitialRewards: boolean,
  claimInitialRewards: () => void,
  hasClaimedInitialRewards: boolean,
  restrictedToMemberships: ?string,
};

function UploadForm(props: Props) {
  // Detect upload type from query in URL
  const {
    activeChannelClaim,
    bid,
    bidError,
    checkAvailability,
    claimInitialRewards,
    clearPublish,
    description,
    disabled = false,
    editingURI,
    enablePublishPreview,
    filePath,
    fileText,
    hasClaimedInitialRewards,
    incognito,
    isClaimingInitialRewards,
    isStillEditing,
    modal,
    myClaimForUri,
    name,
    permanentUrl,
    publish,
    publishError,
    publishSuccess,
    publishing,
    remoteUrl,
    resetThumbnailStatus,
    resolveUri,
    tags,
    thumbnail,
    thumbnailError,
    title,
    updatePublishForm,
    uploadThumbnailStatus,
    user,
    ytSignupPending,
    restrictedToMemberships,
  } = props;

  const inEditMode = Boolean(editingURI);
  const { replace, location } = useHistory();
  const urlParams = new URLSearchParams(location.search);
  const TYPE_PARAM = 'type';
  const uploadType = urlParams.get(TYPE_PARAM);
  const _uploadType = uploadType && uploadType.toLowerCase();

  const enableLivestream = ENABLE_NO_SOURCE_CLAIMS && user && !user.odysee_live_disabled;

  // $FlowFixMe
  const AVAILABLE_MODES = Object.values(PUBLISH_MODES).filter((mode) => {
    // $FlowFixMe
    if (inEditMode) {
      return mode === PUBLISH_MODES.FILE;
    } else if (_uploadType) {
      return mode === _uploadType && (mode !== PUBLISH_MODES.LIVESTREAM || enableLivestream);
    }
  });

  const MODE_TO_I18N_STR = {
    [PUBLISH_MODES.FILE]: SIMPLE_SITE ? 'Video/Audio' : 'File',
  };

  const formTitle = !editingURI ? __('Upload a file') : __('Edit Upload');

  const mode = PUBLISH_MODES.FILE;

  // Used to check if the url name has changed:
  // A new file needs to be provided
  const [prevName, setPrevName] = React.useState(false);
  // Used to check if the file has been modified by user
  const [fileEdited, setFileEdited] = React.useState(false);
  const [prevFileText, setPrevFileText] = React.useState('');

  const [waitForFile, setWaitForFile] = useState(false);
  const [overMaxBitrate, setOverMaxBitrate] = useState(false);

  const TAGS_LIMIT = 5;
  const fileFormDisabled = mode === PUBLISH_MODES.FILE && !filePath && !remoteUrl;
  const emptyPostError = mode === PUBLISH_MODES.POST && (!fileText || fileText.trim() === '');
  const formDisabled = (fileFormDisabled && !editingURI) || emptyPostError || publishing;
  const isInProgress = filePath || editingURI || name || title;
  const activeChannelName = activeChannelClaim && activeChannelClaim.name;
  // Editing content info
  const fileMimeType =
    myClaimForUri && myClaimForUri.value && myClaimForUri.value.source
      ? myClaimForUri.value.source.media_type
      : undefined;
  const claimChannelId =
    (myClaimForUri && myClaimForUri.signing_channel && myClaimForUri.signing_channel.claim_id) ||
    (activeChannelClaim && activeChannelClaim.claim_id);

  const nameEdited = isStillEditing && name !== prevName;
  const thumbnailUploaded = uploadThumbnailStatus === THUMBNAIL_STATUSES.COMPLETE && thumbnail;

  const waitingForFile = waitForFile && !remoteUrl && !filePath;
  // If they are editing, they don't need a new file chosen
  const formValidLessFile =
    name &&
    isNameValid(name) &&
    title &&
    !overMaxBitrate &&
    bid &&
    thumbnail &&
    !bidError &&
    !emptyPostError &&
    !(thumbnailError && !thumbnailUploaded) &&
    !(uploadThumbnailStatus === THUMBNAIL_STATUSES.IN_PROGRESS);

  const isOverwritingExistingClaim = !editingURI && myClaimForUri;

  const formValid =
    restrictedToMemberships !== null &&
    (isOverwritingExistingClaim
      ? false
      : editingURI && !filePath // if we're editing we don't need a file
      ? isStillEditing && formValidLessFile && !waitingForFile
      : formValidLessFile);

  const [previewing, setPreviewing] = React.useState(false);

  const isClear = !filePath && !title && !name && !description && !thumbnail;

  useEffect(() => {
    if (!hasClaimedInitialRewards) {
      claimInitialRewards();
    }
  }, [hasClaimedInitialRewards, claimInitialRewards]);

  useEffect(() => {
    if (!modal) {
      const timer = setTimeout(() => {
        setPreviewing(false);
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [modal]);

  useEffect(() => {
    if (publishError) {
      setPreviewing(false);
      updatePublishForm({ publishError: undefined });
    }
  }, [publishError]);

  let submitLabel;

  if (isClaimingInitialRewards) {
    submitLabel = __('Claiming credits...');
  } else if (publishing) {
    if (isStillEditing || inEditMode) {
      submitLabel = __('Saving...');
    } else {
      submitLabel = __('Uploading...');
    }
  } else if (previewing) {
    submitLabel = <Spinner type="small" />;
  } else {
    if (isStillEditing || inEditMode) {
      submitLabel = __('Save');
    } else {
      submitLabel = __('Upload');
    }
  }

  // if you enter the page and it is stuck in publishing, "stop it."
  useEffect(() => {
    if (publishing || publishSuccess) {
      clearPublish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearPublish]);

  useEffect(() => {
    if (!thumbnail) {
      resetThumbnailStatus();
    }
  }, [thumbnail, resetThumbnailStatus]);

  // Save previous name of the editing claim
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

    const isValid = uri && isURIValid(uri);
    if (uri && isValid && checkAvailability && name) {
      resolveUri(uri);
      checkAvailability(name);
      updatePublishForm({ uri });
    }
  }, [name, activeChannelName, resolveUri, updatePublishForm, checkAvailability]);

  // because publish editingUri is channel_short/claim_long and we don't have that, resolve it.
  useEffect(() => {
    if (editingURI) {
      resolveUri(editingURI);
    }
  }, [editingURI, resolveUri]);

  // set isMarkdownPost in publish form if so, also update isLivestreamPublish
  useEffect(() => {
    updatePublishForm({
      isMarkdownPost: false,
      isLivestreamPublish: mode === PUBLISH_MODES.LIVESTREAM,
    });
  }, [mode, updatePublishForm]);

  useEffect(() => {
    if (incognito) {
      updatePublishForm({ channel: undefined });
    } else if (activeChannelName) {
      updatePublishForm({ channel: activeChannelName });
    }
  }, [activeChannelName, incognito, updatePublishForm]);

  // if we have a type urlparam, update it? necessary?
  useEffect(() => {
    if (!_uploadType) return;
    const newParams = new URLSearchParams();
    newParams.set(TYPE_PARAM, mode.toLowerCase());
    replace({ search: newParams.toString() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, _uploadType]);

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
        outputFile = createWebFile();

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

  // When accessing to publishing, make sure to reset file input attributes
  // since we can't restore from previous user selection (like we do
  // with other properties such as name, title, etc.) for security reasons.
  useEffect(() => {
    if (mode === PUBLISH_MODES.FILE) {
      updatePublishForm({ filePath: '', fileDur: 0, fileSize: 0 });
    }
  }, [mode, updatePublishForm]);

  // FIle Source Selector State.
  const [fileSource, setFileSource] = useState();
  const changeFileSource = (state) => setFileSource(state);

  const [showSchedulingOptions, setShowSchedulingOptions] = useState(false);
  useEffect(() => {
    setShowSchedulingOptions(fileSource === SOURCE_NONE);
  }, [fileSource]);

  if (publishing) {
    return (
      <div className="main--empty">
        <h1 className="section__subtitle">{__('Publishing...')}</h1>
        <Spinner delayed />
      </div>
    );
  }

  const isFormIncomplete =
    isClaimingInitialRewards ||
    formDisabled ||
    !formValid ||
    uploadThumbnailStatus === THUMBNAIL_STATUSES.IN_PROGRESS ||
    ytSignupPending ||
    previewing;

  // Editing claim uri
  return (
    <div className="card-stack">
      <h1 className="page__title">
        <Icon icon={ICONS.PUBLISH} />
        <label>
          {formTitle}
          {!isClear && <Button onClick={() => clearPublish()} icon={ICONS.REFRESH} button="primary" label="Clear" />}
        </label>
      </h1>

      <PublishFile
        inEditMode={inEditMode}
        fileSource={fileSource}
        changeFileSource={changeFileSource}
        uri={permanentUrl}
        mode={mode}
        fileMimeType={fileMimeType}
        disabled={disabled || publishing}
        inProgress={isInProgress}
        setPrevFileText={setPrevFileText}
        setWaitForFile={setWaitForFile}
        setOverMaxBitrate={setOverMaxBitrate}
        channelId={claimChannelId}
        channelName={activeChannelName}
        header={
          <>
            {AVAILABLE_MODES.map((modeName) => (
              <Button
                key={String(modeName)}
                icon={modeName}
                iconSize={18}
                label={__(MODE_TO_I18N_STR[String(modeName)] || '---')}
                button="alt"
                onClick={() => {
                  // $FlowFixMe
                  // setMode(modeName);
                }}
                className={classnames('button-toggle', { 'button-toggle--active': mode === modeName })}
              />
            ))}
          </>
        }
      />

      {mode !== PUBLISH_MODES.POST && <PublishDescription disabled={formDisabled} />}

      {!publishing && (
        <div className={classnames({ 'card--disabled': formDisabled })}>
          {showSchedulingOptions && <Card body={<PublishStreamReleaseDate />} />}

          <Card actions={<SelectThumbnail />} />

          <PublishProtectedContent claim={myClaimForUri} location={'upload'} />

          <h2 className="card__title" style={{ marginTop: 'var(--spacing-l)' }}>
            {__('Tags')}
          </h2>
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

          <PublishAdditionalOptions disabled={formDisabled} showSchedulingOptions={showSchedulingOptions} />
        </div>
      )}
      <section>
        <div className="section__actions">
          <Button button="primary" onClick={handlePublish} label={submitLabel} disabled={isFormIncomplete} />
          <ChannelSelect disabled={isFormIncomplete} autoSet channelToSet={claimChannelId} isPublishMenu />
        </div>
        <span className="help">
          {!formDisabled && !formValid ? (
            <PublishFormErrors title={title} mode={mode} waitForFile={waitingForFile} overMaxBitrate={overMaxBitrate} />
          ) : (
            <I18nMessage
              tokens={{
                odysee_terms_of_service: (
                  <Button
                    button="link"
                    href="https://odysee.com/$/tos"
                    label={__('%site_name% Terms of Service', { site_name: SITE_NAME })}
                  />
                ),
                odysee_community_guidelines: (
                  <Button
                    button="link"
                    href="https://help.odysee.tv/communityguidelines"
                    target="_blank"
                    label={__('Community Guidelines')}
                  />
                ),
              }}
            >
              By continuing, you accept the %odysee_terms_of_service% and %odysee_community_guidelines%.
            </I18nMessage>
          )}
        </span>
      </section>
    </div>
  );
}

export default UploadForm;
