// @flow
import * as React from 'react';
import { Form, FormField, Submit } from 'component/common/form';
import Card from 'component/common/card';

const os = require('os').type();
const countryCodes = require('country-data')
  .callingCountries.all.filter(_ => _.emoji)
  .reduce((acc, cur) => acc.concat(cur.countryCallingCodes.map(_ => ({ ...cur, countryCallingCode: _ }))), [])
  .sort((a, b) => {
    if (a.countryCallingCode < b.countryCallingCode) {
      return -1;
    }
    if (a.countryCallingCode > b.countryCallingCode) {
      return 1;
    }
    return 0;
  });

type Props = {
  addUserPhone: (string, string) => void,
  cancelButton: React.Node,
  phoneErrorMessage: ?string,
  isPending: boolean,
};

type State = {
  phone: string,
  countryCode: string,
};

class UserPhoneNew extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      phone: '',
      countryCode: '+1',
    };

    (this: any).formatPhone = this.formatPhone.bind(this);
    (this: any).handleSubmit = this.handleSubmit.bind(this);
    (this: any).handleSelect = this.handleSelect.bind(this);
  }

  formatPhone(value: string) {
    const { countryCode } = this.state;
    const formattedNumber = value.replace(/\D/g, '');

    if (countryCode === '+1') {
      if (!formattedNumber) {
        return '';
      } else if (formattedNumber.length < 4) {
        return formattedNumber;
      } else if (formattedNumber.length < 7) {
        return `(${formattedNumber.substring(0, 3)}) ${formattedNumber.substring(3)}`;
      }
      const fullNumber = `(${formattedNumber.substring(0, 3)}) ${formattedNumber.substring(
        3,
        6
      )}-${formattedNumber.substring(6)}`;
      return fullNumber.length <= 14 ? fullNumber : fullNumber.substring(0, 14);
    }
    return formattedNumber;
  }

  handleChanged(event: SyntheticInputEvent<*>) {
    this.setState({
      phone: this.formatPhone(event.target.value),
    });
  }

  handleSelect(event: SyntheticInputEvent<*>) {
    this.setState({ countryCode: event.target.value });
  }

  handleSubmit() {
    const { phone, countryCode } = this.state;
    this.props.addUserPhone(phone.replace(/\D/g, ''), countryCode.substring(1));
  }

  render() {
    const { cancelButton, phoneErrorMessage, isPending } = this.props;

    return (
      <Card
        title={__('Enter your phone number')}
        subtitle={__(
          'Enter your phone number and we will send you a verification code. We will not share your phone number with third parties.'
        )}
        actions={
          <Form onSubmit={this.handleSubmit}>
            <fieldset-group class="fieldset-group--smushed">
              <FormField label={__('Country')} type="select" name="country-codes" onChange={this.handleSelect}>
                {countryCodes.map((country, index) => (
                  <option key={index} value={country.countryCallingCode}>
                    {os === 'Darwin' ? country.emoji : `(${country.alpha2})`} {country.countryCallingCode}
                  </option>
                ))}
              </FormField>
              <FormField
                type="text"
                label={__('Number')}
                placeholder={this.state.countryCode === '+1' ? '(555) 555-5555' : '5555555555'}
                name="phone"
                value={this.state.phone}
                error={phoneErrorMessage}
                onChange={event => {
                  this.handleChanged(event);
                }}
              />
            </fieldset-group>
            <div className="card__actions">
              <Submit label="Submit" disabled={isPending} />
              {cancelButton}
            </div>
          </Form>
        }
      />
    );
  }
}

export default UserPhoneNew;
