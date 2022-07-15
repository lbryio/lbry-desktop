// @flow
import type { Node } from 'react';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import React from 'react';
import Button from 'component/button';
import Yrbl from 'component/yrbl';
import I18nMessage from 'component/i18nMessage';
import LbcSymbol from 'component/common/lbc-symbol';

type Props = {
  includeWalletLink: boolean,
  type?: string,
  actions?: Node,
};
export default function YrblWalletEmpty(props: Props) {
  const { includeWalletLink = false, type = 'sad' } = props;

  return (
    <div className="main--empty">
      <Yrbl
        type={type}
        title={__('Your wallet is empty')}
        subtitle={
          <div>
            <p>
              <I18nMessage tokens={{ lbc: <LbcSymbol /> }}>
                You need %lbc% to create a channel and upload content.
              </I18nMessage>
            </p>
            <p>
              <I18nMessage tokens={{ lbc: <LbcSymbol /> }}>
                Never fear though, there are tons of ways to earn %lbc%. You can earn or purchase %lbc%, or you can have
                your friends send you some.
              </I18nMessage>
            </p>
          </div>
        }
        actions={
          <div className="section__actions">
            <Button button="primary" icon={ICONS.REWARDS} label={__('Earn Rewards')} navigate={`/$/${PAGES.REWARDS}`} />
            <Button button="secondary" icon={ICONS.BUY} label={'Buy/Swap Credits'} navigate={`/$/${PAGES.BUY}`} />
            {includeWalletLink && (
              <Button
                icon={ICONS.RECEIVE}
                button="secondary"
                label={__('Your Address')}
                navigate={`/$/${PAGES.RECEIVE}`}
              />
            )}
          </div>
        }
      />
    </div>
  );
}
