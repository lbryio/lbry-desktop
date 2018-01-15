import React from 'react';
import { Form, FormRow, Submit } from 'component/form.js';

class UserFieldNew extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      phone: '',
      email: '',
    };
  }

  handleChanged(event, fieldType) {
    this.setState({
      [fieldType]: event.target.value,
    });
  }

  handleSubmit() {
    const { email, phone } = this.state;
    if (phone) {
      this.props.addUserPhone(phone);
    } else {
      this.props.addUserEmail(email);
    }
  }

  render() {
    const { cancelButton, errorMessage, isPending, fieldType } = this.props;

    return fieldType === 'phone' ? (
      <div>
        <p>
          {__(
            'Enter your phone number and we will send you a verification code. We will not share your phone number with third parties.'
          )}
        </p>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <FormRow
            type="text"
            label="Phone"
            placeholder="(555) 555-5555"
            name="phone"
            value={this.state.phone}
            errorMessage={errorMessage}
            onChange={event => {
              this.handleChanged(event, 'phone');
            }}
          />
          <div className="form-row-submit">
            <Submit label="Submit" disabled={isPending} />
            {cancelButton}
          </div>
        </Form>
      </div>
    ) : (
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
              this.handleChanged(event, 'email');
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

export default UserFieldNew;
