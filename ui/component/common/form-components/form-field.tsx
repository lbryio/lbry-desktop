// @ts-expect-error - TS2882 (ts-migration)
import 'easymde/dist/easymde.min.css';
import { FF_MAX_CHARS_DEFAULT } from 'constants/form-field';
import React from 'react';
import type { ElementRef, ReactNode } from 'react';

type Props = {
  affixClass?: string // class applied to prefix/postfix label,
  autoFocus?: boolean,
  blockWrap: boolean,
  charCount?: number,
  children?: React.ReactNode,
  defaultValue?: string | number,
  disabled?: boolean,
  error?: string | boolean,
  helper?: string | React.ReactNode,
  inputButton?: React.ReactNode,
  label?: string | React.ReactNode,
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
  onChange?: (arg1?: any) => any,
  render?: () => React.ReactElement
};

export class FormField extends React.PureComponent<Props> {
  static defaultProps = { labelOnLeft: false, blockWrap: true };

  input: {
    current: ElementRef<any>
  };

  constructor(props: Props) {
    super(props);
    this.input = React.createRef();
  }

  componentDidMount() {
    const { autoFocus } = this.props;
    const input = this.input.current;

// @ts-expect-error - TS2339 - Property 'focus' does not exist on type 'unknown'.
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

// @ts-expect-error - TS2339 - Property 'message' does not exist on type 'never'.
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
// @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. | TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'.
      ? ({ children: innerChildren }) => <fieldset-section class="radio">{innerChildren}</fieldset-section>
      : ({ children: innerChildren }) => <span className="radio">{innerChildren}</span>;

    const inputSimple = (type: string) => (
      <>
{ /* @ts-expect-error - TS2322 - Type '{ defaultValue?: string | number; disabled?: boolean; max?: number; min?: number; placeholder?: string | number; range?: number; readOnly?: boolean; value?: string | number; onChange?: (arg1?: any) => any; id: string; type: string; }' is not assignable to type 'DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>'. */}
        <input id={name} type={type} {...inputProps} />
        <label htmlFor={name}>{label}</label>
      </>
    );

    const inputSelect = (selectClass: string) => (
// @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'.
      <fieldset-section class={selectClass}>
        {(label || errorMessage) && (
          <label htmlFor={name}>{errorMessage ? <span className="error__text">{errorMessage}</span> : label}</label>
        )}
{ /* @ts-expect-error - TS2322 - Type '{ children: ReactNode; defaultValue?: string | number; disabled?: boolean; max?: number; min?: number; placeholder?: string | number; range?: number; readOnly?: boolean; value?: string | number; onChange?: (arg1?: any) => any; id: string; }' is not assignable to type 'DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>'. */}
        <select id={name} {...inputProps}>
          {children}
        </select>
{ /* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
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
// @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'.
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
// @ts-expect-error - TS2322 - Type '{ current: unknown; }' is not assignable to type 'LegacyRef<HTMLTextAreaElement>'.
                ref={this.input}
                {...inputProps}
              />
              <div className="form-field__textarea-info">{countInfo}</div>
{ /* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
            </fieldset-section>
          );
        default:
// @ts-expect-error - TS2322 - Type '{ current: unknown; }' is not assignable to type 'LegacyRef<HTMLInputElement>'.
          const inputElement = <input type={type} id={name} {...inputProps} ref={this.input} />;
          const inner = inputButton ? (
// @ts-expect-error - TS2339 - Property 'input-submit' does not exist on type 'JSX.IntrinsicElements'.
            <input-submit>
              {inputElement}
              {inputButton}
{ /* @ts-expect-error - TS2339 - Property 'input-submit' does not exist on type 'JSX.IntrinsicElements'. */}
            </input-submit>
          ) : (
            inputElement
          );

          return (
// @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'.
            <fieldset-section>
              {(label || errorMessage) && (
                <label htmlFor={name}>
                  {errorMessage ? <span className="error__text">{errorMessage}</span> : label}
                </label>
              )}
              {prefix && <label htmlFor={name}>{prefix}</label>}
              {inner}
{ /* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
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
