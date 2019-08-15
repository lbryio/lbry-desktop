// @flow
import * as React from 'react';
import { FormField, Form } from 'component/common/form';
import Button from 'component/button';
import { Lbryio } from 'lbryinc';
import analytics from 'analytics';

type Props = {
  cancelButton: React.Node,
  errorMessage: ?string,
  isPending: boolean,
  addUserEmail: string => void,
};

type State = {
  email: string,
};

class UserEmailNew extends React.PureComponent<Props, State> {
  constructor() {
    super();

    this.state = {
      email: '',
    };

    (this: any).handleSubmit = this.handleSubmit.bind(this);
    (this: any).handleEmailChanged = this.handleEmailChanged.bind(this);
  }

  handleEmailChanged(event: SyntheticInputEvent<*>) {
    this.setState({
      email: event.target.value,
    });
  }

  handleSubmit() {
    const { email } = this.state;
    const { addUserEmail } = this.props;
    addUserEmail(email);
    analytics.emailProvidedEvent();

    // @if TARGET='web'
    Lbryio.call('user_tag', 'edit', { add: 'lbrytv' });
    // @endif
  }

  render() {
    const { cancelButton, errorMessage, isPending } = this.props;

    return (
      <React.Fragment>
        <h2 className="card__title">{__('Verify Your Email')}</h2>
        <p className="card__subtitle">
          {/* @if TARGET='app' */}
          {__("We'll let you know about LBRY updates, security issues, and great new content.")}
          {/* @endif */}
          {/* @if TARGET='web' */}
          {__('Stay up to date with lbry.tv and be the first to know about the progress we make.')}
          {/* @endif */}
        </p>

        <Form onSubmit={this.handleSubmit}>
          <FormField
            type="email"
            label="Email"
            placeholder="youremail@example.org"
            name="email"
            value={this.state.email}
            error={errorMessage}
            onChange={this.handleEmailChanged}
            inputButton={
              <Button type="submit" button="inverse" label="Submit" disabled={isPending || !this.state.email} />
            }
          />
        </Form>
        <div className="card__actions">{cancelButton}</div>
        <p className="help">{__('Your email address will never be sold and you can unsubscribe at any time.')}</p>
      </React.Fragment>
    );
  }
}

export default UserEmailNew;
