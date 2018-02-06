// @flow
import * as React from 'react';
import type { Price } from 'page/settings';
import { FormField } from './form-field';
import { FormRow } from './form-row';

type Props = {
  price: Price,
  onChange: Price => void,
  placeholder: number,
  min: number,
  disabled: boolean,
  name: string,
  label: string,
};

export class FormFieldPrice extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    (this: any).handleAmountChange = this.handleAmountChange.bind(this);
    (this: any).handleCurrencyChange = this.handleCurrencyChange.bind(this);
  }

  handleAmountChange(event: SyntheticInputEvent<*>) {
    const { price, onChange } = this.props;
    onChange({
      currency: price.currency,
      amount: parseInt(event.target.value, 10),
    });
  }

  handleCurrencyChange(event: SyntheticInputEvent<*>) {
    const { price, onChange } = this.props;
    onChange({
      currency: event.target.value,
      amount: price.amount,
    });
  }

  render() {
    const { price, placeholder, min, disabled, name, label } = this.props;

    return (
      <FormRow padded>
        <FormField
          name={`${name}_amount`}
          label={label}
          type="number"
          className="form-field input--price-amount"
          min={min}
          value={price.amount || ''}
          onChange={this.handleAmountChange}
          placeholder={placeholder || 5}
          disabled={disabled}
        />

        <FormField
          name={`${name}_currency`}
          render={() => (
            <select
              id={`${name}_currency`}
              className="form-field"
              disabled={disabled}
              onChange={this.handleCurrencyChange}
              defaultValue={price.currency}
            >
              <option value="LBC">{__('LBRY Credits (LBC)')}</option>
              <option value="USD">{__('US Dollars')}</option>
            </select>
          )}
        />
      </FormRow>
    );
  }
}

export default FormFieldPrice;
