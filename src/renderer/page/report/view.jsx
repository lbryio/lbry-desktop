import React from 'react';
import Button from 'component/button';
import { FormRow, FormField } from 'component/common/form';
import { Lbry, doToast } from 'lbry-redux';
import Page from 'component/page';

class ReportPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      submitting: false,
      message: '',
    };
  }

  onMessageChange(event) {
    this.setState({
      message: event.target.value,
    });
  }

  submitMessage() {
    const { message } = this.state;
    if (message) {
      this.setState({
        submitting: true,
      });
      Lbry.report_bug({ message }).then(() => {
        this.setState({
          submitting: false,
        });

        // Display global notice
        const action = doToast({
          message: __('Message received! Thanks for helping.'),
        });
        window.app.store.dispatch(action);
      });

      this.setState({ message: '' });
    }
  }

  render() {
    return (
      <Page>
        <section className="card card--section">
          <header className="card__header">
            <h2 className="card__title">{__('Report an Issue/Request a Feature')}</h2>
            <p className="card__subtitle">
              {__(
                'Please describe the problem you experienced or the feature you want to see and any information you think might be useful to us. Links to screenshots are great!'
              )}
            </p>
          </header>

          <div className="card__content">
            <FormRow>
              <FormField
                type="textarea"
                rows="10"
                name="message"
                stretch
                value={this.state.message}
                onChange={event => {
                  this.onMessageChange(event);
                }}
                placeholder={__('Description of your issue or feature request')}
              />
            </FormRow>
            <div className="card__actions">
              <Button
                button="primary"
                onClick={event => {
                  this.submitMessage(event);
                }}
                className={`button-block button-primary ${this.state.submitting ? 'disabled' : ''}`}
              >
                {this.state.submitting ? __('Submitting...') : __('Submit Report')}
              </Button>
            </div>
          </div>
        </section>

        <section className="card card--section">
          <header className="card__header">
            <h2 className="card__title">{__('Developer?')}</h2>
          </header>

          <div className="card__content">
            <p>
              {__('You can also')}{' '}
              <Button
                button="link"
                href="https://github.com/lbryio/lbry-desktop/issues"
                label={__('submit an issue on GitHub')}
              />
              .
            </p>
            <p>
              {__('Explore our')}{' '}
              <Button button="link" href="https://lbry.tech" label={__('technical resources')} />.
            </p>
            <p>
              {__('Join our')}{' '}
              <Button button="link" href="https://discourse.lbry.io/" label={__('tech forum')} />.
            </p>
          </div>
        </section>
      </Page>
    );
  }
}

export default ReportPage;
