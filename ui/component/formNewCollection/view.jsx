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
  uri: string,
  onlyCreate?: boolean,
  closeForm: (newCollectionName?: string) => void,
  // -- redux --
  doPlaylistAddAndAllowPlaying: (params: {
    uri: string,
    collectionName: string,
    createNew: boolean,
    push: (uri: string) => void,
  }) => void,
};

function FormNewCollection(props: Props) {
  const { uri, onlyCreate, closeForm, doPlaylistAddAndAllowPlaying } = props;

  const {
    push,
    location: { search },
  } = useHistory();

  const buttonref: ElementRef<any> = React.useRef();
  const newCollectionName = React.useRef('');

  const [disabled, setDisabled] = React.useState(true);

  function handleNameInput(e) {
    const { value } = e.target;
    newCollectionName.current = value;
    setDisabled(value.length === 0);
  }

  function handleAddCollection() {
    const name = newCollectionName.current;

    const urlParams = new URLSearchParams(search);
    urlParams.set(COLLECTIONS_CONSTS.COLLECTION_ID, COLLECTIONS_CONSTS.WATCH_LATER_ID);

    doPlaylistAddAndAllowPlaying({
      uri,
      collectionName: name,
      createNew: true,
      push: (pushUri) =>
        push({
          pathname: formatLbryUrlForWeb(pushUri),
          search: urlParams.toString(),
          state: { collectionId: COLLECTIONS_CONSTS.WATCH_LATER_ID, forceAutoplay: true },
        }),
    });

    closeForm(name);
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
            disabled={disabled}
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
    />
  );
}

export default FormNewCollection;
