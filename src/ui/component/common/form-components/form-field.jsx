// @flow
import type { ElementRef } from 'react';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SimpleMDE from 'react-simplemde-editor';
import MarkdownPreview from 'component/common/markdown-preview-internal';
import { openEditorMenu, stopContextMenu } from 'util/context-menu';
import { MAX_CHARACTERS_IN_COMMENT as defaultTextAreaLimit } from 'constants/comments';
import 'easymde/dist/easymde.min.css';

type Props = {
  name: string,
  label?: string,
  render?: () => React$Node,
  prefix?: string,
  postfix?: string,
  error?: string | boolean,
  helper?: string | React$Node,
  type?: string,
  onChange?: any => any,
  defaultValue?: string | number,
  placeholder?: string | number,
  children?: React$Node,
  stretch?: boolean,
  affixClass?: string, // class applied to prefix/postfix label
  firstInList?: boolean, // at the top of a list, no padding top
  autoFocus?: boolean,
  labelOnLeft: boolean,
  inputProps?: {
    disabled?: boolean,
  },
  inputButton?: React$Node,
  blockWrap: boolean,
  charCount?: number,
  textAreaMaxLength?: number,
};

export class FormField extends React.PureComponent<Props> {
  static defaultProps = {
    labelOnLeft: false,
    blockWrap: true,
  };

  input: { current: ElementRef<any> };

  constructor(props: Props) {
    super(props);
    this.input = React.createRef();
  }

  componentDidMount() {
    const { autoFocus } = this.props;
    const input = this.input.current;

    if (input && autoFocus) {
      input.focus();
    }
  }

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
      affixClass,
      autoFocus,
      inputButton,
      labelOnLeft,
      blockWrap,
      charCount,
      textAreaMaxLength = defaultTextAreaLimit,
      ...inputProps
    } = this.props;
    const errorMessage = typeof error === 'object' ? error.message : error;

    const Wrapper = blockWrap
      ? ({ children: innerChildren }) => <fieldset-section>{innerChildren}</fieldset-section>
      : ({ children: innerChildren }) => <React.Fragment>{innerChildren}</React.Fragment>;

    let input;
    if (type) {
      if (type === 'radio') {
        input = (
          <Wrapper>
            <radio-element>
              <input id={name} type="radio" {...inputProps} />
              <label htmlFor={name}>{label}</label>
              <radio-toggle onClick={inputProps.onChange} />
            </radio-element>
          </Wrapper>
        );
      } else if (type === 'checkbox') {
        // web components treat props weird
        // we need to fully remove it for proper component:attribute css styling
        // $FlowFixMe
        const elementProps = inputProps.disabled ? { disabled: true } : {};
        input = (
          <Wrapper>
            <checkbox-element {...elementProps}>
              <input id={name} type="checkbox" {...inputProps} tabIndex={0} />
              <label htmlFor={name} tabIndex={-1}>
                {label}
              </label>
              <checkbox-toggle onClick={inputProps.onChange} tabIndex={-1} />
            </checkbox-element>
          </Wrapper>
        );
      } else if (type === 'select') {
        input = (
          <fieldset-section>
            {label && <label htmlFor={name}>{label}</label>}
            <select id={name} {...inputProps}>
              {children}
            </select>
          </fieldset-section>
        );
      } else if (type === 'markdown') {
        const handleEvents = {
          contextmenu: openEditorMenu,
        };

        input = (
          <div className="form-field--SimpleMDE" onContextMenu={stopContextMenu}>
            <fieldset-section>
              <label htmlFor={name}>{label}</label>
              <SimpleMDE
                {...inputProps}
                id={name}
                type="textarea"
                events={handleEvents}
                options={{
                  spellChecker: false,
                  hideIcons: ['heading', 'image', 'fullscreen', 'side-by-side'],
                  previewRender(plainText) {
                    const preview = <MarkdownPreview content={plainText} />;
                    return ReactDOMServer.renderToString(preview);
                  },
                }}
              />
            </fieldset-section>
          </div>
        );
      } else if (type === 'textarea') {
        const hasCharCount = charCount !== undefined && charCount >= 0;
        const countInfo = hasCharCount && (
          <span className="comment__char-count">{`${charCount || '0'}/${textAreaMaxLength}`}</span>
        );
        input = (
          <fieldset-section>
            <label htmlFor={name}>{label}</label>
            <textarea type={type} id={name} maxLength={textAreaMaxLength} {...inputProps} />
            {countInfo}
          </fieldset-section>
        );
      } else {
        const inputElement = <input type={type} id={name} {...inputProps} ref={this.input} />;
        const inner = inputButton ? (
          <input-submit>
            {inputElement}
            {inputButton}
          </input-submit>
        ) : (
          inputElement
        );

        input = (
          <React.Fragment>
            <fieldset-section>
              <label htmlFor={name}>{errorMessage ? <span className="error-text">{errorMessage}</span> : label}</label>
              {prefix && <label htmlFor={name}>{prefix}</label>}
              {inner}
            </fieldset-section>
          </React.Fragment>
        );
      }
    }

    return (
      <React.Fragment>
        {input}

        {helper && <div className="form-field__help">{helper}</div>}
      </React.Fragment>
    );
  }
}

export default FormField;
