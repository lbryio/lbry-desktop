// @flow
import * as React from 'react';
import classnames from 'classnames';
import Icon from 'component/common/icon';
import FormRow from './form-row';
import SimpleMDE from 'react-simplemde-editor';
import style from 'react-simplemde-editor/dist/simplemde.min.css';

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
  stretch?: boolean,
};

export class FormField extends React.PureComponent<Props> {
  render() {
    const { render, label, prefix, postfix, error, helper, name, type, children, stretch, ...inputProps } = this.props;

    let Input;
    if (type) {
      if (type === 'select') {
        Input = <select id={name} {...inputProps}>{children}</select>
      } else if (type === 'markdown') {
        Input = (
          <div className="form-field--SimpleMDE">
            <SimpleMDE {...inputProps} type="textarea" options={{ hideIcons: ['heading', 'image', 'fullscreen', 'side-by-side'] }} />
          </div>
        )
      } else {
        Input = <input type={type} id={name} {...inputProps} />;
      }
    }

    return (
      <div className={classnames("form-field", { "form-field--stretch": stretch || type === "markdown" })}>
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
          {Input}
          {postfix && (
            <label htmlFor={name} className="form-field__postfix">
              {postfix}
            </label>
          )}
        </div>
        {(helper || error) && (
          <label htmlFor={name} className={classnames("form-field__help", { "form-field__error": error })}>
            {!error && helper}
            {error}
          </label>
        )}
      </div>
    );
  }
}

export default FormField;
