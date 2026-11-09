import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React from 'react';
import classnames from 'classnames';
import { FormField, FormFieldAreaAdvanced } from 'component/common/form';
import Button from 'component/button';
import TagsSearch from 'component/tagsSearch';
import ErrorText from 'component/common/error-text';
import ChannelThumbnail from 'component/channelThumbnail';
import { isNameValid, parseURI } from 'util/lbryURI';
import ClaimAbandonButton from 'component/claimAbandonButton';
import { useHistory } from 'react-router-dom';
import { MINIMUM_PUBLISH_BID, INVALID_NAME_ERROR, ESTIMATED_FEE } from 'constants/claim';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'component/common/tabs';
import Card from 'component/common/card';
import * as PAGES from 'constants/pages';
import analytics from 'analytics';
import LbcSymbol from 'component/common/lbc-symbol';
import SUPPORTED_LANGUAGES from 'constants/supported_languages';
import WalletSpendableBalanceHelp from 'component/walletSpendableBalanceHelp';
import { sortLanguageMap } from 'util/default-languages';
// @ts-expect-error - TS2792 - Cannot find module 'component/selectThumbnail/thumbnail-broken.png'. Did you mean to set the 'moduleResolution' option to 'node', or to add aliases to the 'paths' option?
import ThumbnailBrokenImage from 'component/selectThumbnail/thumbnail-broken.png';
// @ts-expect-error - TS2792 - Cannot find module 'component/channelThumbnail/gerbil.png'. Did you mean to set the 'moduleResolution' option to 'node', or to add aliases to the 'paths' option?
import Gerbil from 'component/channelThumbnail/gerbil.png';

const LANG_NONE = 'none';

const MAX_TAG_SELECT = 5;
const MAX_NAME_LEN = 128;
const MAX_TITLE_LEN = 255;
const MAX_DESCRIPTION_LEN = 2056;

type Props = {
  claim: ChannelClaim,
  title: string,
  amount: number,
  coverUrl: string,
  thumbnailUrl: string,
  location: {
    search: string
  },
  description: string,
  website: string,
  email: string,
  balance: number,
  tags: Array<string>,
  locations: Array<string>,
  languages: Array<string>,
  updateChannel: (arg1?: any) => Promise<any>,
  updatingChannel: boolean,
  updateError: string,
  createChannel: (arg1?: any) => Promise<any>,
  createError: string,
  creatingChannel: boolean,
  clearChannelErrors: () => void,
  claimInitialRewards: () => void,
  onDone: () => void,
  openModal: (
    id: string,
    arg2: {
      onUpdate: (arg1: string, arg2: boolean) => void,
      assetName: string,
      helpText: string,
      currentValue: string,
      title: string
    },
  ) => void,
  uri: string,
  disabled: boolean,
  isClaimingInitialRewards: boolean,
  hasClaimedInitialRewards: boolean
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
    languages = [],
    onDone,
    updateChannel,
    updateError,
    updatingChannel,
    createChannel,
    creatingChannel,
    createError,
    clearChannelErrors,
    claimInitialRewards,
    openModal,
    disabled,
    isClaimingInitialRewards,
    hasClaimedInitialRewards,
  } = props;
  const [nameError, setNameError] = React.useState<any>(undefined);
  const [bidError, setBidError] = React.useState('');
  const [isUpload, setIsUpload] = React.useState({ cover: false, thumbnail: false });
  const [thumbError, setThumbError] = React.useState(false);
  const { claim_id: claimId } = claim || {};
  const [params, setParams]: [any, (arg1?: any) => void] = React.useState(getChannelParams());
  const [coverError, setCoverError] = React.useState(false);
  const [coverPreview, setCoverPreview] = React.useState(params.coverUrl);
  const { channelName } = parseURI(uri);
  const name = params.name;
  const isNewChannel = !uri;
  const { replace } = useHistory();
  const languageParam = params.languages;
  const primaryLanguage = Array.isArray(languageParam) && languageParam.length && languageParam[0];
  const secondaryLanguage = Array.isArray(languageParam) && languageParam.length >= 2 && languageParam[1];
  const submitLabel = React.useMemo(() => {
    if (isClaimingInitialRewards) {
      return __('Claiming credits...');
    }
    return creatingChannel || updatingChannel ? __('Submitting...') : __('Submit');
  }, [isClaimingInitialRewards, creatingChannel, updatingChannel]);
  const submitDisabled = React.useMemo(() => {
    return (
      isClaimingInitialRewards ||
      creatingChannel ||
      updatingChannel ||
      coverError ||
      bidError ||
      (isNewChannel && !params.name)
    );
  }, [coverError, isClaimingInitialRewards, creatingChannel, updatingChannel, bidError, isNewChannel, params.name]);

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
      languages: Array<string> | null | undefined,
      locations: Array<string> | null | undefined,
      tags: Array<{
        name: string
      }> | null | undefined,
      claim_id?: string
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
        ? tags.map((tag) => {
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
// @ts-expect-error - TS2345 - Argument of type 'number' is not assignable to parameter of type 'string'. | TS2345 - Argument of type 'number' is not assignable to parameter of type 'string'.
    const totalAvailableBidAmount = (parseFloat(amount) || 0.0) + (parseFloat(balance) || 0.0);

    setParams({ ...params, amount: bid });

    if (bid <= 0.0 || isNaN(bid)) {
      setBidError(__('Deposit cannot be 0'));
    } else if (totalAvailableBidAmount < bid) {
      setBidError(
        __('Deposit cannot be higher than your available balance: %balance%', { balance: totalAvailableBidAmount })
      );
    } else if (totalAvailableBidAmount - bid < ESTIMATED_FEE) {
      setBidError(__('Please decrease your deposit to account for transaction fees'));
    } else if (bid < MINIMUM_PUBLISH_BID) {
      setBidError(__('Your deposit must be higher'));
    } else {
      setBidError('');
    }
  }

  function handleLanguageChange(index: unknown, code: unknown) {
    let langs = [...languageParam];
    if (index === 0) {
      if (code === LANG_NONE) {
        // clear all
        langs = [];
      } else {
        langs[0] = code;
      }
    } else {
      if (code === LANG_NONE || code === langs[0]) {
        langs.splice(1, 1);
      } else {
// @ts-expect-error - TS2538 - Type 'unknown' cannot be used as an index type.
        langs[index] = code;
      }
    }
    setParams({ ...params, languages: langs });
  }

  function handleThumbnailChange(thumbnailUrl: string, uploadSelected: boolean) {
    setParams({ ...params, thumbnailUrl });
    setIsUpload({ ...isUpload, thumbnail: uploadSelected });
    setThumbError(false);
  }

  function handleCoverChange(coverUrl: string, uploadSelected: boolean, preview?: string | null) {
    setCoverPreview(preview || '');
    setParams({ ...params, coverUrl });
    setIsUpload({ ...isUpload, cover: uploadSelected });
    setCoverError(false);
  }

  function handleSubmit() {
    if (uri) {
      updateChannel(params).then((success) => {
        if (success) {
          onDone();
        }
      });
    } else {
      createChannel(params).then((success) => {
        if (success) {
          analytics.apiLogPublish(success);
          onDone();
        }
      });
    }
  }

  const LIMIT_ERR_PARTIAL_MSG = 'bad-txns-claimscriptsize-toolarge (code 16)';
  let errorMsg = updateError || createError;
  if (errorMsg && errorMsg.includes(LIMIT_ERR_PARTIAL_MSG)) {
    errorMsg = __('Transaction limit reached. Try reducing the Description length.');
  }
  if ((!isUpload.thumbnail && thumbError) || (!isUpload.cover && coverError)) {
    errorMsg = __('Invalid %error_type%', { error_type: (thumbError && 'thumbnail') || (coverError && 'cover image') });
  }

  React.useEffect(() => {
    let nameError;
    if (!name && name !== undefined) {
      nameError = __('A name is required for your url');
    } else if (!isNameValid(name)) {
      nameError = INVALID_NAME_ERROR;
    }

    setNameError(nameError);
  }, [name]);

  React.useEffect(() => {
    clearChannelErrors();
  }, [clearChannelErrors]);

  React.useEffect(() => {
    if (!hasClaimedInitialRewards) {
      claimInitialRewards();
    }
  }, [hasClaimedInitialRewards, claimInitialRewards]);

  const coverSrc = coverError ? ThumbnailBrokenImage : coverPreview;

  let thumbnailPreview;
  if (!params.thumbnailUrl) {
    thumbnailPreview = Gerbil;
  } else if (thumbError) {
    thumbnailPreview = ThumbnailBrokenImage;
  } else {
    thumbnailPreview = params.thumbnailUrl;
  }

  // TODO clear and bail after submit
  return <>
    <div className={classnames({ 'card--disabled': disabled })}>
      <header className="channel-cover">
        <div className="channel__quick-actions">
          <Button
            // @ts-expect-error - TS2322 (ts-migration)
            button="alt"
            title={__('Cover')}
            onClick={() =>
              openModal(MODALS.IMAGE_UPLOAD, {
// @ts-expect-error - TS2322 - Type '(coverUrl: any, isUpload: any, preview: any) => void' is not assignable to type '(arg1: string, arg2: boolean) => void'.
                onUpdate: (coverUrl, isUpload, preview) => handleCoverChange(coverUrl, isUpload, preview),
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
        {params.coverUrl &&
          (coverError && isUpload.cover ? (
            <div className="channel-cover__custom--waiting">
              <p>{__('Uploaded image will be visible in a few minutes.')}</p>
            </div>
          ) : (
            <img className="channel-cover__custom" src={coverSrc} onError={() => setCoverError(true)} />
          ))}
        <div className="channel__primary-info">
          <div className="channel__edit-thumb">
            <Button
              // @ts-expect-error - TS2322 (ts-migration)
              button="alt"
              title={__('Edit')}
              onClick={() =>
                openModal(MODALS.IMAGE_UPLOAD, {
                  onUpdate: (thumbnailUrl, isUpload) => handleThumbnailChange(thumbnailUrl, isUpload),
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
            thumbnailPreview={thumbnailPreview}
            allowGifs
            setThumbUploadError={setThumbError}
            // @ts-expect-error - TS2322 (ts-migration)
            thumbUploadError={thumbError}
          />
          <h1 className="channel__title">
            {params.title || (channelName && '@' + channelName) || (params.name && '@' + params.name)}
          </h1>
        </div>
        <div className="channel-cover__gradient" />
      </header>

{ /* @ts-expect-error - TS2322 - Type '{ children: Element[]; className: string; }' is not assignable to type 'IntrinsicAttributes & TabsProps'. */}
      <Tabs className="channelPage-wrapper">
{ /* @ts-expect-error - TS2322 - Type '{ children: Element[]; className: string; }' is not assignable to type 'IntrinsicAttributes & TabListProps'. */}
        <TabList className="tabs__list--channel-page">
{ /* @ts-expect-error - TS2559 - Type '{ children: string; }' has no properties in common with type 'IntrinsicAttributes & TabProps'. */}
          <Tab>{__('General')}</Tab>
{ /* @ts-expect-error - TS2559 - Type '{ children: string; }' has no properties in common with type 'IntrinsicAttributes & TabProps'. */}
          <Tab>{__('Credit Details')}</Tab>
{ /* @ts-expect-error - TS2559 - Type '{ children: string; }' has no properties in common with type 'IntrinsicAttributes & TabProps'. */}
          <Tab>{__('Tags')}</Tab>
{ /* @ts-expect-error - TS2559 - Type '{ children: string; }' has no properties in common with type 'IntrinsicAttributes & TabProps'. */}
          <Tab>{__('Other')}</Tab>
        </TabList>
{ /* @ts-expect-error - TS2559 - Type '{ children: Element[]; }' has no properties in common with type 'IntrinsicAttributes & TabPanelsProps'. */}
        <TabPanels>
          <TabPanel>
            <Card
              body={
                <>
{ /* @ts-expect-error - TS2339 - Property 'fieldset-group' does not exist on type 'JSX.IntrinsicElements'. */}
                  <fieldset-group class="fieldset-group--smushed fieldset-group--disabled-prefix">
{ /* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
                    <fieldset-section>
                      <label htmlFor="channel_name">{__('Name')}</label>
                      <div className="form-field__prefix">@</div>
{ /* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
                    </fieldset-section>

                    <FormField
                      autoFocus={isNewChannel}
                      type="text"
                      name="channel_name"
                      placeholder={__('MyAwesomeChannel')}
                      value={params.name || channelName}
                      error={nameError}
                      disabled={!isNewChannel}
                      onChange={(e) => setParams({ ...params, name: e.target.value })}
// @ts-expect-error - TS2322 - Type '{ autoFocus: boolean; type: string; name: string; placeholder: string; value: any; error: any; disabled: boolean; onChange: (e: any) => void; maxLength: number; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
                      maxLength={MAX_NAME_LEN}
                    />
{ /* @ts-expect-error - TS2339 - Property 'fieldset-group' does not exist on type 'JSX.IntrinsicElements'. */}
                  </fieldset-group>
                  {!isNewChannel && <span className="form-field__help">{__('This field cannot be changed.')}</span>}

                  <FormField
                    type="text"
                    name="channel_title2"
                    label={__('Title')}
                    placeholder={__('My Awesome Channel')}
                    value={params.title}
                    onChange={(e) => setParams({ ...params, title: e.target.value })}
// @ts-expect-error - TS2322 - Type '{ type: string; name: string; label: string; placeholder: string; value: any; onChange: (e: any) => void; maxLength: number; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
                    maxLength={MAX_TITLE_LEN}
                  />
                  <FormFieldAreaAdvanced
                    type="markdown"
                    name="content_description2"
                    label={__('Description')}
                    placeholder={__('Description of your content')}
                    value={params.description}
                    onChange={(text) => setParams({ ...params, description: text })}
                    textAreaMaxLength={MAX_DESCRIPTION_LEN}
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
                  label={<LbcSymbol postfix={__('Deposit')} size={14} />}
                  value={params.amount}
                  error={bidError}
// @ts-expect-error - TS2322 - Type 'string' is not assignable to type 'number'.
                  min="0.0"
                  disabled={false}
                  onChange={(event) => handleBidChange(parseFloat(event.target.value))}
                  placeholder={0.1}
                  helper={
                    <>
                      {__('Increasing your deposit can help your channel be discovered more easily.')}
                      <WalletSpendableBalanceHelp inline />
                    </>
                  }
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
                  disableControlTags
                  limitSelect={MAX_TAG_SELECT}
                  tagsPassedIn={params.tags || []}
                  label={__('Selected Tags')}
                  onRemove={(clickedTag) => {
                    const newTags = params.tags.slice().filter((tag) => tag.name !== clickedTag.name);
                    setParams({ ...params, tags: newTags });
                  }}
                  onSelect={(newTags) => {
                    // @ts-expect-error - TS2339 (ts-migration)
                    newTags.forEach((newTag) => {
                      if (!params.tags.map((savedTag) => savedTag.name).includes(newTag.name)) {
                        setParams({ ...params, tags: [...params.tags, newTag] });
                      } else {
                        // If it already exists and the user types it in, remove it
                        setParams({ ...params, tags: params.tags.filter((tag) => tag.name !== newTag.name) });
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
                    onChange={(e) => setParams({ ...params, website: e.target.value })}
                  />
                  <FormField
                    type="text"
                    name="content_email2"
                    label={__('Email')}
                    placeholder={__('yourstruly@example.com')}
                    disabled={false}
                    value={params.email}
                    onChange={(e) => setParams({ ...params, email: e.target.value })}
                  />
                  <FormField
                    name="language_select"
                    type="select"
                    label={__('Primary Language')}
                    onChange={(event) => handleLanguageChange(0, event.target.value)}
                    value={primaryLanguage}
                    helper={__('Your main content language')}
                  >
                    <option key={'pri-langNone'} value={LANG_NONE}>
                      {__('None selected')}
                    </option>
                    {sortLanguageMap(SUPPORTED_LANGUAGES).map(([langKey, langName]: [any, any]) => (
                      <option key={langKey} value={langKey}>
                        {langName}
                      </option>
                    ))}
                  </FormField>
                  <FormField
                    name="language_select2"
                    type="select"
                    label={__('Secondary Language')}
                    onChange={(event) => handleLanguageChange(1, event.target.value)}
                    value={secondaryLanguage}
                    disabled={!languageParam[0]}
                    helper={__('Your other content language')}
                  >
                    <option key={'sec-langNone'} value={LANG_NONE}>
                      {__('None selected')}
                    </option>
                    {sortLanguageMap(SUPPORTED_LANGUAGES).map(([langKey, langName]: [any, any]) => (
                      <option key={langKey} value={langKey} disabled={langKey === languageParam[0]}>
                        {langName}
                      </option>
                    ))}
                  </FormField>
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
              {/* @ts-expect-error - TS2322 (ts-migration) */}
              <Button button="primary" disabled={submitDisabled} label={submitLabel} onClick={handleSubmit} />
              {/* @ts-expect-error - TS2322 (ts-migration) */}
              <Button button="link" label={__('Cancel')} onClick={onDone} />
            </div>
            {errorMsg ? (
              <ErrorText>{errorMsg}</ErrorText>
            ) : (
              <p className="help">
                {__('After submitting, it will take a few minutes for your changes to be live for everyone.')}
              </p>
            )}
            {!isNewChannel && (
              <div className="section__actions">
                {/* @ts-expect-error - TS2322 (ts-migration) */}
                <ClaimAbandonButton uri={uri} abandonActionCallback={() => replace(`/$/${PAGES.CHANNELS}`)} />
              </div>
            )}
          </>
        }
      />
    </div>
  </>;
}

export default ChannelForm;
