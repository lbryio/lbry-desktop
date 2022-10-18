// @flow
import * as React from 'react';
import { FormField } from './form-field';

type FormPrice = {
  amount: number,
  currency: string,
};

type Props = {
  price: FormPrice,
  onChange: (FormPrice) => void,
  onBlur?: (any) => void,
  placeholder?: number,
  min: number,
  disabled?: boolean,
  name: string,
  step?: number,
  currencies?: Array<'LBC' | CurrencyOption>,
};

const DEFAULT_CURRENCIES = Object.freeze(['LBC', 'USD']);

const CURRENCY_LABELS = Object.freeze({
  LBC: 'LBRY Credits',
  USD: 'US Dollars',
  EUR: 'Euros',
});

type State = {
  // Clients of FormFieldPrice expect the return to always be a number (not
  // null, not string). This state serves as an intermediary to allow the field
  // to be emptied (instead of showing the annoying 0) while translating that
  // value to 0 to the client.
  // Firefox requires the variable to be `number` as well =.=
  amount: number,
};

export class FormFieldPrice extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      amount: props.price.amount,
    };

    (this: any).handleAmountChange = this.handleAmountChange.bind(this);
    (this: any).handleCurrencyChange = this.handleCurrencyChange.bind(this);
    (this: any).handleBlur = this.handleBlur.bind(this);
  }

  handleAmountChange(event: SyntheticInputEvent<*>) {
    const { price, onChange } = this.props;

    this.setState({
      amount: parseFloat(event.target.value),
    });

    const amount = event.target.value ? parseFloat(event.target.value) : 0;
    onChange({
      currency: price.currency,
      amount,
    });
  }

  handleCurrencyChange(event: SyntheticInputEvent<*>) {
    const { price, onChange } = this.props;
    onChange({
      currency: event.target.value,
      amount: price.amount,
    });
  }

  handleBlur(event: SyntheticInputEvent<*>) {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur(event);
    }
  }

  render() {
    const { price, placeholder, min, disabled, name, step, currencies } = this.props;
    const { amount } = this.state;

    return (
      <fieldset-group class="fieldset-group--smushed">
        <FormField
          name={`${name}_amount`}
          label={__('Price')}
          type="number"
          className="form-field--price-amount"
          min={min}
          value={price.amount || amount}
          onWheel={(e) => e.preventDefault()}
          onChange={this.handleAmountChange}
          onBlur={this.handleBlur}
          placeholder={placeholder || 5}
          disabled={disabled}
          step={step || 'any'}
        />
        <FormField
          label={__('Currency')}
          name={`${name}_currency`}
          type="select"
          id={`${name}_currency`}
          className="input--currency-select"
          disabled={disabled}
          onChange={this.handleCurrencyChange}
          value={price.currency}
        >
          {(currencies || DEFAULT_CURRENCIES).map((c) => (
            <option key={c} value={c}>
              {__(CURRENCY_LABELS[c] || c)}
            </option>
          ))}
        </FormField>
      </fieldset-group>
    );
  }
}

export default FormFieldPrice;
