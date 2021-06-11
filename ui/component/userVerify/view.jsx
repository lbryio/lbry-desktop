// @flow
import { SITE_NAME } from 'config';
import * as ICONS from 'constants/icons';
import React, { Fragment } from 'react';
import Button from 'component/button';
import CardVerify from 'component/cardVerify';
import { Lbryio } from 'lbryinc';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';
import LbcSymbol from 'component/common/lbc-symbol';

type Props = {
  errorMessage: ?string,
  isPending: boolean,
  verifyUserIdentity: (string) => void,
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
    const { errorMessage, isPending, verifyPhone, fetchUser, onSkip } = this.props;
    const skipButtonProps = {
      onClick: onSkip,
    };

    return (
      <div className="main__auth-content">
        <section className="section__header">
          <h1 className="section__title--large">
            {''}
            <I18nMessage
              tokens={{
                lbc: <LbcSymbol size={48} />,
              }}
            >
              Verify to earn %lbc%
            </I18nMessage>
          </h1>
          <p>
            <I18nMessage
              tokens={{
                rewards_program: (
                  <Button button="link" label={__('other rewards')} href="https://lbry.com/faq/rewards" />
                ),
                Refresh: <Button onClick={() => fetchUser()} button="link" label={__('Refresh')} />,
                Skip: <Button {...skipButtonProps} button="link" label={__('Skip')} />,
                SITE_NAME,
              }}
            >
              Verified accounts are eligible to earn LBRY Credits for views, watching and reposting videos, sharing
              invite links etc. Verifying also helps us keep the %SITE_NAME% community safe too! %Refresh% or %Skip%.
            </I18nMessage>
          </p>
          <p className="help">
            {__('This step is not mandatory and not required in order for you to use %SITE_NAME%.', { SITE_NAME })}
          </p>
        </section>

        <div className="section">
          <Card
            icon={ICONS.PHONE}
            title={__('Verify phone number')}
            subtitle={__('You will receive an SMS text message confirming your phone number is valid.')}
            actions={
              <Fragment>
                <Button
                  onClick={() => {
                    verifyPhone();
                  }}
                  button="primary"
                  label={__('Verify Via Text')}
                />
                <p className="help">
                  {__('Standard messaging rates apply. Having trouble?')}{' '}
                  <Button button="link" href="https://lbry.com/faq/phone" label={__('Read more')} />.
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
            title={__('Verify via credit card')}
            subtitle={__('Your card information will not be stored or charged, now or in the future.')}
            actions={
              <Fragment>
                {errorMessage && <p className="error__text">{errorMessage}</p>}
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
            title={__('Verify via chat')}
            subtitle={
              <>
                <p>
                  {__(
                    'A moderator can approve you within our discord server. Please review the instructions within #rewards-approval carefully.'
                  )}
                </p>
                <p>{__('You will be asked to provide proof of identity.')}</p>
              </>
            }
            actions={<Button href="https://chat.lbry.com" button="primary" label={__('Join LBRY Chat')} />}
          />

          <div className="section__divider">
            <hr />
            <p>{__('OR')}</p>
          </div>

          <Card
            icon={ICONS.REMOVE}
            title={__('Skip')}
            subtitle={__("Verifying is optional. If you skip this, it just means you can't earn LBRY Credits.")}
            actions={
              <Fragment>
                <Button {...skipButtonProps} button="primary" label={__('Continue Without Verifying')} />
              </Fragment>
            }
          />
        </div>
      </div>
    );
  }
}

export default UserVerify;
