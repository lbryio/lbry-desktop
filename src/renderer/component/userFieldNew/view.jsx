import React from 'react';
import { Form, FormRow, Submit } from 'component/form.js';
import FormField from 'component/formField';

const countryCodes = require('country-data')
  .callingCountries.all.filter(_ => _.emoji)
  .reduce(
    (acc, cur) => acc.concat(cur.countryCallingCodes.map(_ => ({ ...cur, countryCallingCode: _ }))),
    []
  )
  .sort((a, b) => {
    if (a.countryCallingCode < b.countryCallingCode) {
      return -1;
    }
    if (a.countryCallingCode > b.countryCallingCode) {
      return 1;
    }
    return 0;
  });

class UserFieldNew extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      phone: '',
      email: '',
      country_code: '+1',
    };

    this.formatPhone = this.formatPhone.bind(this);
  }

  formatPhone(value) {
    const { country_code } = this.state;
    value = value.replace(/\D/g, '');
    if (country_code === '+1') {
      if (!value) {
        return '';
      } else if (value.length < 4) {
        return value;
      } else if (value.length < 7) {
        return `(${value.substring(0, 3)}) ${value.substring(3)}`;
      }
      const fullNumber = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(
        6
      )}`;
      return fullNumber.length <= 14 ? fullNumber : fullNumber.substring(0, 14);
    }
    return value;
  }

  formatCountryCode(value) {
    if (value) {
      return `+${value.replace(/\D/g, '')}`;
    }
    return '+1';
  }

  handleChanged(event, fieldType) {
    const formatter = {
      email: _ => _,
      phone: this.formatPhone,
      country_code: this.formatCountryCode,
    };
    this.setState({
      [fieldType]: formatter[fieldType](event.target.value),
    });
  }

  handleSelect(event) {
    this.setState({ country_code: event.target.value });
  }

  handleSubmit() {
    const { email, phone, country_code } = this.state;
    if (phone) {
      this.props.addUserPhone(phone.replace(/\D/g, ''), country_code.substring(1));
    } else {
      this.props.addUserEmail(email);
    }
  }

  render() {
    const { cancelButton, emailErrorMessage, phoneErrorMessage, isPending, fieldType } = this.props;

    return fieldType === 'phone' ? (
      <div>
        <p>
          {__(
            'Enter your phone number and we will send you a verification code. We will not share your phone number with third parties.'
          )}
        </p>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-row-phone">
            <FormField type="select" onChange={this.handleSelect.bind(this)}>
              {countryCodes.map((country, index) => (
                <option key={index} value={country.countryCallingCode}>
                  {country.emoji} {country.countryCallingCode}
                </option>
              ))}
            </FormField>
            <FormRow
              type="text"
              placeholder={this.state.country_code === '+1' ? '(555) 555-5555' : '5555555555'}
              name="phone"
              value={this.state.phone}
              errorMessage={phoneErrorMessage}
              onChange={event => {
                this.handleChanged(event, 'phone');
              }}
            />
          </div>
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
            errorMessage={emailErrorMessage}
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
