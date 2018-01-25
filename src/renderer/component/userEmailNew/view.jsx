// I'll come back to this
/* eslint-disable */
import React from 'react';
import { Form, FormRow, Submit } from 'component/common/form';

class UserEmailNew extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
    };
  }

  handleEmailChanged(event) {
    this.setState({
      email: event.target.value,
    });
  }

  handleSubmit() {
    const { email } = this.state;
    this.props.addUserEmail(email);
  }

  render() {
    const { cancelButton, errorMessage, isPending } = this.props;

    return (
      <div>
        <p>
          {__("We'll let you know about LBRY updates, security issues, and great new content.")}
        </p>
        <p>{__("We'll never sell your email, and you can unsubscribe at any time.")}</p>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <FormRow
            type="text"
            label="Email"
            placeholder="youremail@example.org"
            name="email"
            value={this.state.email}
            errorMessage={errorMessage}
            onChange={event => {
              this.handleEmailChanged(event);
            }}
          />
          <div className="form-row-submit">
            <Submit label="Submit" disabled={isPending} />
            {cancelButton}
          </div>
        </Form>
      </div>
    );
  }
}

export default UserEmailNew;
/* eslint-enable */
