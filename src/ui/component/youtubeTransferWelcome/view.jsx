// @flow
import * as PAGES from 'constants/pages';
import React from 'react';
import classnames from 'classnames';
import ClaimPreview from 'component/claimPreview';
import Button from 'component/button';
import Confetti from 'react-confetti';
import { YOUTUBE_STATUSES } from 'lbryinc';

type Props = {
  youtubeChannels: Array<{ lbry_channel_name: string, channel_claim_id: string, transfer_state: string }>,
  claimChannels: () => void,
};

export default function UserYoutubeTransfer(props: Props) {
  const { youtubeChannels, claimChannels } = props;
  const hasYoutubeChannels = youtubeChannels && youtubeChannels.length;
  const hasPendingYoutubeTransfer =
    hasYoutubeChannels && youtubeChannels.some(channel => channel.transfer_state === YOUTUBE_STATUSES.PENDING_TRANSFER);

  return (
    <div>
      <div className="section__header">
        {!hasPendingYoutubeTransfer ? (
          <React.Fragment>
            <h1 className="section__title--large">{__('Welcome back!')}</h1>
            <p className="section__subtitle">{__('Your channel is ready to be sent over.')}</p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h1 className="section__title--large">{__('Good To Go!')}</h1>
            <p className="section__subtitle">
              {__('You now control your channel and your videos are being transferred to your account.')}
            </p>
          </React.Fragment>
        )}
      </div>

      <section className="section">
        {youtubeChannels.map(({ lbry_channel_name: channelName, channel_claim_id: claimId }) => (
          <div key={channelName} className={classnames('card--inline')}>
            <ClaimPreview disabled onClick={() => {}} actions={false} uri={`lbry://${channelName}#${claimId}`} />
          </div>
        ))}
      </section>

      {hasPendingYoutubeTransfer ? (
        <section className="section">
          <h1 className="section__title">{__('Transfer In Progress...')}</h1>
          <p className="section__subtitle">{__('You can now publish and comment using your official channel.')}</p>

          <div className="card__actions">
            <Button
              button="primary"
              label={youtubeChannels.length > 1 ? __('View Your Channels') : __('View Your Channel')}
              navigate={`/$/${PAGES.CHANNELS}`}
            />
          </div>
        </section>
      ) : (
        <section className="section">
          <h1 className="section__title">{__('Begin Transfer')}</h1>
          <div className="section__actions">
            <Button button="primary" label={__('Transfer')} onClick={claimChannels} />
          </div>
        </section>
      )}

      {hasPendingYoutubeTransfer && <Confetti recycle={false} style={{ position: 'fixed' }} />}
    </div>
  );
}
