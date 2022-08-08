/**
 * Covers both "create" and "edit" actions for a featured-channel.
 */

// @flow
import React from 'react';
import Button from 'component/button';
import ChannelFinder from 'component/channelFinder';
import Card from 'component/common/card';
import { FormField } from 'component/common/form';
import { COL_TYPES } from 'constants/collections';

type Props = {
  collectionId?: string, // null = create new list; edit otherwise.
  channelId?: string, // The collection's owner ID (for the case of editing).
  onSave?: () => void, // Notifies parent that the list was saved.
  onCancel?: () => void, // Notifies parent that changes were canceled.
  // --- redux ---
  collection: Collection, // Corresponding collection for 'collectionId'.
  doLocalCollectionCreate: (params: CollectionCreateParams) => void,
  doCollectionEdit: (id: string, CollectionEditParams) => void,
};

export default function FeaturedChannelsEdit(props: Props) {
  const { channelId, collectionId, onSave, onCancel, collection, doLocalCollectionCreate, doCollectionEdit } = props;

  const [name, setName] = React.useState(() => (collection ? collection.name : ''));
  const [uris, setUris] = React.useState(() => (collection ? collection.items : []));

  // **************************************************************************
  // **************************************************************************

  function handleSave() {
    if (collectionId && collection) {
      doCollectionEdit(collectionId, {
        name,
        uris,
        replace: true,
        type: COL_TYPES.FEATURED_CHANNELS,
        featuredChannelsParams: { channelId: channelId || '0' },
      });
    } else {
      doLocalCollectionCreate({
        name,
        items: uris,
        type: COL_TYPES.FEATURED_CHANNELS,
        featuredChannelsParams: { channelId: channelId || '0' },
      });
    }

    if (onSave) {
      onSave();
    }
  }

  function handleCancel() {
    if (onCancel) {
      onCancel();
    }
  }

  function handleSelectedUrisChanged(change: 'remove' | 'add' | 'reorder', params: any) {
    const { uri, to, from } = params;

    switch (change) {
      case 'remove':
        setUris((prev) => prev.filter((p) => p !== uri));
        break;
      case 'add':
        setUris((prev) => prev.concat([uri]));
        break;
      case 'reorder':
        setUris((prev) => {
          const next = prev.slice(); // immutable change
          next.splice(from, 1);
          next.splice(to, 0, prev[from]);
          return next;
        });
        break;
      default:
        console.error('Invalid change: ' + change); // eslint-disable-line no-console
        break;
    }
  }

  // **************************************************************************
  // **************************************************************************

  return (
    <Card
      body={
        <>
          <FormField
            label={__('Featured channels title')}
            // placeholder={__('Add list title')}
            type="text"
            name="fc_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <ChannelFinder
            label={__('Search for channels to add')}
            selectedUris={uris}
            onSelectedUrisChanged={handleSelectedUrisChanged}
          />

          <div className="section__actions">
            <Button label={__('Done')} button="primary" disabled={!name || uris.length === 0} onClick={handleSave} />
            <Button button="link" label={__('Cancel')} onClick={handleCancel} />
          </div>
        </>
      }
    />
  );
}
