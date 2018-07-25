// @flow
import React from 'react';
import FileTile from 'component/fileTile';
import { FormRow, FormField } from 'component/common/form';
import ToolTip from 'component/common/tooltip';
import type { Claim } from 'types/claim';
import { buildURI, parseURI } from 'lbry-redux';

type Props = {
  uri: string,
  channelUri: ?string,
  claimsInChannel: ?Array<Claim>,
  autoplay: boolean,
  setAutoplay: boolean => void,
  fetchClaims: (string, number) => void,
};

export default class RecommendedContent extends React.PureComponent<Props> {
  componentDidMount() {
    const { channelUri, fetchClaims, claimsInChannel } = this.props;
    if (channelUri && !claimsInChannel) {
      fetchClaims(channelUri, 1);
    }
  }

  render() {
    const { claimsInChannel, autoplay, uri, setAutoplay } = this.props;

    let recommendedContent;
    if (claimsInChannel) {
      recommendedContent = claimsInChannel.filter(claim => {
        const { name, claim_id: claimId, channel_name: channelName, value } = claim;
        const { isChannel } = parseURI(uri);

        // The uri may include the channel name
        const recommendedUri =
          isChannel && value && value.publisherSignature
            ? buildURI({
                contentName: name,
                claimName: channelName,
                claimId: value.publisherSignature.certificateId,
              })
            : buildURI({ claimName: name, claimId });

        return recommendedUri !== uri;
      });
    }

    return (
      <section className="card__list--recommended">
        <FormRow>
          <ToolTip onComponent body={__('Automatically download and play free content.')}>
            <FormField
              useToggle
              firstInList
              name="autoplay"
              type="checkbox"
              prefix={__('Autoplay')}
              checked={autoplay}
              onChange={e => setAutoplay(e.target.checked)}
            />
          </ToolTip>
        </FormRow>
        {recommendedContent &&
          recommendedContent.map(({ permanent_url: permanentUrl }) => (
            <FileTile
              small
              displayDescription={false}
              key={permanentUrl}
              uri={`lbry://${permanentUrl}`}
            />
          ))}
      </section>
    );
  }
}
