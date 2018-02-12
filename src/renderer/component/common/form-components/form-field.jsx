// @flow
import * as React from 'react';
import classnames from 'classnames';

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
  children?: React.Node,
  stretch?: boolean
};

export class FormField extends React.PureComponent<Props> {
  render() {
    const { render, label, prefix, postfix, error, helper, name, type, children, stretch, ...inputProps } = this.props;

    // Allow a type prop to determine the input or more customizability with a render prop
    let Input;
    if (type) {
      if (type === 'select') {
        Input = () => (
          <select id={name} {...inputProps}>{children}</select>
        )
      } else {
        Input = () => <input type={type} id={name} {...inputProps} />;
      }
    } else if (render) {
      Input = render;
    }

    return (
      <div className={classnames("form-field", { "form-field--stretch": stretch })}>
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
