// @flow
import React from 'react';
import { FormField } from 'component/common/form';
import { useHistory } from 'react-router';
import { formatLbryUrlForWeb } from 'util/url';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import Icon from 'component/common/icon';

type Props = {
  icon: string,
  uri: string,
  key: string,
  // -- redux --
  collection: Collection,
  collectionHasClaim: boolean,
  collectionPending: Collection,
  doPlaylistAddAndAllowPlaying: (params: {
    uri: string,
    collectionName: string,
    collectionId: string,
    push: (uri: string) => void,
  }) => void,
};

function CollectionSelectItem(props: Props) {
  const { icon, uri, key, collection, collectionHasClaim, collectionPending, doPlaylistAddAndAllowPlaying } = props;
  const { name, id } = collection || {};

  const {
    push,
    location: { search },
  } = useHistory();

  function handleChange() {
    const urlParams = new URLSearchParams(search);
    urlParams.set(COLLECTIONS_CONSTS.COLLECTION_ID, COLLECTIONS_CONSTS.WATCH_LATER_ID);

    doPlaylistAddAndAllowPlaying({
      uri,
      collectionId: id,
      collectionName: name,
      push: (pushUri) =>
        push({
          pathname: formatLbryUrlForWeb(pushUri),
          search: urlParams.toString(),
          state: { collectionId: COLLECTIONS_CONSTS.WATCH_LATER_ID, forceAutoplay: true },
        }),
    });
  }

  return (
    <li key={key} className="collection-select__item">
      <FormField
        checked={collectionHasClaim}
        disabled={collectionPending}
        icon={icon}
        type="checkbox"
        name={`select-${id}`}
        onChange={handleChange}
        label={
          <span>
            <Icon icon={icon} className={'icon-collection-select'} />
            {`${name}`}
          </span>
        }
      />
    </li>
  );
}

export default CollectionSelectItem;
