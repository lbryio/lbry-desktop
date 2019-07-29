// @flow
import * as React from 'react';
import Button from 'component/button';
import CardVerify from 'component/cardVerify';
import { Lbryio } from 'lbryinc';

type Props = {
  errorMessage: ?string,
  isPending: boolean,
  verifyUserIdentity: string => void,
  verifyPhone: () => void,
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
    const { errorMessage, isPending, verifyPhone } = this.props;
    return (
      <React.Fragment>
        <section className="card card--section">
          <h1 className="card__title">{__('Final Human Proof')}</h1>
          <p className="card__subtitle">
            To start the rewards approval process, please complete <strong>one and only one</strong> of the options
            below. This is optional, and can be skipped at the bottom of the page.
          </p>
        </section>

        <section className="card card--section">
          <h2 className="card__title">{__('1) Proof via Phone')}</h2>
          <p className="card__subtitle">
            {`${__(
              'You will receive an SMS text message confirming that your phone number is correct. Does not work for Canada and possibly other regions'
            )}`}
          </p>

          <div className="card__actions">
            <Button
              onClick={() => {
                verifyPhone();
              }}
              button="inverse"
              label={__('Submit Phone Number')}
            />

            <div className="help">
              {__('Standard messaging rates apply. LBRY will not text or call you otherwise. Having trouble?')}{' '}
              <Button button="link" href="https://lbry.com/faq/phone" label={__('Read more.')} />
            </div>
          </div>
        </section>

        <section className="card card--section">
          <h2 className="card__title">{__('2) Proof via Credit')}</h2>
          <p className="card__subtitle">
            {`${__('If you have a valid credit or debit card, you can use it to instantly prove your humanity.')} ${__(
              'LBRY does not store your credit card information. There is no charge at all for this, now or in the future.'
            )} `}
          </p>

          <div className="card__actions">
            {errorMessage && <p className="error-text">{errorMessage}</p>}
            <CardVerify
              label={__('Perform Card Verification')}
              disabled={isPending}
              token={this.onToken}
              stripeKey={Lbryio.getStripeToken()}
            />
          </div>

          <div className="help">
            {__('A $1 authorization may temporarily appear with your provider.')}{' '}
            <Button
              button="link"
              href="https://lbry.com/faq/identity-requirements"
              label={__('Read more about why we do this.')}
            />
          </div>
        </section>

        <section className="card card--section">
          <h2 className="card__title">{__('3) Proof via Chat')}</h2>
          <p className="card__subtitle">
            {__(
              'A moderator capable of approving you is typically available in the discord server. Check out the #rewards-approval channel for more information.'
            )}{' '}
            {__(
              'This process will likely involve providing proof of a stable and established online or real-life identity.'
            )}
          </p>

          <div className="card__actions">
            <Button href="https://chat.lbry.com" button="inverse" label={__('Join LBRY Chat')} />
          </div>
        </section>

        <section className="card card--section">
          <h2 className="card__title">{__('Or, Skip It Entirely')}</h2>
          <p className="card__subtitle">
            {__('You can continue without this step, but you will not be eligible to earn rewards.')}
          </p>

          <div className="card__actions">
            <Button navigate="/" button="primary" label={__('Skip Rewards')} />
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default UserVerify;
