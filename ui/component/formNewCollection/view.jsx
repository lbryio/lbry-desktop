// @flow
import React from 'react';
import type { ElementRef } from 'react';
import * as ICONS from 'constants/icons';
import * as KEYCODES from 'constants/keycodes';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import { FormField } from 'component/common/form';
import { useHistory } from 'react-router';
import { formatLbryUrlForWeb } from 'util/url';
import Button from 'component/button';

type Props = {
  uri?: string,
  sourceId?: string,
  onlyCreate?: boolean,
  closeForm: (newCollectionName?: string, newCollectionId?: string) => void,
  // -- redux --
  sourceCollectionName?: string,
  doPlaylistAddAndAllowPlaying: (params: {
    uri?: string,
    collectionName: string,
    createNew: boolean,
    push: (uri: string) => void,
  }) => void,
};

function FormNewCollection(props: Props) {
  const { uri, sourceId, onlyCreate, closeForm, sourceCollectionName, doPlaylistAddAndAllowPlaying } = props;

  const {
    push,
    location: { search },
  } = useHistory();

  const buttonref: ElementRef<any> = React.useRef();

  const [newCollectionName, setCollectionName] = React.useState(
    sourceCollectionName ? __('%copied_playlist_name% (copy)', { copied_playlist_name: sourceCollectionName }) : ''
  );

  function handleNameInput(e) {
    const { value } = e.target;
    setCollectionName(value);
  }

  function handleAddCollection() {
    const name = newCollectionName;
    let id;

    const urlParams = new URLSearchParams(search);
    urlParams.set(COLLECTIONS_CONSTS.COLLECTION_ID, COLLECTIONS_CONSTS.WATCH_LATER_ID);

    doPlaylistAddAndAllowPlaying({
      uri,
      collectionName: name,
      sourceId,
      createNew: true,
      push: (pushUri) =>
        push({
          pathname: formatLbryUrlForWeb(pushUri),
          search: urlParams.toString(),
          state: { collectionId: COLLECTIONS_CONSTS.WATCH_LATER_ID, forceAutoplay: true },
        }),
      createCb: !sourceId
        ? undefined
        : (newId) => {
            id = newId;
          },
    });

    closeForm(name, id);
  }

  function altEnterListener(e: SyntheticKeyboardEvent<*>) {
    if (e.keyCode === KEYCODES.ENTER) {
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
    closeForm();
  }

  return (
    <FormField
      autoFocus
      type="text"
      name="new_collection"
      label={__('New Playlist Title')}
      placeholder={__(COLLECTIONS_CONSTS.PLACEHOLDER)}
      onFocus={onTextareaFocus}
      onBlur={onTextareaBlur}
      inputButton={
        <>
          <Button
            button="alt"
            icon={ICONS.COMPLETED}
            title={__('Confirm')}
            className="button-toggle"
            disabled={newCollectionName.length === 0}
            onClick={handleAddCollection}
            ref={buttonref}
          />
          {!onlyCreate && (
            <Button
              button="alt"
              className="button-toggle"
              icon={ICONS.REMOVE}
              title={__('Cancel')}
              onClick={handleClearNew}
            />
          )}
        </>
      }
      onChange={handleNameInput}
      value={newCollectionName}
    />
  );
}

export default FormNewCollection;
