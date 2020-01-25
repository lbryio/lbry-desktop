// @flow
import React, { Fragment } from 'react';
import ClaimList from 'component/claimList';
import HiddenNsfwClaims from 'component/hiddenNsfwClaims';
import { withRouter } from 'react-router-dom';
import Paginate from 'component/common/paginate';
import Spinner from 'component/spinner';
import Button from 'component/button';

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
  const {
    uri,
    fetching,
    pageOfClaimsInChannel,
    totalPages,
    channelIsMine,
    channelIsBlocked,
    fetchClaims,
    channelIsBlackListed,
    claim,
  } = props;
  const hasContent = Boolean(pageOfClaimsInChannel && pageOfClaimsInChannel.length);
  const claimsInChannel = (claim && claim.meta.claims_in_channel) || 0;
  return (
    <Fragment>
      {fetching && !hasContent && (
        <section className="main--empty">
          <Spinner delayed />
        </section>
      )}

      {!fetching && !claimsInChannel && !channelIsBlocked && !channelIsBlackListed && (
        <div className="card--section">
          <h2 className="section__subtitle">{__("This channel hasn't uploaded anything.")}</h2>
        </div>
      )}

      {!fetching && !hasContent && Boolean(claimsInChannel) && !channelIsBlocked && !channelIsBlackListed && (
        <div className="card--section">
          <HiddenNsfwClaims uri={uri} />
        </div>
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

      {!channelIsMine && hasContent && <HiddenNsfwClaims uri={uri} />}

      {hasContent && !channelIsBlocked && !channelIsBlackListed && (
        <ClaimList header={false} uris={pageOfClaimsInChannel.map(claim => claim && claim.canonical_url)} />
      )}

      {!channelIsBlocked && !channelIsBlackListed && (
        <Paginate
          key={uri}
          onPageChange={page => fetchClaims(uri, page)}
          totalPages={totalPages}
          loading={fetching && !hasContent}
        />
      )}
    </Fragment>
  );
}

export default withRouter(ChannelContent);
