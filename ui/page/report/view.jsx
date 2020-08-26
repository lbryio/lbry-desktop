import React, { Fragment } from 'react';
import Button from 'component/button';
import { FormField } from 'component/common/form';
import { doToast } from 'redux/actions/notifications';
import { Lbryio } from 'lbryinc';
import Page from 'component/page';
import Card from 'component/common/card';
import I18nMessage from 'component/i18nMessage';

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
      Lbryio.call('event', 'desktop_error', { error_message: message }).then(() => {
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
        <div className="card-stack">
          <Card
            title={__('Report an issue or request a feature')}
            subtitle={__(
              'Please describe the problem you experienced or the feature you want to see and any information you think might be useful to us. Links to screenshots are great!'
            )}
            actions={
              <Fragment>
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

                <div className="section__actions">
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
              </Fragment>
            }
          />

          <Card
            title={__('Developer?')}
            actions={
              <Fragment>
                <div dir="auto" className="markdown-preview">
                  <p>{__('You can also:')}</p>
                  <ul>
                    <li>
                      <Button
                        button="link"
                        href="https://github.com/lbryio/lbry-desktop/issues"
                        label={__('Submit an issue on GitHub')}
                      />
                      .
                    </li>
                    <li>
                      <I18nMessage
                        tokens={{
                          technical_resources: (
                            <Button button="link" href="https://lbry.tech" label={__('technical resources')} />
                          ),
                        }}
                      >
                        Explore our %technical_resources%
                      </I18nMessage>
                      .
                    </li>
                    <li>
                      <I18nMessage
                        tokens={{
                          tech_forum: <Button button="link" href="https://forum.lbry.tech" label={__('tech forum')} />,
                        }}
                      >
                        Join our %tech_forum%
                      </I18nMessage>
                      .
                    </li>
                  </ul>
                </div>
              </Fragment>
            }
          />
        </div>
      </Page>
    );
  }
}

export default ReportPage;
