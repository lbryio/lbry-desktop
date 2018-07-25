// @flow
import React from 'react';
import FileTile from 'component/fileTile';
import { FormRow, FormField } from 'component/common/form';
import ToolTip from 'component/common/tooltip';
import type { Claim } from 'types/claim';

type Props = {
  channelUri: ?string,
  claimsInChannel: ?Array<Claim>,
  fetching: boolean,
  fetchClaims: (string, number) => void,
};

export default class RecommendedVideos extends React.PureComponent<Props> {
  componentDidMount() {
    const { channelUri, fetchClaims, claimsInChannel } = this.props;
    if (!claimsInChannel) {
      fetchClaims(channelUri, 1);
    }
  }

  render() {
    const { claimsInChannel, fetching } = this.props;

    return (
      <div className="card__list--recommended">
        <FormRow alignRight>
          <ToolTip onComponent body={__('Automatically download and play free content.')}>
            <FormField
              useToggle
              noPadding
              name="autoplay"
              type="checkbox"
              prefix={__('Autoplay')}
              checked={false}
              onChange={() => {}}
            />
          </ToolTip>
        </FormRow>
        {fetching && <div>Loading</div>}
        {claimsInChannel &&
          claimsInChannel.map(({ permanent_url: permanentUrl }) => (
            <FileTile
              small
              displayDescription={false}
              key={permanentUrl}
              uri={`lbry://${permanentUrl}`}
            />
          ))}
      </div>
    );
  }
}
