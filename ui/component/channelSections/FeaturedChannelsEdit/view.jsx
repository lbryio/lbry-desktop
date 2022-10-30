/**
 * Covers both "create" and "edit" actions for a featured-channel.
 */

// @flow
import React from 'react';
import { v4 as Uuidv4 } from 'uuid';

import Button from 'component/button';
import ChannelFinder from 'component/channelFinder';
import Card from 'component/common/card';
import { FormField } from 'component/common/form';

type Props = {
  channelId: string, // The section's owner ID.
  sectionId?: string, // null = create new list; edit otherwise
  onSave?: () => void, // Notifies parent that the list was saved.
  onCancel?: () => void, // Notifies parent that changes were canceled.
  // --- redux ---
  sections: ?Sections, // All sections for the given 'channelId'.
  featuredChannels: ?Array<FeaturedChannelsSection>, // Sorted featured channels for 'channelId'.
  channelClaim: ?ChannelClaim, // Dumb thing just to feed doUpdateCreatorSettings().
  doUpdateCreatorSettings: (channelClaim: ChannelClaim, settings: PerChannelSettings) => void,
  doToast: ({ message: string, isError?: boolean, linkText?: string, linkTarget?: string }) => void,
};

export default function FeaturedChannelsEdit(props: Props) {
  const {
    sectionId,
    onSave,
    onCancel,
    sections,
    featuredChannels,
    channelClaim,
    doUpdateCreatorSettings,
    doToast,
  } = props;

  const isEditing = Boolean(sectionId);

  const fc: ?FeaturedChannelsSection = React.useMemo(() => {
    return featuredChannels && featuredChannels.find((x) => x.id === sectionId);
  }, [featuredChannels, sectionId]);

  const [name, setName] = React.useState(fc ? fc.value.title : '');
  const [uris, setUris] = React.useState(fc ? fc.value.uris : []);

  const missingData = !sections || (isEditing && !fc) || !channelClaim;

  // **************************************************************************
  // **************************************************************************

  function showFailureToast() {
    doToast({
      message: __('Failed to update the list.'),
      subMessage: __('Try refreshing the page and edit again. Sorry :('),
      isError: true,
      duration: 'long',
    });
  }

  function handleSave() {
    if (missingData) {
      showFailureToast();
      return;
    }

    // ² - 'missingData' covered the null cases

    // $FlowIgnore ²
    const entries = sections.entries.slice();

    if (isEditing) {
      // --- EDIT ---
      // $FlowIgnore²
      const index = fc ? entries.findIndex((x) => x.id === fc.id) : -1;
      if (index > -1) {
        // $FlowIgnore²
        const newFc: FeaturedChannelsSection = { ...fc, value: { ...fc.value, title: name, uris: uris } };
        entries.splice(index, 1, newFc);
      } else {
        showFailureToast();
        return;
      }
    } else {
      // --- CREATE ---
      entries.push({
        id: Uuidv4(),
        value_type: 'featured_channels',
        value: { title: name, uris: uris },
      });
    }

    const newSections = { ...sections, entries };
    // $FlowIgnore²
    doUpdateCreatorSettings(channelClaim, { channel_sections: newSections });

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

  if (missingData) {
    return (
      <Card
        title={__('Featured channel list not found')}
        subtitle={__('Try refreshing the page and re-initiate the edit.')}
        body={
          <div className="section__actions">
            <Button button="primary" label={__('OK')} onClick={handleCancel} />
          </div>
        }
      />
    );
  }

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

          <div className="error__text">{!name && <span>{__('A title is required')}</span>}</div>
        </>
      }
    />
  );
}
