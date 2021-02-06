// @flow
import { DOMAIN } from 'config';
import React from 'react';
import classnames from 'classnames';
import Button from 'component/button';
import TagsSearch from 'component/tagsSearch';
import ErrorText from 'component/common/error-text';
import ClaimAbandonButton from 'component/claimAbandonButton';
import ChannelSelector from 'component/channelSelector';
import ClaimList from 'component/claimList';
import Card from 'component/common/card';
import LbcSymbol from 'component/common/lbc-symbol';
import ThumbnailPicker from 'component/thumbnailPicker';
import { useHistory } from 'react-router-dom';
import { isNameValid, regexInvalidURI } from 'lbry-redux';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'component/common/tabs';
import { FormField } from 'component/common/form';
import { handleBidChange } from 'util/publish';
import { FF_MAX_CHARS_IN_DESCRIPTION } from 'constants/form-field';
import { INVALID_NAME_ERROR } from 'constants/claim';
import SUPPORTED_LANGUAGES from 'constants/supported_languages';
import * as PAGES from 'constants/pages';
import analytics from 'analytics';
const LANG_NONE = 'none';
const MAX_TAG_SELECT = 5;

type Props = {
  uri: string,
  claim: CollectionClaim,
  balance: number,
  disabled: boolean,
  activeChannelClaim: ?ChannelClaim,
  incognito: boolean,
  // params
  title: string,
  amount: number,
  thumbnailUrl: string,
  description: string,
  tags: Array<string>,
  locations: Array<string>,
  languages: Array<string>,

  collectionId: string,
  collection: Collection,
  collectionClaimIds: Array<string>,
  collectionUrls: Array<string>,
  publishCollectionUpdate: (CollectionUpdateParams) => Promise<any>,
  updatingCollection: boolean,
  updateError: string,
  publishCollection: (CollectionPublishParams, string) => Promise<any>,
  createError: string,
  creatingCollection: boolean,
  clearCollectionErrors: () => void,
  onDone: (string) => void,
  openModal: (
    id: string,
    { onUpdate: (string) => void, assetName: string, helpText: string, currentValue: string, title: string }
  ) => void,
};

function CollectionForm(props: Props) {
  const {
    uri, // collection uri
    claim,
    balance,
    // publish params
    amount,
    title,
    description,
    thumbnailUrl,
    tags,
    locations,
    languages = [],
    // rest
    onDone,
    publishCollectionUpdate,
    updateError,
    updatingCollection,
    publishCollection,
    creatingCollection,
    createError,
    disabled,
    activeChannelClaim,
    incognito,
    collectionId,
    collection,
    collectionUrls,
    collectionClaimIds,
  } = props;
  const activeChannelName = activeChannelClaim && activeChannelClaim.name;
  let prefix = IS_WEB ? `${DOMAIN}/` : 'lbry://';
  if (activeChannelName && !incognito) {
    prefix += `${activeChannelName}/`;
  }
  const activeChannelId = activeChannelClaim && activeChannelClaim.claim_id;
  const collectionName = (claim && claim.name) || (collection && collection.name);

  const [nameError, setNameError] = React.useState(undefined);
  const [bidError, setBidError] = React.useState('');
  const [params, setParams]: [any, (any) => void] = React.useState(getCollectionParams());
  const name = params.name;
  const isNewCollection = !uri;
  const { replace } = useHistory();
  const languageParam = params.languages;
  const primaryLanguage = Array.isArray(languageParam) && languageParam.length && languageParam[0];
  const secondaryLanguage = Array.isArray(languageParam) && languageParam.length >= 2 && languageParam[1];

  const collectionClaimIdsString = JSON.stringify(collectionClaimIds);

  function parseName(newName) {
    let INVALID_URI_CHARS = new RegExp(regexInvalidURI, 'gu');
    return newName.replace(INVALID_URI_CHARS, '-');
  }

  function setParam(paramObj) {
    setParams({ ...params, ...paramObj });
  }

  function getCollectionParams() {
    const collectionParams: {
      thumbnail_url?: string,
      name?: string,
      description?: string,
      title?: string,
      bid: string,
      languages?: ?Array<string>,
      locations?: ?Array<string>,
      tags?: ?Array<{ name: string }>,
      claim_id?: string,
      channel_id?: string,
      claims: ?Array<string>,
    } = {
      thumbnail_url: thumbnailUrl,
      description,
      bid: String(amount || 0.001),
      languages: languages || [],
      locations: locations || [],
      tags: tags
        ? tags.map((tag) => {
            return { name: tag };
          })
        : [],
      claims: collectionClaimIds,
    };
    collectionParams['name'] = parseName(collectionName);

    if (activeChannelId) {
      collectionParams['channel_id'] = activeChannelId;
    }

    if (!claim) {
      collectionParams['title'] = collectionName;
    }

    if (claim) {
      collectionParams['claim_id'] = claim.claim_id;
      collectionParams['title'] = title;
    }

    return collectionParams;
  }

  React.useEffect(() => {
    const collectionClaimIds = JSON.parse(collectionClaimIdsString);
    setParams({ ...params, claims: collectionClaimIds });
  }, [collectionClaimIdsString, setParams]);

  function handleLanguageChange(index, code) {
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
        langs[index] = code;
      }
    }
    setParams({ ...params, languages: langs });
  }

  function handleThumbnailChange(thumbnailUrl: string) {
    setParams({ ...params, thumbnail_url: thumbnailUrl });
  }

  function handleSubmit() {
    if (uri) {
      publishCollectionUpdate(params).then((pendingClaim) => {
        if (pendingClaim) {
          const claimId = pendingClaim.claim_id;
          analytics.apiLogPublish(pendingClaim);
          onDone(claimId);
        }
      });
    } else {
      publishCollection(params, collectionId).then((pendingClaim) => {
        if (pendingClaim) {
          const claimId = pendingClaim.claim_id;
          analytics.apiLogPublish(pendingClaim);
          onDone(claimId);
        }
      });
    }
  }

  React.useEffect(() => {
    let nameError;
    if (!name && name !== undefined) {
      nameError = __('A name is required for your url');
    } else if (!isNameValid(name, false)) {
      nameError = INVALID_NAME_ERROR;
    }

    setNameError(nameError);
  }, [name]);

  React.useEffect(() => {
    if (incognito) {
      const newParams = Object.assign({}, params);
      delete newParams.channel_id;
      setParams(newParams);
    } else if (activeChannelId) {
      setParams({ ...params, channel_id: activeChannelId });
    }
  }, [activeChannelId, incognito, setParams]);
  const itemError = !params.claims.length ? __('Cannot publish empty collection') : '';
  const submitError = nameError || bidError || itemError || updateError || createError;

  return (
    <>
      <div className={classnames('main--contained', { 'card--disabled': disabled })}>
        <Tabs>
          <TabList className="tabs__list--channel-page">
            <Tab>{__('General')}</Tab>
            <Tab>{__('Items')}</Tab>
            <Tab>{__('Credits')}</Tab>
            <Tab>{__('Tags')}</Tab>
            <Tab>{__('Other')}</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <div className={'card-stack'}>
                <ChannelSelector disabled={disabled} />
                <Card
                  body={
                    <>
                      <fieldset-group className="fieldset-group--smushed fieldset-group--disabled-prefix">
                        <fieldset-section>
                          <label htmlFor="channel_name">{__('Channel')}</label>
                        </fieldset-section>
                      </fieldset-group>
                      <fieldset-group class="fieldset-group--smushed fieldset-group--disabled-prefix">
                        <fieldset-section>
                          <label htmlFor="channel_name">{__('Name')}</label>
                          <div className="form-field__prefix">{prefix}</div>
                        </fieldset-section>

                        <FormField
                          autoFocus={isNewCollection}
                          type="text"
                          name="channel_name"
                          placeholder={__('MyAwesomeCollection')}
                          value={params.name}
                          error={nameError}
                          disabled={!isNewCollection}
                          onChange={(e) => setParams({ ...params, name: e.target.value || '' })}
                        />
                      </fieldset-group>
                      {!isNewCollection && (
                        <span className="form-field__help">{__('This field cannot be changed.')}</span>
                      )}

                      <FormField
                        type="text"
                        name="channel_title2"
                        label={__('Title')}
                        placeholder={__('My Awesome Collection')}
                        value={params.title}
                        onChange={(e) => setParams({ ...params, title: e.target.value })}
                      />
                      <ThumbnailPicker
                        inline
                        thumbnailParam={params.thumbnail_url}
                        updateThumbnailParam={handleThumbnailChange}
                      />
                      <FormField
                        type="markdown"
                        name="content_description2"
                        label={__('Description')}
                        placeholder={__('Description of your content')}
                        value={params.description}
                        onChange={(text) => setParams({ ...params, description: text })}
                        textAreaMaxLength={FF_MAX_CHARS_IN_DESCRIPTION}
                      />
                    </>
                  }
                />
              </div>
            </TabPanel>
            <TabPanel>
              <ClaimList
                uris={collectionUrls}
                collectionId={collectionId}
                empty={__('This collection has no items.')}
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
                    value={params.bid}
                    error={bidError}
                    min="0.0"
                    disabled={false}
                    onChange={(event) =>
                      handleBidChange(parseFloat(event.target.value), amount, balance, setBidError, setParam)
                    }
                    placeholder={0.1}
                    helper={__('Increasing your deposit can help your channel be discovered more easily.')}
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
                    limitSelect={MAX_TAG_SELECT}
                    tagsPassedIn={params.tags || []}
                    label={__('Selected Tags')}
                    onRemove={(clickedTag) => {
                      const newTags = params.tags.slice().filter((tag) => tag.name !== clickedTag.name);
                      setParams({ ...params, tags: newTags });
                    }}
                    onSelect={(newTags) => {
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
                      {Object.keys(SUPPORTED_LANGUAGES).map((language) => (
                        <option key={language} value={language}>
                          {SUPPORTED_LANGUAGES[language]}
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
                      {Object.keys(SUPPORTED_LANGUAGES)
                        .filter((lang) => lang !== languageParam[0])
                        .map((language) => (
                          <option key={language} value={language}>
                            {SUPPORTED_LANGUAGES[language]}
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
                <Button
                  button="primary"
                  disabled={creatingCollection || updatingCollection || nameError || bidError || !params.claims.length}
                  label={creatingCollection || updatingCollection ? __('Submitting') : __('Submit')}
                  onClick={handleSubmit}
                />
                <Button button="link" label={__('Cancel')} onClick={() => onDone(collectionId)} />
              </div>
              {submitError ? (
                <ErrorText>{submitError}</ErrorText>
              ) : (
                <p className="help">
                  {__('After submitting, it will take a few minutes for your changes to be live for everyone.')}
                </p>
              )}
              {!isNewCollection && (
                <div className="section__actions">
                  <ClaimAbandonButton uri={uri} abandonActionCallback={() => replace(`/$/${PAGES.LIBRARY}`)} />
                </div>
              )}
            </>
          }
        />
      </div>
    </>
  );
}

export default CollectionForm;
