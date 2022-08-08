// @flow
import React from 'react';
import Button from 'component/button';
import CollectionItemsList from 'component/collectionItemsList';
import Card from 'component/common/card';
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import Tooltip from 'component/common/tooltip';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'component/common/tabs';
import { useHistory } from 'react-router-dom';
import CollectionGeneralTab from 'component/collectionGeneralTab';
import ErrorText from 'component/common/error-text';

type Props = {
  collectionId: string,
  // -- redux -
  collection: Collection,
  collectionUrls: Array<string>,
  collectionHasEdits: boolean,
  doCollectionEdit: (id: string, params: CollectionEditParams) => void,
  doClearEditsForCollectionId: (id: string) => void,
  doOpenModal: (id: string, params: {}) => void,
};

function CollectionForm(props: Props) {
  const {
    collectionId,
    // -- redux -
    collection,
    collectionUrls,
    collectionHasEdits,
    doCollectionEdit,
    doClearEditsForCollectionId,
    doOpenModal,
  } = props;

  const { goBack } = useHistory();

  const collectionResetPending = React.useRef(false);
  const isBuiltin = COLLECTIONS_CONSTS.BUILTIN_PLAYLISTS.includes(collectionId);

  const { name, description, thumbnail } = collection || {};
  const initialParams = React.useRef({
    uris: collectionUrls,
    name,
    description,
    thumbnail,
  });

  const [thumbailError, setThumbnailError] = React.useState('');
  const [params, setParams] = React.useState(initialParams.current);

  function updateParams(newParams) {
    // $FlowFixMe
    setParams({ ...params, ...newParams });
  }

  function handleSubmit() {
    doCollectionEdit(collectionId, params);
    goBack();
  }

  React.useEffect(() => {
    if (collection && collectionResetPending.current) {
      const resetParams = {
        uris: collectionUrls,
        name,
        description,
        thumbnail,
      };

      setParams(resetParams);
      initialParams.current = resetParams;
      collectionResetPending.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  return (
    <div className="main--contained publishList-wrapper">
      <Tabs>
        <TabList className="tabs__list--collection-edit-page">
          <Tab>{__('General')}</Tab>
          <Tab>{__('Items')}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <CollectionGeneralTab
              params={params}
              setThumbnailError={setThumbnailError}
              updateParams={updateParams}
              isPrivateEdit
              collectionType={collection?.type}
            />
          </TabPanel>

          <TabPanel>
            <CollectionItemsList collectionId={collectionId} empty={__('This playlist has no items.')} showEdit />
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
                label={__('Submit')}
                disabled={isBuiltin || thumbailError || params === initialParams.current}
                onClick={handleSubmit}
              />
              <Button button="link" label={__('Cancel')} onClick={goBack} />
            </div>

            {collectionHasEdits && (
              <Tooltip title={__('Delete all edits from this published playlist')}>
                <Button
                  button="close"
                  icon={ICONS.REFRESH}
                  label={__('Clear Updates')}
                  onClick={() =>
                    doOpenModal(MODALS.CONFIRM, {
                      title: __('Clear Updates'),
                      subtitle: __(
                        "Are you sure you want to delete all edits from this published playlist? (You won't be able to undo this action later)"
                      ),
                      onConfirm: (closeModal) => {
                        doClearEditsForCollectionId(collectionId);
                        collectionResetPending.current = true;
                        closeModal();
                      },
                    })
                  }
                />
              </Tooltip>
            )}

            {(thumbailError || isBuiltin) && (
              <ErrorText>{thumbailError || (isBuiltin && __("Can't edit default playlists."))}</ErrorText>
            )}

            <p className="help">{__('After submitting, all changes will remain private.')}</p>
          </>
        }
      />
    </div>
  );
}

export default CollectionForm;
