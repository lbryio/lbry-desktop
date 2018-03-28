// @flow
import * as React from 'react';
import classnames from 'classnames';
import SimpleMDE from 'react-simplemde-editor';
import style from 'react-simplemde-editor/dist/simplemde.min.css'; // eslint-disable-line no-unused-vars

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
    const {
      render,
      label,
      prefix,
      postfix,
      error,
      helper,
      name,
      type,
      children,
      stretch,
      ...inputProps
    } = this.props;

    let input;
    if (type) {
      if (type === 'select') {
        input = (
          <select id={name} {...inputProps}>
            {children}
          </select>
        );
      } else if (type === 'markdown') {
        input = (
          <div className="form-field--SimpleMDE">
            <SimpleMDE
              {...inputProps}
              type="textarea"
              options={{ hideIcons: ['heading', 'image', 'fullscreen', 'side-by-side'] }}
            />
          </div>
        );
      } else {
        input = <input type={type} id={name} {...inputProps} />;
      }
    }

    return (
      <div
        className={classnames('form-field', {
          'form-field--stretch': stretch || type === 'markdown',
        })}
      >
        {(label || error) && (
          <label
            className={classnames('form-field__label', { 'form-field__error': error })}
            htmlFor={name}
          >
            {!error && label}
            {error}
          </label>
        )}
        <div className="form-field__input">
          {prefix && (
            <label htmlFor={name} className="form-field__prefix">
              {prefix}
            </label>
          )}
          {input}
          {postfix && (
            <label htmlFor={name} className="form-field__postfix">
              {postfix}
            </label>
          )}
        </div>
        {helper && (
          <label htmlFor={name} className="form-field__help">
            {helper}
          </label>
        )}
      </div>
    );
  }
}

export default FormField;
