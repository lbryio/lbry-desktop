import React from 'react';
import Link from 'component/link';
import CardVerify from 'component/cardVerify';
import lbryio from 'lbryio.js';

class UserVerify extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
    };
  }

  handleCodeChanged(event) {
    this.setState({
      code: event.target.value,
    });
  }

  onToken(data) {
    this.props.verifyUserIdentity(data.id);
  }

  render() {
    const { errorMessage, isPending, navigate, verifyPhone, modal } = this.props;
    return (
      <div>
        <section className="card card--form">
          <div className="card__title-primary">
            <h1>{__('Final Human Proof')}</h1>
          </div>
          <div className="card__content">
            <p>
              Finally, please complete <strong>one and only one</strong> of the options below.
            </p>
          </div>
        </section>
        <section className="card card--form">
          <div className="card__title-primary">
            <h3>{__('1) Proof via Credit')}</h3>
          </div>
          <div className="card__content">
            {`${__(
              'If you have a valid credit or debit card, you can use it to instantly prove your humanity.'
            )} ${__('There is no charge at all for this, now or in the future.')} `}
          </div>
          <div className="card__actions">
            {errorMessage && <p className="form-field__error">{errorMessage}</p>}
            <CardVerify
              label={__('Perform Card Verification')}
              disabled={isPending}
              token={this.onToken.bind(this)}
              stripeKey={lbryio.getStripeToken()}
            />
          </div>
          <div className="card__content">
            <div className="meta">
              {__('A $1 authorization may temporarily appear with your provider.')}{' '}
              <Link
                href="https://lbry.io/faq/identity-requirements"
                label={__('Read more about why we do this.')}
              />
            </div>
          </div>
        </section>
        <section className="card card--form">
          <div className="card__title-primary">
            <h3>{__('2) Proof via Phone')}</h3>
          </div>
          <div className="card__content">
            {`${__(
              'You will receive an SMS text message confirming that your phone number is correct.'
            )}`}
          </div>
          <div className="card__actions">
            <Link
              onClick={() => {
                verifyPhone();
              }}
              button="alt"
              icon="icon-phone"
              label={__('Submit Phone Number')}
            />
          </div>
          <div className="card__content">
            <div className="meta">
              {__('Standard messaging rates apply. Having trouble?')}{' '}
              <Link href="https://lbry.io/faq/phone" label={__('Learn more.')} />
            </div>
          </div>
        </section>
        <section className="card card--form">
          <div className="card__title-primary">
            <h3>{__('3) Proof via YouTube')}</h3>
          </div>
          <div className="card__content">
            <p>
              {__(
                'If you have a YouTube account with subscribers and views, you can sync your account and content to be granted instant verification.'
              )}
            </p>
            <p>
              {__('Some account minimums apply.')}{' '}
              <Link href="https://lbry.io/faq/youtube" label={__('Read more.')} />
            </p>
          </div>
          <div className="card__actions">
            <Link
              href="https://api.lbry.io/yt/connect"
              button="alt"
              icon="icon-youtube"
              label={__('YouTube Account Sync')}
            />
          </div>
          <div className="card__content">
            <div className="meta">
              This will not automatically refresh after approval. Once you have synced your account,
              just navigate away or click <Link navigate="/rewards" label="here" />.
            </div>
          </div>
        </section>
        <section className="card card--form">
          <div className="card__title-primary">
            <h3>{__('4) Proof via Chat')}</h3>
          </div>
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
            <Link
              href="https://chat.lbry.io"
              button="alt"
              icon="icon-comments"
              label={__('Join LBRY Chat')}
            />
          </div>
        </section>
        <section className="card card--form">
          <div className="card__title-primary">
            <h5>{__('Or, Skip It Entirely')}</h5>
          </div>
          <div className="card__content">
            <p className="meta">
              {__(
                'You can continue without this step, but you will not be eligible to earn rewards.'
              )}
            </p>
          </div>
          <div className="card__actions">
            <Link onClick={() => navigate('/discover')} button="alt" label={__('Skip Rewards')} />
          </div>
        </section>
      </div>
    );
  }
}

export default UserVerify;
