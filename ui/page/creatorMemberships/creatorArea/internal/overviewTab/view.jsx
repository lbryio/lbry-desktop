// @flow
import React from 'react';

import HelpHub from 'component/common/help-hub';
import ChannelOverview from './internal/channelOverview';

import './style.scss';

type Props = {
  onChannelSelect: () => void,
  // -- redux --
  myChannelClaims: Array<ChannelClaim>,
  totalSupportersAmount: number,
  totalMonthlyIncome: number,
  doSetActiveChannel: (claimId: ?string, override?: boolean) => void,
};

function OverviewTab(props: Props) {
  const { onChannelSelect, myChannelClaims, totalSupportersAmount, totalMonthlyIncome, doSetActiveChannel } = props;

  function selectChannel(channelClaim) {
    doSetActiveChannel(channelClaim.claim_id, true);
    onChannelSelect();
  }

  return (
    <>
      <table className="table table-total">
        <tr>
          {/* todo: allow sorting */}
          <td>
            {/* todo: make this a link to the supporters tab with all channel set to on */}
            {/* so they can see all their supporters */}
            {__('Total Supporters')} <span>{totalSupportersAmount}</span>
          </td>
          <td>
            {__('Total Monthly Income')} <span>${(totalMonthlyIncome / 100).toFixed(2)}</span>
          </td>
        </tr>
      </table>

      <div className="membership-table__wrapper">
        <table className="table">
          <thead>
            <tr>
              <th className="channelName-header" colSpan="2">
                {__('Channel Name')}
              </th>
              <th>{__('Supporters')}</th>
              <th>{__('Estimated Monthly Income')}</th>
              <th>{__('Total Received')}</th>
              <th className="membership-table__page">{__('Page')}</th>
              <th className="membership-table__url">{__('URL')}</th>
            </tr>
          </thead>

          <tbody>
            {myChannelClaims.map((channelClaim) => (
              <tr key={channelClaim.claim_id} onClick={() => selectChannel(channelClaim)}>
                <ChannelOverview channelClaim={channelClaim} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <HelpHub
        href="https://help.odysee.tv/category-memberships/"
        image="Spaceman"
        text={__(
          'Want to increase your channel growth? Spaceman has whipped up some marketing concepts in the %help_hub%.'
        )}
      />
    </>
  );
}

export default OverviewTab;
