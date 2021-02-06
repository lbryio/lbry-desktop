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
  closeModal: () => void,
  uri: string,
};

const ClaimCollectionAdd = (props: Props) => {
  const { builtin, published, unpublished, addCollection, claim, closeModal, uri } = props;
  const buttonref: ElementRef<any> = React.useRef();
  const permanentUrl = claim && claim.permanent_url;
  const isChannel = claim && claim.value_type === 'channel';

  const [addNewCollection, setAddNewCollection] = React.useState(false);
  const [newCollectionName, setNewCollectionName] = React.useState('');

  // TODO: when other collection types added, filter list in context
  // const isPlayable =
  //   claim &&
  //   claim.value &&
  //   // $FlowFixMe
  //   claim.value.stream_type &&
  //   (claim.value.stream_type === 'audio' || claim.value.stream_type === 'video');

  function handleNameInput(e) {
    const { value } = e.target;
    setNewCollectionName(value);
  }

  function handleAddCollection() {
    addCollection(newCollectionName, [permanentUrl], isChannel ? 'collection' : 'playlist');
    setNewCollectionName('');
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

  return (
    <Card
      title={__('Add To...')}
      actions={
        <div className="card__body">
          {uri && (
            <fieldset-section>
              <div className={'card__body-scrollable'}>
                {(Object.values(builtin): any)
                  // $FlowFixMe
                  .filter((list) => (isChannel ? list.type === 'collection' : list.type === 'playlist'))
                  .map((l) => {
                    const { id } = l;
                    return <CollectionSelectItem collectionId={id} uri={permanentUrl} key={id} category={'builtin'} />;
                  })}
                {unpublished &&
                  (Object.values(unpublished): any)
                    // $FlowFixMe
                    .filter((list) => (isChannel ? list.type === 'collection' : list.type === 'playlist'))
                    .map((l) => {
                      const { id } = l;
                      return (
                        <CollectionSelectItem collectionId={id} uri={permanentUrl} key={id} category={'unpublished'} />
                      );
                    })}
                {published &&
                  (Object.values(published): any).map((l) => {
                    // $FlowFixMe
                    const { id } = l;
                    return (
                      <CollectionSelectItem collectionId={id} uri={permanentUrl} key={id} category={'published'} />
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
                label={'New List Title'}
                onFocus={onTextareaFocus}
                onBlur={onTextareaBlur}
                inputButton={
                  <Button
                    button={'secondary'}
                    icon={ICONS.ADD}
                    disabled={!newCollectionName.length}
                    onClick={() => handleAddCollection()}
                    ref={buttonref}
                  />
                }
                onChange={handleNameInput}
              />
            )}
            {!addNewCollection && (
              <Button button={'link'} label={'New List'} onClick={() => setAddNewCollection(true)} />
            )}
          </fieldset-section>
          <div className="card__actions">
            <Button button="secondary" label={__('Done')} onClick={closeModal} />
          </div>
        </div>
      }
    />
  );
};
export default ClaimCollectionAdd;
