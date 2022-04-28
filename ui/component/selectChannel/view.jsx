// @flow
import React from 'react';
import { FormField } from 'component/common/form';

type Props = {
  tiny?: boolean,
  label?: string,
  injected?: ?Array<string>,
  channelIds?: Array<string>, // Specific channel IDs to show. Must be a subset of own channels.
  // --- Redux ---
  myChannelClaims: ?Array<ChannelClaim>,
  fetchingChannels: boolean,
  activeChannelId: ?string,
  setActiveChannel: (string) => void,
};

function SelectChannel(props: Props) {
  const {
    fetchingChannels,
    channelIds,
    myChannelClaims = [],
    label,
    injected = [],
    tiny,
    activeChannelId,
    setActiveChannel,
  } = props;

  function handleChannelChange(event: SyntheticInputEvent<*>) {
    const channelClaimId = event.target.value;
    setActiveChannel(channelClaimId);
  }

  let mine = myChannelClaims;
  if (myChannelClaims && channelIds) {
    mine = myChannelClaims.filter((x) => channelIds.includes(x.claim_id));
  }

  return (
    <>
      <FormField
        name="channel"
        label={!tiny && (label || __('Channel'))}
        labelOnLeft={tiny}
        type={tiny ? 'select-tiny' : 'select'}
        onChange={handleChannelChange}
        value={activeChannelId}
        disabled={fetchingChannels}
      >
        {fetchingChannels ? (
          <option>{__('Loading your channels...')}</option>
        ) : (
          <>
            {mine &&
              mine.map(({ name, claim_id: claimId }) => (
                <option key={claimId} value={claimId}>
                  {name}
                </option>
              ))}
            {injected &&
              injected.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
          </>
        )}
      </FormField>
    </>
  );
}

export default SelectChannel;
