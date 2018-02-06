// @flow
import * as React from 'react';

type Props = {
  name: string,
  label?: string,
  render?: () => React.Node,
  prefix?: string,
  postfix?: string,
  error?: string | boolean,
  helper?: string | React.Node,
  type?: string,
  onChange?: any => any,
  defaultValue?: string | number,
  placeholder?: string | number,
};

export class FormField extends React.PureComponent<Props> {
  render() {
    const { render, label, prefix, postfix, error, helper, name, type, ...inputProps } = this.props;

    // Allow a type prop to determine the input or more customizability with a render prop
    let Input;
    if (type) {
      Input = () => <input type={type} id={name} {...inputProps} />;
    } else if (render) {
      Input = render;
    }

    return (
      <div className="form-field">
        {label && (
          <label className="form-field__label" htmlFor={name}>
            {label}
          </label>
        )}
        <div className="form-field__input">
          {prefix && (
            <label htmlFor={name} className="form-field__prefix">
              {prefix}
            </label>
          )}
          {Input && <Input />}
          {postfix && (
            <label htmlFor={name} className="form-field__postfix">
              {postfix}
            </label>
          )}
        </div>
        {error && (
          <div className="form-field__error">
            {typeof error === 'string' ? error : __('There was an error')}
          </div>
        )}
        {helper && <div className="form-field__help">{helper}</div>}
      </div>
    );
  }
}

export default FormField;
