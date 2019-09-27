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
  claimsInChannel: Array<StreamClaim>,
  channelIsBlocked: boolean,
  channelIsMine: boolean,
  fetchClaims: (string, number) => void,
  channelIsBlackListed: boolean,
};

function ChannelContent(props: Props) {
  const {
    uri,
    fetching,
    claimsInChannel,
    totalPages,
    channelIsMine,
    channelIsBlocked,
    fetchClaims,
    channelIsBlackListed,
  } = props;
  const hasContent = Boolean(claimsInChannel && claimsInChannel.length);
  return (
    <Fragment>
      {fetching && !hasContent && (
        <section className="main--empty">
          <Spinner delayed />
        </section>
      )}

      {!fetching && !hasContent && !channelIsBlocked && !channelIsBlackListed && (
        <div className="card--section">
          <h2 className="help">{__("This channel hasn't uploaded anything.")}</h2>
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

      {!channelIsMine && <HiddenNsfwClaims uri={uri} />}

      {hasContent && !channelIsBlocked && !channelIsBlackListed && (
        <ClaimList header={false} uris={claimsInChannel.map(claim => claim && claim.canonical_url)} />
      )}
      {!channelIsBlocked && !channelIsBlackListed && (
        <Paginate
          onPageChange={page => fetchClaims(uri, page)}
          totalPages={totalPages}
          loading={fetching && !hasContent}
        />
      )}
    </Fragment>
  );
}

export default withRouter(ChannelContent);
