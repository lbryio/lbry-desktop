import * as React from "react";
import { FormField } from "./form-field";

type FormPrice = {
  amount: number;
  currency: string;
};

type Props = {
  price: FormPrice;
  onChange: (arg1: FormPrice) => void;
  placeholder: number;
  min: number;
  disabled: boolean;
  name: string;
  step: number | null | undefined;
};

export class FormFieldPrice extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    (this as any).handleAmountChange = this.handleAmountChange.bind(this);
    (this as any).handleCurrencyChange = this.handleCurrencyChange.bind(this);
  }

  handleAmountChange(event: React.ChangeEvent<any>) {
    const { price, onChange } = this.props;
    const amount = event.target.value ? parseFloat(event.target.value) : 0;
    onChange({
      currency: price.currency,
      amount,
    });
  }

  handleCurrencyChange(event: React.ChangeEvent<any>) {
    const { price, onChange } = this.props;
    onChange({
      currency: event.target.value,
      amount: price.amount,
    });
  }

  render() {
    const { price, placeholder, min, disabled, name, step } = this.props;

    return (
      // @ts-expect-error - TS2339 - Property 'fieldset-group' does not exist on type 'JSX.IntrinsicElements'.
      <fieldset-group class="fieldset-group--smushed">
        <FormField
          name={`${name}_amount`}
          label={__("Price")}
          type="number"
          // @ts-expect-error - TS2322 - Type '{ name: string; label: string; type: string; className: string; min: number; value: number; onWheel: (e: any) => any; onChange: (event: ChangeEvent<any>) => void; placeholder: number; disabled: boolean; step: string | number; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
          className="form-field--price-amount"
          min={min}
          value={price.amount}
          onWheel={(e) => e.preventDefault()}
          onChange={this.handleAmountChange}
          placeholder={placeholder || 5}
          disabled={disabled}
          step={step || "any"}
        />
        <FormField
          label={__("Currency")}
          name={`${name}_currency`}
          type="select"
          // @ts-expect-error - TS2322 - Type '{ children: Element[]; label: string; name: string; type: string; id: string; className: string; disabled: boolean; onChange: (event: ChangeEvent<any>) => void; value: string; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<FormField> & Pick<Readonly<Props> & Readonly<{ children?: ReactNode; }>, "error" | ... 22 more ... | "onChange"> & InexactPartial<...> & InexactPartial<...>'.
          id={`${name}_currency`}
          className="input--currency-select"
          disabled={disabled}
          onChange={this.handleCurrencyChange}
          value={price.currency}
        >
          <option value="LBC">{__("LBRY Credits")}</option>
          <option value="USD">{__("US Dollars")}</option>
        </FormField>
        {/* @ts-expect-error - TS2339 - Property 'fieldset-group' does not exist on type 'JSX.IntrinsicElements'. */}
      </fieldset-group>
    );
  }
}

export default FormFieldPrice;
