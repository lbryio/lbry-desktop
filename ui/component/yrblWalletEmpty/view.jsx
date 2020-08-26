// @flow
import type { Node } from 'react';
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import Button from 'component/button';
import Yrbl from 'component/yrbl';

type Props = {
  includeWalletLink: boolean,
  type?: string,
  actions?: Node,
  doOpenModal: string => void,
};
export default function YrblHelp(props: Props) {
  const { includeWalletLink = false, type = 'sad', doOpenModal } = props;

  return (
    <div className="main--empty">
      <Yrbl
        type={type}
        title={__('Your wallet is empty')}
        subtitle={
          <div>
            <p>{__('You need LBC to create a channel and upload content.')}</p>
            <p>
              {__(
                'Never fear though, there are tons of ways to earn LBC! You can earn or purchase LBC, or you can have your friends send you some.'
              )}
            </p>
            <div className="section__actions">
              <Button
                button="primary"
                icon={ICONS.REWARDS}
                label={__('Earn Rewards')}
                navigate={`/$/${PAGES.REWARDS}`}
              />
              <Button button="secondary" icon={ICONS.BUY} label={__('Buy Credits')} navigate={`/$/${PAGES.BUY}`} />
              {includeWalletLink && (
                <Button
                  icon={ICONS.RECEIVE}
                  button="secondary"
                  label={__('Your Address')}
                  onClick={() => doOpenModal(MODALS.WALLET_RECEIVE)}
                />
              )}
            </div>
          </div>
        }
      />
    </div>
  );
}
