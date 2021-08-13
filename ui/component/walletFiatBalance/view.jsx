// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import Button from 'component/button';
import Card from 'component/common/card';
import Icon from 'component/common/icon';
import I18nMessage from 'component/i18nMessage';

type Props = {
  accountDetails: any,
};

const WalletBalance = (props: Props) => {
  const {
    accountDetails,
  } = props;

  return (
    <>{<Card
      title={<><Icon size={18} icon={ICONS.FINANCE} />{(accountDetails && (accountDetails.total_received_unpaid / 100)) || 0} USD</>}
      subtitle={
          <I18nMessage>
            This is your remaining balance that can still be withdrawn to your bank account
          </I18nMessage>
      }
      actions={
        <>
          <h2 className="section__title--small">
            ${(accountDetails && (accountDetails.total_tipped / 100)) || 0} Total Received Tips
          </h2>

          <h2 className="section__title--small">
            ${(accountDetails && (accountDetails.total_paid_out / 100)) || 0}  Withdrawn
            {/* <Button */}
            {/*  button="link" */}
            {/*  label={detailsExpanded ? __('View less') : __('View more')} */}
            {/*  iconRight={detailsExpanded ? ICONS.UP : ICONS.DOWN} */}
            {/*  onClick={() => setDetailsExpanded(!detailsExpanded)} */}
            {/* /> */}
          </h2>

          {/* view more section */}
          {/* commenting out because not implemented, but could be used in the future */}
          {/* {detailsExpanded && ( */}
          {/*  <div className="section__subtitle"> */}
          {/*    <dl> */}
          {/*      <dt> */}
          {/*        <span className="dt__text">{__('Earned from uploads')}</span> */}
          {/*        /!* <span className="help--dt">({__('Earned from channel page')})</span> *!/ */}
          {/*      </dt> */}
          {/*      <dd> */}
          {/*        <span className="dd__text"> */}
          {/*          {Boolean(1) && ( */}
          {/*            <Button */}
          {/*              button="link" */}
          {/*              className="dd__button" */}
          {/*              icon={ICONS.UNLOCK} */}
          {/*            /> */}
          {/*          )} */}
          {/*          <CreditAmount amount={1} precision={4} /> */}
          {/*        </span> */}
          {/*      </dd> */}

          {/*      <dt> */}
          {/*        <span className="dt__text">{__('Earned from channel page')}</span> */}
          {/*        /!* <span className="help--dt">({__('Delete or edit past content to spend')})</span> *!/ */}
          {/*      </dt> */}
          {/*      <dd> */}
          {/*        <CreditAmount amount={1} precision={4} /> */}
          {/*      </dd> */}

          {/*      /!* <dt> *!/ */}
          {/*      /!*  <span className="dt__text">{__('...supporting content')}</span> *!/ */}
          {/*      /!*  <span className="help--dt">({__('Delete supports to spend')})</span> *!/ */}
          {/*      /!* </dt> *!/ */}
          {/*      /!* <dd> *!/ */}
          {/*      /!*  <CreditAmount amount={1} precision={4} /> *!/ */}
          {/*      /!* </dd> *!/ */}
          {/*    </dl> */}
          {/*  </div> */}
          {/* )} */}

          <div className="section__actions">
            {/* <Button button="primary" label={__('Receive Payout')} icon={ICONS.SEND}  /> */}
            <Button button="secondary" label={__('Account Configuration')} icon={ICONS.SETTINGS} navigate={`/$/${PAGES.SETTINGS_STRIPE_ACCOUNT}`} />
          </div>
        </>
      }
    />}</>
  );
};

export default WalletBalance;
