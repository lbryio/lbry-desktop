// @flow
import * as ICONS from 'constants/icons';
import * as COLLECTIONS_CONSTS from 'constants/collections';
import React from 'react';
import { FormField } from 'component/common/form';
import Icon from 'component/common/icon';

type Props = {
  collection: Collection,
  hasClaim: boolean,
  category: string,
  edited: boolean,
  editCollection: (string, CollectionEditParams) => void,
  uri: string,
  collectionPending: Collection,
};

function CollectionSelectItem(props: Props) {
  const { collection, hasClaim, category, editCollection, uri, collectionPending } = props;
  const { name, id } = collection;
  const handleChange = (e) => {
    editCollection(id, { uris: [uri], remove: hasClaim });
  };

  let icon;
  switch (category) {
    case 'builtin':
      icon =
        (id === COLLECTIONS_CONSTS.WATCH_LATER_ID && ICONS.TIME) ||
        (id === COLLECTIONS_CONSTS.FAVORITES_ID && ICONS.STAR) ||
        ICONS.STACK;
      break;
    case 'published':
      icon = ICONS.STACK;
      break;
    default:
      // 'unpublished'
      icon = ICONS.LOCK;
      break;
  }

  return (
    <div className={'collection-select__item'}>
      <FormField
        checked={hasClaim}
        disabled={collectionPending}
        icon={icon}
        type="checkbox"
        name={`select-${id}`}
        onChange={handleChange} // edit the collection
        label={
          <span>
            <Icon icon={icon} className={'icon-collection-select'} />
            {`${name}`}
          </span>
        } // the collection name
      />
    </div>
  );
}

export default CollectionSelectItem;
