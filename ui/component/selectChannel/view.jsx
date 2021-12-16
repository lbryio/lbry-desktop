// @flow
import React from 'react';
import { FormField } from 'component/common/form';

type Props = {
  tiny?: boolean,
  label: string,
  myChannelClaims: ?Array<ChannelClaim>,
  injected: ?Array<string>,
  activeChannelId: ?string,
  setActiveChannel: (string) => void,
  fetchingChannels: boolean,
};

function SelectChannel(props: Props) {
  const {
    fetchingChannels,
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
            {myChannelClaims &&
              myChannelClaims.map(({ name, claim_id: claimId }) => (
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
