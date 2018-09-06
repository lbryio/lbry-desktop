// @flow
import React from 'react';
import type { Claim } from 'types/claim';

// import Button from 'component/button';
// import { FormField } from 'component/common/form';

type Props = {
  claim: Claim,
};

// the only reason I can think of for <..,State> is to count times shared
class SocialShare extends React.PureComponent<Props> {
  render() {
    const { claim } = this.props;
    const { claim_id: claimId, name: claimName, channel_name: channelName } = claim;
    return (
      <div>
        <div className="card__title">
          <h1>{__('Share')}</h1>
          <h2>claimId:{claimId}</h2>
          <h2>claimName:{claimName}</h2>
          <h2>channelName:{channelName}</h2>
        </div>
      </div>
    );
  }
}

export default SocialShare;
