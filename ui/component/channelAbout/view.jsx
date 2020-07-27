// @flow
import React, { Fragment } from 'react';
import MarkdownPreview from 'component/common/markdown-preview';
import ClaimTags from 'component/claimTags';
import CreditAmount from 'component/common/credit-amount';
import Button from 'component/button';
import * as PAGES from 'constants/pages';
import DateTime from 'component/dateTime';

type Props = {
  claim: ChannelClaim,
  uri: string,
  description: ?string,
  email: ?string,
  website: ?string,
};

const formatEmail = (email: string) => {
  if (email) {
    const protocolRegex = new RegExp('^mailto:', 'i');
    const protocol = protocolRegex.exec(email);
    return protocol ? email : `mailto:${email}`;
  }
  return null;
};

function ChannelAbout(props: Props) {
  const { claim, uri, description, email, website } = props;

  return (
    <div className="card">
      <section className="section card--section">
        <Fragment>
          {description && (
            <>
              <label>{__('Description')}</label>
              <div className="media__info-text media__info-text--constrained">
                <MarkdownPreview content={description} />
              </div>
            </>
          )}
          {email && (
            <Fragment>
              <label>{__('Contact')}</label>
              <div className="media__info-text">
                <MarkdownPreview content={formatEmail(email)} />
              </div>
            </Fragment>
          )}
          {website && (
            <Fragment>
              <label>{__('Site')}</label>
              <div className="media__info-text">
                <MarkdownPreview content={website} />
              </div>
            </Fragment>
          )}

          <label>{__('Tags')}</label>
          <div className="media__info-text">
            <ClaimTags uri={uri} type="large" />
          </div>

          <label>{__('Total Uploads')}</label>
          <div className="media__info-text">{claim.meta.claims_in_channel}</div>

          <label>{__('Last Updated')}</label>
          <div className="media__info-text">
            <DateTime timeAgo uri={uri} />
          </div>

          <label>{__('Claim ID')}</label>
          <div className="media__info-text">
            <div className="media__info-text media__info-text--constrained">{claim.claim_id}</div>
          </div>

          <label>{__('Staked LBC')}</label>
          <div className="media__info-text">
            <CreditAmount
              badge={false}
              amount={parseFloat(claim.amount) + parseFloat(claim.meta.support_amount)}
              precision={8}
            />{' '}
            (
            <Button
              button="link"
              label={__('view other claims at lbry://%name%', {
                name: claim.name,
              })}
              navigate={`/$/${PAGES.TOP}?name=${claim.name}`}
            />
            )
          </div>
        </Fragment>
      </section>
    </div>
  );
}

export default ChannelAbout;
