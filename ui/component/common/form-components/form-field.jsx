// @flow
import 'easymde/dist/easymde.min.css';
import { FF_MAX_CHARS_DEFAULT } from 'constants/form-field';
import React from 'react';
import type { ElementRef, Node } from 'react';

type Props = {
  affixClass?: string, // class applied to prefix/postfix label
  autoFocus?: boolean,
  blockWrap: boolean,
  charCount?: number,
  children?: React$Node,
  defaultValue?: string | number,
  disabled?: boolean,
  error?: string | boolean,
  helper?: string | React$Node,
  inputButton?: React$Node,
  label?: string | Node,
  labelOnLeft: boolean,
  max?: number,
  min?: number,
  name: string,
  placeholder?: string | number,
  postfix?: string,
  prefix?: string,
  range?: number,
  readOnly?: boolean,
  stretch?: boolean,
  textAreaMaxLength?: number,
  type?: string,
  value?: string | number,
  onChange?: (any) => any,
  render?: () => React$Node,
};

export class FormField extends React.PureComponent<Props> {
  static defaultProps = { labelOnLeft: false, blockWrap: true };

  input: { current: ElementRef<any> };

  constructor(props: Props) {
    super(props);
    this.input = React.createRef();
  }

  componentDidMount() {
    const { autoFocus } = this.props;
    const input = this.input.current;

    if (input && autoFocus) input.focus();
  }

  render() {
    const {
      affixClass,
      autoFocus,
      blockWrap,
      charCount,
      children,
      error,
      helper,
      inputButton,
      label,
      labelOnLeft,
      name,
      postfix,
      prefix,
      stretch,
      textAreaMaxLength,
      type,
      render,
      ...inputProps
    } = this.props;

    const errorMessage = typeof error === 'object' ? error.message : error;

    // Ideally, the character count should (and can) be appended to the
    // SimpleMDE's "options::status" bar. However, I couldn't figure out how
    // to pass the current value to it's callback, nor query the current
    // text length from the callback. So, we'll use our own widget.
    const hasCharCount = charCount !== undefined && charCount >= 0;
    const countInfo = hasCharCount && textAreaMaxLength !== undefined && (
      <span className="comment__char-count-mde">{`${charCount || '0'}/${textAreaMaxLength}`}</span>
    );
    const Wrapper = blockWrap
      ? ({ children: innerChildren }) => <fieldset-section class="radio">{innerChildren}</fieldset-section>
      : ({ children: innerChildren }) => <span className="radio">{innerChildren}</span>;

    const inputSimple = (type: string) => (
      <>
        <input id={name} type={type} {...inputProps} />
        <label htmlFor={name}>{label}</label>
      </>
    );

    const inputSelect = (selectClass: string) => (
      <fieldset-section class={selectClass}>
        {(label || errorMessage) && (
          <label htmlFor={name}>{errorMessage ? <span className="error__text">{errorMessage}</span> : label}</label>
        )}
        <select id={name} {...inputProps}>
          {children}
        </select>
      </fieldset-section>
    );

    const input = () => {
      switch (type) {
        case 'radio':
          return <Wrapper>{inputSimple('radio')}</Wrapper>;
        case 'checkbox':
          return <div className="checkbox">{inputSimple('checkbox')}</div>;
        case 'range':
          return <div>{inputSimple('range')}</div>;
        case 'select':
          return inputSelect('');
        case 'select-tiny':
          return inputSelect('select--slim');
        case 'textarea':
          return (
            <fieldset-section>
              {label && (
                <div className="form-field__two-column">
                  <label htmlFor={name}>{label}</label>
                </div>
              )}
              <textarea
                type={type}
                id={name}
                maxLength={textAreaMaxLength || FF_MAX_CHARS_DEFAULT}
                ref={this.input}
                {...inputProps}
              />
              <div className="form-field__textarea-info">{countInfo}</div>
            </fieldset-section>
          );
        default:
          const inputElement = <input type={type} id={name} {...inputProps} ref={this.input} />;
          const inner = inputButton ? (
            <input-submit>
              {inputElement}
              {inputButton}
            </input-submit>
          ) : (
            inputElement
          );

          return (
            <fieldset-section>
              {(label || errorMessage) && (
                <label htmlFor={name}>
                  {errorMessage ? <span className="error__text">{errorMessage}</span> : label}
                </label>
              )}
              {prefix && <label htmlFor={name}>{prefix}</label>}
              {inner}
            </fieldset-section>
          );
      }
    };

    return (
      <>
        {type && input()}
        {helper && <div className="form-field__help">{helper}</div>}
      </>
    );
  }
}

export default FormField;
