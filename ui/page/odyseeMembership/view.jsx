/* eslint-disable no-console */
// @flow
import React from 'react';
import moment from 'moment';
import Page from 'component/page';
import Spinner from 'component/spinner';
import { Lbryio } from 'lbryinc';
import { getStripeEnvironment } from 'util/stripe';
import { ODYSEE_CHANNEL } from 'constants/channels';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import * as MODALS from 'constants/modal_types';
import Card from 'component/common/card';
import MembershipSplash from 'component/membershipSplash';
import Button from 'component/button';
import ChannelSelector from 'component/channelSelector';
import PremiumBadge from 'component/premiumBadge';
import I18nMessage from 'component/i18nMessage';
import useGetUserMemberships from 'effects/use-get-user-memberships';
import usePersistedState from 'effects/use-persisted-state';

const stripeEnvironment = getStripeEnvironment();
const isDev = process.env.NODE_ENV !== 'production';

function log(...args) {
  // @if process.env.LOG_MEMBERSHIP='true'
  console.log(args);
  // @endif
}

type Props = {
  history: { action: string, push: (string) => void, replace: (string) => void },
  location: { search: string, pathname: string },
  totalBalance: ?number,
  openModal: (string, {}) => void,
  activeChannelClaim: ?ChannelClaim,
  channels: ?Array<ChannelClaim>,
  claimsByUri: { [string]: any },
  fetchUserMemberships: (claimIdCsv: string) => void,
  incognito: boolean,
  updateUserOdyseeMembershipStatus: () => void,
  user: ?User,
  locale: ?LocaleInfo,
  preferredCurrency: ?string,
};

const OdyseeMembershipPage = (props: Props) => {
  const {
    openModal,
    activeChannelClaim,
    channels,
    claimsByUri,
    fetchUserMemberships,
    updateUserOdyseeMembershipStatus,
    incognito,
    user,
    locale,
    preferredCurrency,
  } = props;

  const userChannelName = activeChannelClaim ? activeChannelClaim.name : '';
  const userChannelClaimId = activeChannelClaim && activeChannelClaim.claim_id;

  const [cardSaved, setCardSaved] = React.useState();
  const [membershipOptions, setMembershipOptions] = React.useState();
  const [userMemberships, setUserMemberships] = React.useState();
  const [currencyToUse, setCurrencyToUse] = React.useState('usd');
  const [canceledMemberships, setCanceledMemberships] = React.useState();
  const [activeMemberships, setActiveMemberships] = React.useState();
  const [purchasedMemberships, setPurchasedMemberships] = React.useState([]);
  const [hasShownModal, setHasShownModal] = React.useState(false);
  const [shouldFetchUserMemberships, setFetchUserMemberships] = React.useState(true);
  const [apiError, setApiError] = React.useState(false);

  const [showHelp, setShowHelp] = usePersistedState('premium-help-seen', true);

  const hasMembership = activeMemberships && activeMemberships.length > 0;

  const channelUrls = channels && channels.map((channel) => channel.permanent_url);

  // check if membership data for user is already fetched, if it's needed then fetch it
  useGetUserMemberships(shouldFetchUserMemberships, channelUrls, claimsByUri, (value) => {
    fetchUserMemberships(value);
    setFetchUserMemberships(false);
  });

  async function populateMembershipData() {
    try {
      // show the memberships the user is subscribed to
      const response = await Lbryio.call(
        'membership',
        'mine',
        {
          environment: stripeEnvironment,
        },
        'post'
      );

      log('mine response');
      log(response);

      let activeMemberships = [];
      let canceledMemberships = [];
      let purchasedMemberships = [];

      for (const membership of response) {
        // if it's autorenewing it's considered 'active'
        const isActive = membership.Membership.auto_renew;
        if (isActive) {
          activeMemberships.push(membership);
        } else {
          canceledMemberships.push(membership);
        }
        purchasedMemberships.push(membership.Membership.membership_id);
      }

      // hide the other membership options if there's already a purchased membership
      if (activeMemberships.length > 0) {
        setMembershipOptions(false);
      }

      setActiveMemberships(activeMemberships);
      setCanceledMemberships(canceledMemberships);
      setPurchasedMemberships(purchasedMemberships);

      // update the state to show the badge
      fetchUserMemberships(userChannelClaimId || '');

      setUserMemberships(response);
    } catch (err) {
      setApiError(true);
      console.log(err);
    }
    setFetchUserMemberships(false);
  }

  React.useEffect(() => {
    if (!shouldFetchUserMemberships) setFetchUserMemberships(true);
  }, [shouldFetchUserMemberships]);

  // make calls to backend and populate all the data for the frontend
  React.useEffect(function () {
    // TODO: this should be refactored to make these calls in parallel
    (async function () {
      try {
        // check if there is a payment method
        const response = await Lbryio.call(
          'customer',
          'status',
          {
            environment: stripeEnvironment,
          },
          'post'
        );

        log('customer/status response');
        log(response);

        // hardcoded to first card
        const hasAPaymentCard = Boolean(response && response.PaymentMethods && response.PaymentMethods[0]);

        setCardSaved(hasAPaymentCard);
      } catch (err) {
        const customerDoesntExistError = 'user as customer is not setup yet';
        if (err.message === customerDoesntExistError) {
          setCardSaved(false);
        } else {
          setApiError(true);
          console.log(err);
        }
      }

      try {
        // check the available membership for odysee.com
        const response = await Lbryio.call(
          'membership',
          'list',
          {
            environment: stripeEnvironment,
            // Using @odysee's channel info as memberships are only for @odysee.
            channel_id: ODYSEE_CHANNEL.ID,
            channel_name: ODYSEE_CHANNEL.NAME,
          },
          'post'
        );

        log('membership/list response');
        log(response);

        // hide other options if there's already a membership
        if (activeMemberships && activeMemberships.length > 0) {
          setMembershipOptions(false);
        } else {
          setMembershipOptions(response);
        }
      } catch (err) {
        setApiError(true);
        console.log(err);
      }

      // use currency if set on client, otherwise use USD by default or EUR if in Europe
      if (preferredCurrency) {
        setCurrencyToUse(preferredCurrency.toLowerCase());
      } else {
        if (locale?.continent === 'EU') {
          setCurrencyToUse('eur');
        }
      }

      populateMembershipData();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // we are still waiting from the backend if any of these are undefined
  const stillWaitingFromBackend =
    purchasedMemberships === undefined ||
    cardSaved === undefined ||
    membershipOptions === undefined ||
    userMemberships === undefined ||
    currencyToUse === undefined;

  const formatDate = function (date) {
    return moment(new Date(date)).format('MMMM DD YYYY');
  };

  // clear membership data
  const deleteData = async function () {
    await Lbryio.call(
      'membership',
      'clear',
      {
        environment: 'test',
      },
      'post'
    );
    // $FlowFixMe
    location.reload();
  };

  // dont pass channel name and id when calling purchase
  const noChannelsOrIncognitoMode = incognito || !channels;

  // TODO: can clean this up, some repeating text
  function buildPurchaseString(price, interval, plan) {
    let featureString = '';

    // generate different strings depending on other conditions
    if (plan === 'Premium' && !noChannelsOrIncognitoMode) {
      featureString = (
        <I18nMessage tokens={{ channel_name: <b className="membership-bolded">{userChannelName}</b> }}>
          Your badge will be shown for your %channel_name% channel in all areas of the app, and can be added to two
          additional channels in the future for free.
        </I18nMessage>
      );
    } else if (plan === 'Premium+' && !noChannelsOrIncognitoMode) {
      // user has channel selected
      featureString = (
        <I18nMessage tokens={{ channel_name: <b className="membership-bolded">{userChannelName}</b> }}>
          The no ads feature applies site-wide for all channels and your badge will be shown for your %channel_name%
          channel in all areas of the app, and can be added to two additional channels in the future for free.
        </I18nMessage>
      );
    } else if (plan === 'Premium' && !channels) {
      // user has no channels
      featureString = __(
        'You currently have no channels. To show your badge on a channel, please create a channel first. If you register a channel later you will be able to show a badge for up to three channels.'
      );
    } else if (plan === 'Premium+' && !channels) {
      // user has no channels
      featureString = __(
        'The no ads feature applies site-wide. You currently have no channels. To show your badge on a channel, please create a channel first. If you register a channel later you will be able to show a badge for up to three channels.'
      );
    } else if (plan === 'Premium' && incognito) {
      // user has incognito selected
      featureString = __(
        'You currently have no channel selected and will not have a badge be visible, if you want to show a badge you can select a channel now, or you can show a badge for up to three channels in the future for free.'
      );
    } else if (plan === 'Premium+' && incognito) {
      // user has incognito selected
      featureString = __(
        'The no ads feature applies site-wide. You currently have no channel selected and will not have a badge be visible, if you want to show a badge you can select a channel now, or you can show a badge for up to three channels in the future for free.'
      );
    }

    const priceDisplayString = (
      <I18nMessage
        tokens={{
          monthly_yearly_bolded: (
            <b className="membership-bolded">{interval === 'month' ? __('monthly') : __('yearly')}</b>
          ),
          monthly_yearly: interval === 'month' ? __('monthly') : __('yearly'),
          price: (
            <b className="membership-bolded">{`${currencyToUse.toUpperCase()} ${currencyToUse === 'usd' ? '$' : '€'}${
              price / 100
            }`}</b>
          ),
        }}
      >
        You are purchasing a %monthly_yearly_bolded% %plan% membership that is active immediately and will renew
        %monthly_yearly% at a price of %price%.
      </I18nMessage>
    );

    const noRefund = __(
      'You can cancel Premium at any time (no refunds) and you can also close this window and choose a different membership option.'
    );

    return (
      <>
        {priceDisplayString} {featureString} {noRefund}
      </>
    );
  }

  const purchaseMembership = function (e, membershipOption, price) {
    e.preventDefault();
    e.stopPropagation();

    const planName = membershipOption.Membership.name;

    const membershipId = e.currentTarget.getAttribute('membership-id');
    const priceId = e.currentTarget.getAttribute('price-id');
    const purchaseString = buildPurchaseString(price.unit_amount, price.recurring.interval, planName);

    openModal(MODALS.CONFIRM_ODYSEE_MEMBERSHIP, {
      membershipId,
      userChannelClaimId: noChannelsOrIncognitoMode ? undefined : userChannelClaimId,
      userChannelName: noChannelsOrIncognitoMode ? undefined : userChannelName,
      priceId,
      purchaseString,
      plan: planName,
      populateMembershipData,
      setMembershipOptions,
      updateUserOdyseeMembershipStatus,
      user,
    });
  };

  const cancelMembership = async function (e, membership) {
    const membershipId = e.currentTarget.getAttribute('membership-id');

    const cancellationString =
      'You are cancelling your Odysee Premium. You will still have access to all the paid ' +
      'features until the point of the expiration of your current membership, at which point you will not be charged ' +
      'again and your membership will no longer be active. At this time, there is no way to subscribe to another membership if you cancel and there are no refunds.';

    openModal(MODALS.CONFIRM_ODYSEE_MEMBERSHIP, {
      membershipId,
      hasMembership,
      purchaseString: __(cancellationString),
      populateMembershipData,
    });
  };

  function convertIntervalVariableToString(price) {
    const interval = price.recurring.interval;

    if (interval === 'year') {
      return __('Yearly');
    } else if (interval === 'month') {
      return __('Monthly');
    }
  }

  function capitalizedInterval(planInterval) {
    if (planInterval === 'year') {
      return __('Year');
    } else {
      return __('Month');
    }
  }

  function buildCurrencyDisplay(priceObject) {
    let currencySymbol;
    if (priceObject.currency === 'eur') {
      currencySymbol = '€';
    } else if (priceObject.currency === 'usd') {
      currencySymbol = '$';
    }

    const currency = priceObject.currency.toUpperCase();

    return currency + ' ' + currencySymbol;
  }

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  const { interval, plan } = params;

  const planValue = params.plan;

  // description to be shown under plan name
  function getPlanDescription(plan, active?) {
    if (plan === 'Premium') {
      return 'Badge on profile, automatic rewards confirmation, and early access to new features';

      // if there's more plans added this needs to be expanded
    } else if (active) {
      return 'All Premium features, and no ads';
    } else {
      return 'Badge on profile, automatic rewards confirmation, early access to new features, and no ads';
    }
  }

  // add a bit of a delay otherwise it's a bit jarring
  const timeoutValue = 300;

  // if user already selected plan, wait a bit (so it's not jarring) and open modal
  React.useEffect(() => {
    if (!stillWaitingFromBackend && planValue && cardSaved) {
      const delayTimeout = setTimeout(function () {
        // clear query params
        window.history.replaceState(null, null, window.location.pathname);

        setHasShownModal(true);

        // open confirm purchase
        // $FlowFixMe
        document.querySelector('[plan="' + plan + '"][interval="' + interval + '"]').click();
      }, timeoutValue);

      return () => clearTimeout(delayTimeout);
    }
  }, [stillWaitingFromBackend, planValue, cardSaved]);

  const helpText = (
    <div className="section__subtitle">
      <p>
        {__(
          'First of all, thank you for considering or purchasing a membership, it means a ton to us! A few important details to know:'
        )}
      </p>
      <p>
        <ul>
          <li>
            {__(
              'Exclusive and early access features include: recommended content, homepage customization, and the ability to post Odysee hyperlinks + images in comments. Account is also automatically eligible for Rewards. More to come later.'
            )}
          </li>
          <li>
            {__(
              'The yearly Premium+ membership has a discount compared to monthly, and Premium is only available yearly.'
            )}
          </li>
          <li>{__('These are limited time rates, so get in early!')}</li>
          <li>
            {__(
              'There may be higher tiers available in the future for creators and anyone else who wants to support us.'
            )}
          </li>
          <li>
            {__('Badges will be displayed on a single channel to start, with an option to add on two more later on.')}
          </li>
          <li>
            {__('Cannot upgrade or downgrade a membership at this time. Refunds are not available. Choose wisely.')}
          </li>
        </ul>
      </p>
    </div>
  );

  return (
    <>
      <Page className="premium-wrapper">
        {/** splash frontend **/}
        {!stillWaitingFromBackend && !apiError && purchasedMemberships.length === 0 && !planValue && !hasShownModal ? (
          <MembershipSplash pageLocation={'confirmPage'} currencyToUse={currencyToUse} />
        ) : (
          /** odysee membership page **/
          <div className={'card-stack'}>
            {!stillWaitingFromBackend && cardSaved !== false && (
              <>
                <h1 style={{ fontSize: '23px' }}>{__('Odysee Premium')}</h1>
                {/* let user switch channel */}
                <div style={{ marginTop: '10px' }}>
                  <ChannelSelector uri={activeChannelClaim && activeChannelClaim.permanent_url} />

                  {/* explainer help text */}
                  <Card
                    titleActions={
                      <Button
                        button="close"
                        icon={showHelp ? ICONS.UP : ICONS.DOWN}
                        onClick={() => setShowHelp(!showHelp)}
                      />
                    }
                    title={__('Get More Information')}
                    subtitle={__('Expand to learn more about how Odysee Premium works')}
                    actions={showHelp && helpText}
                    className={'premium-explanation-text'}
                  />
                </div>
              </>
            )}

            {/** available memberships **/}
            {/* if they have a card and don't have a membership yet */}
            {!stillWaitingFromBackend && membershipOptions && purchasedMemberships.length < 1 && cardSaved !== false && (
              <>
                <div className="card__title-section">
                  <h2 className="card__title">{__('Available Memberships')}</h2>
                </div>

                <Card>
                  {membershipOptions.map((membershipOption, i) => (
                    <>
                      <div key={i}>
                        {purchasedMemberships && !purchasedMemberships.includes(membershipOption.Membership.id) && (
                          <>
                            <div className="premium-option">
                              {/* plan title */}
                              <h4 className="membership_title">
                                {membershipOption.Membership.name}
                                <PremiumBadge membership={membershipOption.Membership.name} />
                              </h4>

                              {/* plan description */}
                              <h4 className="membership_subtitle">
                                {__(getPlanDescription(membershipOption.Membership.name))}
                              </h4>
                              <>
                                {/* display different plans */}
                                {membershipOption.Prices.map((price) => (
                                  <>
                                    {/* dont show a monthly Premium membership option (yearly only) */}
                                    {!(
                                      price.recurring.interval === 'month' &&
                                      membershipOption.Membership.name === 'Premium'
                                    ) && (
                                      <>
                                        {price.currency === currencyToUse && (
                                          <div>
                                            <h4 className="membership_info">
                                              <b>{__('Interval')}:</b> {convertIntervalVariableToString(price)}
                                            </h4>
                                            <h4 className="membership_info">
                                              <b>{__('Price')}:</b> {buildCurrencyDisplay(price)}
                                              {price.unit_amount / 100}/{capitalizedInterval(price.recurring.interval)}
                                            </h4>
                                            <Button
                                              button="primary"
                                              onClick={(e) => purchaseMembership(e, membershipOption, price)}
                                              membership-id={membershipOption.Membership.id}
                                              membership-subscription-period={membershipOption.Membership.type}
                                              price-id={price.id}
                                              className="membership_button"
                                              label={__('Join via %interval% membership', {
                                                interval: price.recurring.interval,
                                              })}
                                              icon={ICONS.FINANCE}
                                              interval={price.recurring.interval}
                                              plan={membershipOption.Membership.name}
                                            />
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </>
                                ))}
                              </>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  ))}
                </Card>
              </>
            )}
            {!stillWaitingFromBackend && cardSaved === true && (
              <>
                <div className="card__title-section">
                  <h2 className="card__title">{__('Your Active Memberships')}</h2>
                </div>

                <Card>
                  {/** * list of active memberships from user ***/}
                  <div>
                    {/* <h1 style={{ fontSize: '19px' }}>Active Memberships</h1> */}
                    {!stillWaitingFromBackend && activeMemberships && activeMemberships.length === 0 && (
                      <h4>{__('You currently have no active memberships')}</h4>
                    )}
                    {/** active memberships **/}
                    {!stillWaitingFromBackend &&
                      activeMemberships &&
                      activeMemberships.map((membership) => (
                        <>
                          <div className="premium-option">
                            {/* membership name */}
                            <h4 className="membership_title">
                              {membership.MembershipDetails.name}
                              <PremiumBadge membership={membership.MembershipDetails.name} />
                            </h4>

                            {/* description section */}
                            <h4 className="membership_subtitle">
                              {__(getPlanDescription(membership.MembershipDetails.name, 'active'))}
                            </h4>

                            {/* registered on */}
                            <h4 className="membership_info">
                              <b>{__('Registered On')}:</b> {formatDate(membership.Membership.created_at)}
                            </h4>

                            {/* autorenews at */}
                            <h4 className="membership_info">
                              <b>{__('Auto-Renews On')}:</b>{' '}
                              {formatDate(membership.Subscription.current_period_end * 1000)}
                            </h4>

                            {/* cancel membership button */}
                            <Button
                              button="alt"
                              membership-id={membership.Membership.membership_id}
                              onClick={(e) => cancelMembership(e, membership)}
                              className="cancel-membership-button"
                              label={__('Cancel membership')}
                              icon={ICONS.FINANCE}
                            />
                          </div>
                        </>
                      ))}
                  </div>
                </Card>
                <>
                  {/** canceled memberships **/}
                  <div className="card__title-section">
                    <h2 className="card__title">{__('Canceled Memberships')}</h2>
                  </div>
                  <Card>
                    {canceledMemberships && canceledMemberships.length === 0 && (
                      <h4>{__('You currently have no canceled memberships')}</h4>
                    )}
                    {canceledMemberships &&
                      canceledMemberships.map((membership) => (
                        <>
                          <h4 className="membership_title">
                            {membership.MembershipDetails.name}
                            <PremiumBadge membership={membership.MembershipDetails.name} />
                          </h4>

                          <div className="premium-option">
                            <h4 className="membership_info">
                              <b>{__('Registered On')}:</b> {formatDate(membership.Membership.created_at)}
                            </h4>
                            <h4 className="membership_info">
                              <b>{__('Canceled On')}:</b> {formatDate(membership.Subscription.canceled_at * 1000)}
                            </h4>
                            <h4 className="membership_info">
                              <b>{__('Still Valid Until')}:</b> {formatDate(membership.Membership.expires)}
                            </h4>
                          </div>
                        </>
                      ))}
                  </Card>
                </>
              </>
            )}

            {/** send user to add card if they don't have one yet */}
            {!stillWaitingFromBackend && cardSaved === false && (
              <div>
                <br />
                <h2 className={'getPaymentCard'}>
                  {__('Please save a card as a payment method so you can join Odysee Premium')}
                </h2>

                <Button
                  button="primary"
                  label={__('Add a Card')}
                  icon={ICONS.SETTINGS}
                  navigate={`/$/${PAGES.SETTINGS_STRIPE_CARD}?returnTo=premium`}
                  className="membership_button"
                  style={{ maxWidth: '151px' }}
                />
              </div>
            )}

            {/** loading section **/}
            {stillWaitingFromBackend && !apiError && (
              <div className="main--empty">
                <Spinner />
              </div>
            )}

            {/** loading section **/}
            {stillWaitingFromBackend && apiError && (
              <div className="main--empty">
                <h1 style={{ fontSize: '19px' }}>
                  {__('Sorry, there was an error, please contact support or try again later')}
                </h1>
              </div>
            )}

            {/** clear membership data (only available on dev) **/}
            {isDev && cardSaved && purchasedMemberships.length > 0 && (
              <>
                <h1 style={{ marginTop: '30px', fontSize: '20px' }}>Clear Membership Data (Only Available On Dev)</h1>
                <div>
                  <Button
                    button="primary"
                    label="Clear Membership Data"
                    icon={ICONS.SETTINGS}
                    className="membership_button"
                    onClick={deleteData}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </Page>
    </>
  );
};

export default OdyseeMembershipPage;
