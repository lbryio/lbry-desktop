import PropTypes from 'prop-types';
import React from 'react';
import Button from 'component/button';
import { FormField, FormRow } from 'component/common/form';

import lbry from '../../lbry';

class ReportPage extends React.Component {
  static propTypes = {
    doShowSnackBar: PropTypes.func.isRequired,
  };

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
    const { doShowSnackBar } = this.props;
    const { message } = this.state;

    if (message) {
      this.setState({
        submitting: true,
      });
      lbry.report_bug({ message }).then(() => {
        this.setState({
          submitting: false,
        });

        // Display global notice
        doShowSnackBar({ message: __('Message received! Thanks for helping.'), isError: false });
      });

      this.setState({ message: '' });
    }
  }

  render() {
    return (
      <main className="main main--contained">
        <section className="card card--section">
          <div className="card__title">{__('Report an Issue')}</div>
          <div className="card__subtitle">
            {__(
              'Please describe the problem you experienced and any information you think might be useful to us. Links to screenshots are great!'
            )}
          </div>
          <FormRow>
            <FormField
              name="message"
              onChange={event => {
                this.onMessageChange(event);
              }}
              placeholder={__('Description of your issue')}
              rows="10"
              stretch
              type="textarea"
              value={this.state.message}
            />
          </FormRow>
          <div className="card__actions">
            <Button
              button="primary"
              className={`button-block button-primary ${this.state.submitting ? 'disabled' : ''}`}
              onClick={event => {
                this.submitMessage(event);
              }}
            >
              {this.state.submitting ? __('Submitting...') : __('Submit Report')}
            </Button>
          </div>
        </section>
        <section className="card card--section">
          <div className="card__title">{__('Developer?')}</div>
          <div className="card__subtitle">
            {__('You can also')}{' '}
            <Button
              button="link"
              href="https://github.com/lbryio/lbry/issues"
              label={__('submit an issue on GitHub')}
            />.
          </div>
        </section>
      </main>
    );
  }
}

export default ReportPage;
