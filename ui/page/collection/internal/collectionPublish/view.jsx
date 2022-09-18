// @flow
import React from 'react';
import Button from 'component/button';
import TagsSearch from 'component/tagsSearch';
import ErrorText from 'component/common/error-text';
import ClaimAbandonButton from 'component/claimAbandonButton';
import CollectionItemsList from 'component/collectionItemsList';
import Card from 'component/common/card';
import { useHistory } from 'react-router-dom';
import { isNameValid } from 'util/lbryURI';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'component/common/tabs';
import { FormField } from 'component/common/form';
import { handleBidChange, handleLanguageChange } from 'util/publish';
import { INVALID_NAME_ERROR } from 'constants/claim';
import SUPPORTED_LANGUAGES from 'constants/supported_languages';
import * as PAGES from 'constants/pages';
import * as PUBLISH from 'constants/publish';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import analytics from 'analytics';
import CollectionGeneralTab from 'component/collectionGeneralTab';
import PublishBidTab from 'component/publishBidField';
import Spinner from 'component/spinner';
import BusyIndicator from 'component/common/busy-indicator';

export const PAGE_TAB_QUERY = `tab`;
const MAX_TAG_SELECT = 5;

const TAB = {
  GENERAL: 0,
  ITEMS: 1,
  CREDITS: 2,
  TAGS: 3,
  OTHER: 4,
};

type Props = {
  uri: string, // collection uri
  collectionId: string,
  // -- redux -
  hasClaim: boolean,
  balance: number,
  amount: number,
  collection: Collection,
  collectionParams: CollectionPublishParams,
  collectionClaimIds: Array<string>,
  updatingCollection: boolean,
  creatingCollection: boolean,
  activeChannelClaim: ?ChannelClaim,
  doCollectionPublishUpdate: (CollectionUpdateParams) => Promise<any>,
  doCollectionPublish: (CollectionPublishParams, string) => Promise<any>,
  // onPreSubmit: Hook to allow clients to change/finalize the params before the form is submitted.
  onPreSubmit: (params: {}) => {},
  onDone: (string) => void,
};

function CollectionForm(props: Props) {
  const {
    uri,
    collectionId,
    // -- redux -
    hasClaim,
    balance,
    amount,
    collection,
    collectionParams,
    collectionClaimIds,
    updatingCollection,
    creatingCollection,
    activeChannelClaim,
    doCollectionPublishUpdate,
    doCollectionPublish,
    onPreSubmit,
    onDone,
  } = props;

  const { replace } = useHistory();

  const [nameError, setNameError] = React.useState(undefined);
  const [thumbailError, setThumbnailError] = React.useState('');
  const [bidError, setBidError] = React.useState('');
  const [params, setParams] = React.useState({});
  const [tabIndex, setTabIndex] = React.useState(0);
  const [showItemsSpinner, setShowItemsSpinner] = React.useState(false);

  const { name, languages, claims, tags } = params;

  const isBuiltin = COLLECTIONS_CONSTS.BUILTIN_PLAYLISTS.includes(collectionId);
  const isNewCollection = !uri;
  const languageParam = languages || [];
  const primaryLanguage = Array.isArray(languageParam) && languageParam.length && languageParam[0];
  const secondaryLanguage = Array.isArray(languageParam) && languageParam.length >= 2 && languageParam[1];
  const hasClaims = claims && claims.length;
  const collectionClaimIdsString = JSON.stringify(collectionClaimIds);
  const itemError = !hasClaims ? __('Cannot publish empty list') : '';
  const submitError = nameError || bidError || itemError || thumbailError;

  function updateParams(newParams) {
    // $FlowFixMe
    setParams({ ...params, ...newParams });
  }

  function handleSubmit() {
    const finalParams = onPreSubmit ? onPreSubmit(params) : params;

    if (uri) {
      // $FlowFixMe
      doCollectionPublishUpdate(finalParams).then((pendingClaim) => {
        if (pendingClaim) {
          const claimId = pendingClaim.claim_id;
          analytics.apiLog.publish(pendingClaim);
          onDone(claimId);
        }
      });
    } else {
      // $FlowFixMe
      doCollectionPublish(finalParams, collectionId).then((pendingClaim) => {
        if (pendingClaim) {
          const claimId = pendingClaim.claim_id;
          analytics.apiLog.publish(pendingClaim);
          onDone(claimId);
        }
      });
    }
  }

  React.useEffect(() => {
    const collectionClaimIds = JSON.parse(collectionClaimIdsString);
    // $FlowFixMe
    updateParams({ claims: collectionClaimIds });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionClaimIdsString]);

  React.useEffect(() => {
    let nameError;
    if (!name && name !== undefined) {
      nameError = __('A name is required for your url');
    } else if (!isNameValid(name)) {
      nameError = INVALID_NAME_ERROR;
    }

    setNameError(nameError);
  }, [name]);

  // setup initial params after we're sure if it's published or not
  React.useEffect(() => {
    if (!uri || (uri && hasClaim)) {
      updateParams(collectionParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uri, hasClaim]);

  function onTabChange(newTabIndex) {
    if (tabIndex !== newTabIndex) {
      if (newTabIndex === TAB.ITEMS) {
        setShowItemsSpinner(true);
        setTimeout(() => {
          // Wait enough time for the spinner to appear, then switch tabs.
          setTabIndex(newTabIndex);
          // We can stop the spinner immediately. If the list takes a long time
          // to render, the spinner would continue to spin until the
          // state-change is flushed.
          setShowItemsSpinner(false);
        }, 250);
      } else {
        setTabIndex(newTabIndex);
      }
    }
  }

  return (
    <div className="main--contained publishList-wrapper">
      <Tabs onChange={onTabChange} index={tabIndex}>
        <TabList className="tabs__list--collection-edit-page">
          <Tab>{__('General')}</Tab>
          <Tab>{__('Items')}</Tab>
          <Tab>{__('Credits')}</Tab>
          <Tab>{__('Tags')}</Tab>
          <Tab>
            {__('Other')}
            {showItemsSpinner && <Spinner type="small" />}
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {tabIndex === TAB.GENERAL && (
              <CollectionGeneralTab
                uri={uri}
                params={params}
                nameError={nameError}
                setThumbnailError={setThumbnailError}
                updateParams={updateParams}
                collectionType={collection?.type}
              />
            )}
          </TabPanel>

          <TabPanel>
            {tabIndex === TAB.ITEMS && (
              <CollectionItemsList collectionId={collectionId} empty={__('This playlist has no items.')} showEdit />
            )}
          </TabPanel>

          <TabPanel>
            {tabIndex === TAB.CREDITS && (
              <PublishBidTab
                params={params}
                bidError={bidError}
                onChange={(event) =>
                  handleBidChange(parseFloat(event.target.value), amount, balance, setBidError, updateParams)
                }
              />
            )}
          </TabPanel>

          <TabPanel>
            {tabIndex === TAB.TAGS && (
              <Card
                body={
                  <TagsSearch
                    suggestMature
                    disableAutoFocus
                    limitSelect={MAX_TAG_SELECT}
                    tagsPassedIn={tags || []}
                    label={__('Selected Tags')}
                    onRemove={(clickedTag) => {
                      // $FlowFixMe
                      const newTags = tags.slice().filter((tag) => tag.name !== clickedTag.name);
                      updateParams({ tags: newTags });
                    }}
                    onSelect={(newTags) => {
                      tags &&
                        newTags.forEach((newTag) => {
                          // $FlowFixMe
                          if (!tags.map((savedTag) => savedTag.name).includes(newTag.name)) {
                            // $FlowFixMe
                            updateParams({ tags: [...tags, newTag] });
                          } else {
                            // If it already exists and the user types it in, remove itit
                            // $FlowFixMe
                            updateParams({ tags: tags.filter((tag) => tag.name !== newTag.name) });
                          }
                        });
                    }}
                  />
                }
              />
            )}
          </TabPanel>

          <TabPanel>
            {tabIndex === TAB.OTHER && (
              <Card
                body={
                  <>
                    <FormField
                      name="language_select"
                      type="select"
                      label={__('Primary Language')}
                      onChange={(event) =>
                        handleLanguageChange(0, event.target.value, languageParam, setParams, params)
                      }
                      value={primaryLanguage}
                      helper={__('Your main content language')}
                    >
                      <option key={'pri-langNone'} value={PUBLISH.LANG_NONE}>
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
                      onChange={(event) =>
                        handleLanguageChange(1, event.target.value, languageParam, setParams, params)
                      }
                      value={secondaryLanguage}
                      disabled={!languageParam[0]}
                      helper={__('Your other content language')}
                    >
                      <option key={'sec-langNone'} value={PUBLISH.LANG_NONE}>
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
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {activeChannelClaim !== undefined && (
        <Card
          className="card--after-tabs"
          actions={
            <>
              <div className="section__actions">
                <Button
                  button="primary"
                  disabled={isBuiltin || creatingCollection || updatingCollection || Boolean(submitError) || !hasClaims}
                  label={
                    creatingCollection || updatingCollection ? (
                      <BusyIndicator message={__('Submitting')} />
                    ) : (
                      __('Submit')
                    )
                  }
                  onClick={handleSubmit}
                />
                <Button button="link" label={__('Cancel')} onClick={() => onDone(collectionId)} />
              </div>

              {submitError || isBuiltin ? (
                <ErrorText>{submitError || (isBuiltin && __("Can't publish default playlists."))}</ErrorText>
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
      )}
    </div>
  );
}

export default CollectionForm;
