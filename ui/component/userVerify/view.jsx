// @flow
import * as ICONS from 'constants/icons';
import React, { Fragment } from 'react';
import Button from 'component/button';
import CardVerify from 'component/cardVerify';
import { Lbryio } from 'lbryinc';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';

type Props = {
  errorMessage: ?string,
  isPending: boolean,
  verifyUserIdentity: string => void,
  verifyPhone: () => void,
  fetchUser: () => void,
  skipLink?: string,
  onSkip: () => void,
};

class UserVerify extends React.PureComponent<Props> {
  constructor() {
    super();

    (this: any).onToken = this.onToken.bind(this);
  }

  onToken(data: { id: string }) {
    this.props.verifyUserIdentity(data.id);
  }

  render() {
    const { errorMessage, isPending, verifyPhone, fetchUser, skipLink, onSkip } = this.props;
    const skipButtonProps = {
      onClick: onSkip,
      navigate: skipLink || '/',
    };

    return (
      <React.Fragment>
        <section className="section__header">
          <h1 className="section__title--large">{__('Rewards Validation')}</h1>
          <p>
            <I18nMessage
              tokens={{
                rewards_program: (
                  <Button button="link" label={__('Rewards Program')} href="https://lbry.com/faq/rewards" />
                ),
              }}
            >
              If you'd like to participate our %rewards_program% to earn credits, please complete one of the steps below
              to be validated.
            </I18nMessage>{' '}
            <Button onClick={() => fetchUser()} button="link" label={__('Refresh')} /> {'or'}{' '}
            <Button {...skipButtonProps} button="link" label={__('Skip')} />.
          </p>
          <p>{__('This step is not required to use LBRY, and not all users or regions may qualify.')}</p>
        </section>

        <div className="section">
          <Card
            icon={ICONS.PHONE}
            title={__('Proof via Text')}
            subtitle={__(
              'You will receive an SMS text message confirming that your phone number is correct. Does not work for Canada and possibly other regions'
            )}
            actions={
              <Fragment>
                <Button
                  onClick={() => {
                    verifyPhone();
                  }}
                  button="primary"
                  label={__('Verify Phone Number')}
                />
                <p className="help">
                  {__('Standard messaging rates apply. LBRY will not text or call you otherwise. Having trouble?')}{' '}
                  <Button button="link" href="https://lbry.com/faq/phone" label={__('Read more.')} />
                </p>
              </Fragment>
            }
          />

          <div className="section__divider">
            <hr />
            <p>{__('OR')}</p>
          </div>

          <Card
            icon={ICONS.WALLET}
            title={__('Proof via Credit')}
            subtitle={__(
              'If you have a valid credit or debit card, you can use it to instantly prove your humanity. LBRY does not store your credit card information. There is no charge at all for this, now or in the future.'
            )}
            actions={
              <Fragment>
                {errorMessage && <p className="error-text">{errorMessage}</p>}
                <CardVerify
                  label={__('Verify Card')}
                  disabled={isPending}
                  token={this.onToken}
                  stripeKey={Lbryio.getStripeToken()}
                />
                <p className="help">
                  {__('A $1 authorization may temporarily appear with your provider.')}{' '}
                  <Button button="link" href="https://lbry.com/faq/identity-requirements" label={__('Read more')} />.
                </p>
              </Fragment>
            }
          />

          <div className="section__divider">
            <hr />
            <p>{__('OR')}</p>
          </div>

          <Card
            icon={ICONS.CHAT}
            title={__('Proof via Chat')}
            subtitle={__(
              'A moderator capable of approving you is typically available in the discord server. See the #rewards-approval instructions carefully and do not message any moderators directly. This process will likely involve providing proof of a stable and established online or real-life identity.'
            )}
            actions={
              <Fragment>
                <Button href="https://chat.lbry.com" button="primary" label={__('Join LBRY Chat')} />
                <p className="help">{__("We're friendly. We promise.")}</p>
              </Fragment>
            }
          />

          <div className="section__divider">
            <hr />
            <p>{__('OR')}</p>
          </div>

          <Card
            icon={ICONS.REMOVE}
            title={__('Skip')}
            subtitle={__('Rewards validation is optional.')}
            actions={
              <Fragment>
                <Button {...skipButtonProps} button="primary" label={__('Continue Without Rewards')} />
              </Fragment>
            }
          />
        </div>
      </React.Fragment>
    );
  }
}

export default UserVerify;
