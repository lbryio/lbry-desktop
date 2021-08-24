// @flow
import React from 'react';
import type { ElementRef } from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import { FormField } from 'component/common/form';
import * as ICONS from 'constants/icons';
import CollectionSelectItem from 'component/collectionSelectItem';

type Props = {
  claim: Claim,
  builtin: any,
  published: any,
  unpublished: any,
  addCollection: (string, Array<string>, string) => void,
  editCollection: (string, {}) => void,
  closeModal: () => void,
  uri: string,
  collectionId: string,
  doResolveUris: (Array<string>) => void,
  items: Array<string>,
  itemsClaims: Array<string>,
};

const ClaimCollectionAdd = (props: Props) => {
  const {
    builtin,
    published,
    unpublished,
    addCollection,
    editCollection,
    claim,
    closeModal,
    uri,
    doResolveUris,
    items,
    itemsClaims,
  } = props;
  const buttonref: ElementRef<any> = React.useRef();
  const permanentUrl = claim && claim.permanent_url;
  const isChannel = claim && claim.value_type === 'channel';
  const [selectedCollections, setSelectedCollections] = React.useState([]);
  const [addNewCollection, setAddNewCollection] = React.useState(false);
  const [newCollectionName, setNewCollectionName] = React.useState('');

  // TODO: when other collection types added, filter list in context
  // const isPlayable =
  //   claim &&
  //   claim.value &&
  //   // $FlowFixMe
  //   claim.value.stream_type &&
  //   (claim.value.stream_type === 'audio' || claim.value.stream_type === 'video');

  React.useEffect(() => {
    if (items) {
      doResolveUris(items);
    }
  }, [doResolveUris, items]);

  function handleNameInput(e) {
    const { value } = e.target;
    setNewCollectionName(value);
  }

  function handleAddCollection() {
    addCollection(newCollectionName, items || [permanentUrl], isChannel ? 'collection' : 'playlist');
    if (items) setSelectedCollections([...selectedCollections, newCollectionName]);
    setNewCollectionName('');
    setAddNewCollection(false);
  }

  function handleEditCollection() {
    if (selectedCollections) {
      selectedCollections.map((id) => {
        editCollection(id, { claims: itemsClaims, remove: false });
      });
    }
  }

  function altEnterListener(e: SyntheticKeyboardEvent<*>) {
    const KEYCODE_ENTER = 13;
    if (e.keyCode === KEYCODE_ENTER) {
      e.preventDefault();
      buttonref.current.click();
    }
  }

  function onTextareaFocus() {
    window.addEventListener('keydown', altEnterListener);
  }

  function onTextareaBlur() {
    window.removeEventListener('keydown', altEnterListener);
  }

  function handleClearNew() {
    setNewCollectionName('');
    setAddNewCollection(false);
  }

  return (
    <Card
      title={__('Add To...')}
      actions={
        <div className="card__body">
          {(uri || items) && (
            <fieldset-section>
              <div className={'card__body-scrollable'}>
                {(Object.values(builtin): any)
                  // $FlowFixMe
                  .filter((list) => (isChannel ? list.type === 'collection' : list.type === 'playlist'))
                  .map((l) => {
                    const { id } = l;
                    return (
                      <CollectionSelectItem
                        claim={claim}
                        collectionId={id}
                        uri={permanentUrl}
                        key={id}
                        category={'builtin'}
                        setSelectedCollections={setSelectedCollections}
                        selectedCollections={selectedCollections}
                        items={items}
                      />
                    );
                  })}
                {unpublished &&
                  (Object.values(unpublished): any)
                    // $FlowFixMe
                    .filter((list) => (isChannel ? list.type === 'collection' : list.type === 'playlist'))
                    .map((l) => {
                      const { id } = l;
                      return (
                        <CollectionSelectItem
                          claim={claim}
                          collectionId={id}
                          uri={permanentUrl}
                          key={id}
                          category={'unpublished'}
                          setSelectedCollections={setSelectedCollections}
                          selectedCollections={selectedCollections}
                          items={items}
                        />
                      );
                    })}
                {published &&
                  (Object.values(published): any).map((l) => {
                    // $FlowFixMe
                    const { id } = l;
                    return (
                      <CollectionSelectItem
                        claim={claim}
                        collectionId={id}
                        uri={permanentUrl}
                        key={id}
                        category={'published'}
                        setSelectedCollections={setSelectedCollections}
                        selectedCollections={selectedCollections}
                        items={items}
                      />
                    );
                  })}
              </div>
            </fieldset-section>
          )}
          <fieldset-section>
            {addNewCollection && (
              <FormField
                autoFocus
                type="text"
                name="new_collection"
                value={newCollectionName}
                label={__('New List Title')}
                onFocus={onTextareaFocus}
                onBlur={onTextareaBlur}
                inputButton={
                  <>
                    <Button
                      button={'alt'}
                      icon={ICONS.ADD}
                      className={'button-toggle'}
                      disabled={!newCollectionName.length}
                      onClick={() => handleAddCollection()}
                      ref={buttonref}
                    />
                    <Button
                      button={'alt'}
                      className={'button-toggle'}
                      icon={ICONS.REMOVE}
                      onClick={() => handleClearNew()}
                    />
                  </>
                }
                onChange={handleNameInput}
              />
            )}
            {!addNewCollection && (
              <Button button={'link'} label={__('New List')} onClick={() => setAddNewCollection(true)} />
            )}
          </fieldset-section>
          <div className="card__actions">
            <Button
              button="secondary"
              label={__('Done')}
              disabled={addNewCollection}
              onClick={() => {
                if (items) {
                  handleEditCollection();
                }
                closeModal();
              }}
            />
          </div>
        </div>
      }
    />
  );
};
export default ClaimCollectionAdd;
