// @flow
import * as React from 'react';
import { FormField, Form, FormRow, Submit } from 'component/common/form';

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
  }

  render() {
    const { cancelButton, errorMessage, isPending } = this.props;

    return (
      <span>
        <p>
          {__("We'll let you know about LBRY updates, security issues, and great new content.")}
        </p>

        <p>
          {__(
            'In addition, your email address will never be sold and you can unsubscribe at any time.'
          )}
        </p>

        <Form onSubmit={this.handleSubmit}>
          <FormRow padded>
            <FormField
              stretch
              type="email"
              label="Email"
              placeholder="youremail@example.org"
              name="email"
              value={this.state.email}
              error={errorMessage}
              onChange={this.handleEmailChanged}
            />
          </FormRow>

          <div className="card__actions">
            <Submit label="Submit" disabled={isPending} />
            {cancelButton}
          </div>
        </Form>
      </span>
    );
  }
}

export default UserEmailNew;
