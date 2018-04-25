// I'll come back to this
/* eslint-disable */
import React from 'react';
import { Form, FormRow, FormField, Submit } from 'component/common/form';

const os = require('os').type();
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

class UserPhoneNew extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      phone: '',
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

  handleChanged(event) {
    this.setState({
      phone: this.formatPhone(event.target.value),
    });
  }

  handleSelect(event) {
    this.setState({ country_code: event.target.value });
  }

  handleSubmit() {
    const { phone, country_code } = this.state;
    this.props.addUserPhone(phone.replace(/\D/g, ''), country_code.substring(1));
  }

  render() {
    const { cancelButton, phoneErrorMessage, isPending } = this.props;

    return (
      <div>
        <p>
          {__(
            'Enter your phone number and we will send you a verification code. We will not share your phone number with third parties.'
          )}
        </p>
        <Form onSubmit={this.handleSubmit.bind(this)}>
          <FormRow>
            <FormField type="select" name="country-codes" onChange={this.handleSelect.bind(this)}>
              {countryCodes.map((country, index) => (
                <option key={index} value={country.countryCallingCode}>
                  {os === 'Darwin' ? country.emoji : `(${country.alpha2})`}{' '}
                  {country.countryCallingCode}
                </option>
              ))}
            </FormField>
            <FormField
              type="text"
              placeholder={this.state.country_code === '+1' ? '(555) 555-5555' : '5555555555'}
              name="phone"
              value={this.state.phone}
              error={phoneErrorMessage}
              onChange={event => {
                this.handleChanged(event);
              }}
            />
          </FormRow>
          <div className="card__actions card__actions--center">
            <Submit label="Submit" disabled={isPending} />
            {cancelButton}
          </div>
        </Form>
      </div>
    );
  }
}

export default UserPhoneNew;
/* eslint-enable */
