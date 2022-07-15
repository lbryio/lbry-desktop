// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';

import Icon from 'component/common/icon';
import Button from 'component/button';
import I18nMessage from 'component/i18nMessage';

import React from 'react';
import AstronautAndFriends from './astronaut_n_friends.png';
import BadgePremium from './badge_premium.png';
import BadgePremiumPlus from './badge_premium-plus.png';
import OdyseePremium from './odysee_premium.png';

type Props = {
  pageLocation: string,
  currencyToUse: string,
};

export default function MembershipSplash(props: Props) {
  const { pageLocation, currencyToUse } = props;

  const premiumDisplayAmounts = {
    eur: '€0.89',
    usd: '99¢',
  };

  const premiumPlusDisplayAmounts = {
    eur: '€2.68',
    usd: '$2.99',
  };

  // const logo = <Icon className="header__logo" icon={ICONS.ODYSEE_WHITE_TEXT} />;

  const earlyAcessInfo = (
    <div className="membership-splash__info-content">
      <Icon icon={ICONS.EARLY_ACCESS} />
      {__('Exclusive and early access to features')}
    </div>
  );
  const badgeInfo = (
    <div className="membership-splash__info-content">
      <Icon icon={ICONS.MEMBER_BADGE} />
      {__('Badge on profile')}
    </div>
  );
  const noAdsInfo = (
    <div className="membership-splash__info-content">
      <Icon icon={ICONS.NO_ADS} />
      {__('No ads')}
    </div>
  );

  return (
    <div className="membership-splash">
      <div className="membership-splash__banner">
        <img width="1000" height="740" src={AstronautAndFriends} />
        <section className="membership-splash__title">
          <section>
            <img width="1000" height="174" src={OdyseePremium} />
          </section>
          <section>
            <I18nMessage
              tokens={{ early_access: <b>{__('early access')}</b>, site_wide_badge: <b>{__('site-wide badge')}</b> }}
            >
              Get %early_access% features and a %site_wide_badge%
            </I18nMessage>
          </section>
        </section>
      </div>

      <div className="membership-splash__info-wrapper">
        <div className="membership-splash__info">
          {__(
            "Creating a revolutionary video platform for everyone is something we're proud to be doing, but it isn't something that can happen without support. If you believe in Odysee's mission, please consider becoming a Premium member. As a Premium member, you'll be helping us build the best platform in the universe and we'll give you some cool perks!"
          )}
        </div>

        <div className="membership-splash__info">
          <section className="membership-splash__info-header">
            <div className="membership-splash__info-price">
              <img width="500" height="500" src={BadgePremium} />

              <section>
                <I18nMessage
                  tokens={{
                    premium_recurrence: <div className="membership-splash__info-range">{__('A MONTH')}</div>,
                    premium_price: premiumDisplayAmounts[currencyToUse],
                  }}
                >
                  %premium_price% %premium_recurrence% --[context: '99¢ A MONTH']--
                </I18nMessage>
              </section>
            </div>
          </section>

          {badgeInfo}

          {earlyAcessInfo}

          <div className="membership-splash__info-button">
            <Button
              button="primary"
              label={__('Join')}
              navigate={`/$/${PAGES.ODYSEE_MEMBERSHIP}?interval=year&plan=Premium&pageLocation=${pageLocation}`}
            />
          </div>
        </div>

        <div className="membership-splash__info">
          <section className="membership-splash__info-header">
            <div className="membership-splash__info-price">
              <img width="500" height="500" src={BadgePremiumPlus} />
              <section>
                <I18nMessage
                  tokens={{
                    premium_recurrence: <div className="membership-splash__info-range">{__('A MONTH')}</div>,
                    premium_price: premiumPlusDisplayAmounts[currencyToUse],
                  }}
                >
                  %premium_price% %premium_recurrence% --[context: '99¢ A MONTH']--
                </I18nMessage>
              </section>
            </div>
          </section>
          {badgeInfo}

          {earlyAcessInfo}

          {noAdsInfo}
          <div className="membership-splash__info-button">
            <Button
              button="primary"
              label={__('Join')}
              navigate={`/$/${PAGES.ODYSEE_MEMBERSHIP}?interval=year&plan=Premium%2b&pageLocation=${pageLocation}&`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
