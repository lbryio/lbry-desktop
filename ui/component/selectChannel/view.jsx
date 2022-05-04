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
  activeChannelClaimId: ?string,
  hasDefaultChannel: boolean,
  setActiveChannel: (claimId: ?string, override?: boolean) => void,
};

function SelectChannel(props: Props) {
  const {
    fetchingChannels,
    channelIds,
    myChannelClaims = [],
    label,
    injected = [],
    tiny,
    activeChannelClaimId,
    hasDefaultChannel,
    setActiveChannel,
  } = props;

  const defaultChannelRef = React.useRef(hasDefaultChannel);

  function handleChannelChange(event: SyntheticInputEvent<*>) {
    const channelClaimId = event.target.value;
    setActiveChannel(channelClaimId);
  }

  let mine = myChannelClaims;
  if (myChannelClaims && channelIds) {
    mine = myChannelClaims.filter((x) => channelIds.includes(x.claim_id));
  }

  React.useEffect(() => {
    defaultChannelRef.current = hasDefaultChannel;
  }, [hasDefaultChannel]);

  React.useEffect(() => {
    return () => {
      // has a default channel selected, clear the current active channel
      if (defaultChannelRef.current) {
        setActiveChannel(null, true);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <FormField
        name="channel"
        label={!tiny && (label || __('Channel'))}
        labelOnLeft={tiny}
        type={tiny ? 'select-tiny' : 'select'}
        onChange={handleChannelChange}
        value={activeChannelClaimId}
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
