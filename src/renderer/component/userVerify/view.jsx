// @flow
import * as React from 'react';
import Button from 'component/button';
import CardVerify from 'component/cardVerify';
import Lbryio from 'lbryinc';
import * as icons from 'constants/icons';

type Props = {
  errorMessage: ?string,
  isPending: boolean,
  navigate: string => void,
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
    const { errorMessage, isPending, navigate, verifyPhone } = this.props;
    return (
      <React.Fragment>
        <section className="card card--section">
          <div className="card__title">
            <h1>{__('Final Human Proof')}</h1>
          </div>
          <div className="card__content">
            <p>
              Finally, please complete <strong>one and only one</strong> of the options below.
            </p>
          </div>
        </section>
        <section className="card card--section">
          <div className="card__title">{__('1) Proof via Credit')}</div>
          <p className="card__content">
            {`${__(
              'If you have a valid credit or debit card, you can use it to instantly prove your humanity.'
            )} ${__('There is no charge at all for this, now or in the future.')} `}
          </p>
          <div className="card__actions">
            {errorMessage && <p className="form-field__error">{errorMessage}</p>}
            <CardVerify
              label={__('Perform Card Verification')}
              disabled={isPending}
              token={this.onToken}
              stripeKey={Lbryio.getStripeToken()}
            />
          </div>
          <div className="card__content">
            <div className="meta">
              {__('A $1 authorization may temporarily appear with your provider.')}{' '}
              <Button
                button="link"
                href="https://lbry.io/faq/identity-requirements"
                label={__('Read more about why we do this.')}
              />
            </div>
          </div>
        </section>
        <section className="card card--section">
          <div className="card__title">{__('2) Proof via Phone')}</div>
          <p className="card__content">
            {`${__(
              'You will receive an SMS text message confirming that your phone number is correct.'
            )}`}
          </p>
          <div className="card__actions">
            <Button
              onClick={() => {
                verifyPhone();
              }}
              button="primary"
              icon={icons.PHONE}
              label={__('Submit Phone Number')}
            />
          </div>
          <div className="card__content">
            <div className="meta">
              {__('Standard messaging rates apply. Having trouble?')}{' '}
              <Button button="link" href="https://lbry.io/faq/phone" label={__('Read more.')} />
            </div>
          </div>
        </section>
        <section className="card card--section">
          <div className="card__title">{__('3) Proof via Chat')}</div>
          <div className="card__content">
            <p>
              {__(
                'A moderator capable of approving you is typically available in the #verification channel of our chat room.'
              )}
            </p>
            <p>
              {__(
                'This process will likely involve providing proof of a stable and established online or real-life identity.'
              )}
            </p>
          </div>
          <div className="card__actions">
            <Button
              href="https://chat.lbry.io"
              button="primary"
              icon={icons.MESSAGE}
              label={__('Join LBRY Chat')}
            />
          </div>
        </section>
        <section className="card card--section">
          <div className="card__title">{__('Or, Skip It Entirely')}</div>
          <p className="card__content">
            {__(
              'You can continue without this step, but you will not be eligible to earn rewards.'
            )}
          </p>
          <div className="card__actions">
            <Button
              onClick={() => navigate('/discover')}
              button="primary"
              label={__('Skip Rewards')}
            />
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default UserVerify;
