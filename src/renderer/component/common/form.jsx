// @flow
/* eslint-disable react/no-multi-comp */
import * as React from 'react';
import Button from 'component/link';

type FormRowProps = {
  children: React.Node,
};

export const FormRow = (props: FormRowProps) => {
  const { children } = props;
  return <div className="form-row">{children}</div>;
};

type FormFieldProps = {
  render: () => React.Node,
  label?: string,
  prefix?: string,
  postfix?: string,
  error?: string | boolean,
};

export class FormField extends React.PureComponent<FormFieldProps> {
  render() {
    const { render, label, prefix, postfix, error } = this.props;
    return (
      <div className="form-field">
        {label && (
            <label className="form-field__label">
              {label}
            </label>
          )}
        <div className="form-field__wrapper">
          {prefix && <span className="form-field__prefix">{prefix}</span>}
          {render()}
          {postfix && <span className="form-field__postfix">{postfix}</span>}
        </div>
        {error && (
          <div className="form-field__error">
            {typeof error === 'string' ? error : __('There was an error')}
          </div>
        )}
      </div>
    );
  }
}

type SubmitProps = {
  label: string,
  disabled: boolean,
};

export class Submit extends React.PureComponent<SubmitProps> {
  static defaultProps = {
    label: 'Submit',
  };

  render() {
    const { label, disabled } = this.props;
    return <Button type="submit" label={label} disabled={disabled} />;
  }
}

type FormProps = {
  children: React.Node,
  onSubmit: any => any,
};

export class Form extends React.PureComponent<FormProps> {
  render() {
    const { children, onSubmit } = this.props;
    return (
      <form
        className="form"
        onSubmit={event => {
          event.preventDefault();
          onSubmit(event);
        }}
      >
        {children}
      </form>
    );
  }
}
/* eslint-enable react/no-multi-comp */
