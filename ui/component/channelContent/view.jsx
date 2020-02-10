// @flow
import React, { Fragment } from 'react';
import HiddenNsfwClaims from 'component/hiddenNsfwClaims';
import { withRouter } from 'react-router-dom';
import Button from 'component/button';
import ClaimListDiscover from 'component/claimListDiscover';
import * as CS from 'constants/claim_search';

type Props = {
  uri: string,
  totalPages: number,
  fetching: boolean,
  params: { page: number },
  pageOfClaimsInChannel: Array<StreamClaim>,
  channelIsBlocked: boolean,
  channelIsMine: boolean,
  fetchClaims: (string, number) => void,
  channelIsBlackListed: boolean,
  claim: ?Claim,
};

function ChannelContent(props: Props) {
  const { uri, fetching, channelIsMine, channelIsBlocked, channelIsBlackListed, claim } = props;
  const claimsInChannel = (claim && claim.meta.claims_in_channel) || 0;

  return (
    <Fragment>
      {!fetching && Boolean(claimsInChannel) && !channelIsBlocked && !channelIsBlackListed && (
        <HiddenNsfwClaims uri={uri} />
      )}

      {!fetching && channelIsBlackListed && (
        <section className="card card--section">
          <p>
            {__(
              'In response to a complaint we received under the US Digital Millennium Copyright Act, we have blocked access to this channel from our applications.'
            )}
          </p>
          <div className="card__actions">
            <Button button="link" href="https://lbry.com/faq/dmca" label={__('Read More')} />
          </div>
        </section>
      )}

      {!fetching && channelIsBlocked && (
        <div className="card--section">
          <h2 className="help">{__('You have blocked this channel content.')}</h2>
        </div>
      )}

      {!channelIsMine && claimsInChannel > 0 && <HiddenNsfwClaims uri={uri} />}

      {claim && claimsInChannel > 0 ? (
        <ClaimListDiscover channelIds={[claim.claim_id]} defaultTypeSort={CS.ORDER_BY_NEW} />
      ) : (
        <section className="main--empty">This channel hasn't published anything yet</section>
      )}
    </Fragment>
  );
}

export default withRouter(ChannelContent);
