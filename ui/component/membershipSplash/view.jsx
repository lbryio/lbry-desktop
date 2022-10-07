// @flow
import React from 'react';

import * as ICONS from 'constants/icons';
import * as MEMBERSHIP_CONSTS from 'constants/memberships';

import Icon from 'component/common/icon';
import I18nMessage from 'component/i18nMessage';

import AstronautAndFriends from './internal/assets/astronaut_n_friends.png';
import BadgePremium from './internal/assets/badge_premium.png';
import BadgePremiumPlus from './internal/assets/badge_premium-plus.png';
import OdyseePremium from './internal/assets/odysee_premium.png';
import JoinButton from './internal/joinPlanButton';

type Props = {
  pageLocation: string,
  // -- redux --
  preferredCurrency: string,
};

const MembershipSplash = (props: Props) => {
  const { pageLocation, preferredCurrency } = props;

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
          <h1 className="balance-text">
            <I18nMessage>
              "Creating a revolutionary video platform for everyone is something we're proud to be doing, but it isn't
              something that can happen without support. If you believe in Odysee's mission, please consider becoming a
              Premium member. As a Premium member, you'll be helping us build the best platform in the universe and
              we'll give you some cool perks!"
            </I18nMessage>
          </h1>
        </div>

        <div className="membership-splash__info">
          <section className="membership-splash__info-header">
            <div className="membership-splash__info-price">
              <img width="500" height="500" src={BadgePremium} />

              <section>
                <I18nMessage
                  tokens={{
                    premium_recurrence: <div className="membership-splash__info-range">{__('A MONTH')}</div>,
                    premium_price:
                      MEMBERSHIP_CONSTS.PRICES[MEMBERSHIP_CONSTS.ODYSEE_TIER_NAMES.PREMIUM][preferredCurrency],
                  }}
                >
                  %premium_price% %premium_recurrence% --[context: '99¢ A MONTH']--
                </I18nMessage>
              </section>
            </div>
          </section>

          <BadgeInfo />

          <EarlyAcessInfo />

          <div className="membership-splash__info-button">
            <JoinButton pageLocation={pageLocation} interval="year" plan="Premium" doOpenModal />
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
                    premium_price:
                      MEMBERSHIP_CONSTS.PRICES[MEMBERSHIP_CONSTS.ODYSEE_TIER_NAMES.PREMIUM_PLUS][preferredCurrency],
                  }}
                >
                  %premium_price% %premium_recurrence% --[context: '99¢ A MONTH']--
                </I18nMessage>
              </section>
            </div>
          </section>

          <BadgeInfo />
          <EarlyAcessInfo />
          <NoAdsInfo />

          <div className="membership-splash__info-button">
            <JoinButton pageLocation={pageLocation} interval="year" plan="Premium%2b" doOpenModal />
          </div>
        </div>
      </div>
    </div>
  );
};

const EarlyAcessInfo = () => (
  <div className="membership-splash__info-content">
    <Icon icon={ICONS.EARLY_ACCESS} />
    <h1 className="balance-text">{__('Exclusive and early access to features')}</h1>
  </div>
);

const BadgeInfo = () => (
  <div className="membership-splash__info-content">
    <Icon icon={ICONS.MEMBER_BADGE} />
    <h1 className="balance-text">{__('Badge on profile')}</h1>
  </div>
);

const NoAdsInfo = () => (
  <div className="membership-splash__info-content">
    <Icon icon={ICONS.NO_ADS} />
    <h1 className="balance-text">{__('No ads')}</h1>
  </div>
);

export default MembershipSplash;
