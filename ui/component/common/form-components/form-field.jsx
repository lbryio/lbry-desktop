// @flow
import type { ElementRef, Node } from 'react';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SimpleMDE from 'react-simplemde-editor';
import MarkdownPreview from 'component/common/markdown-preview';
import { openEditorMenu, stopContextMenu } from 'util/context-menu';
import { FF_MAX_CHARS_DEFAULT } from 'constants/form-field';
import 'easymde/dist/easymde.min.css';
import Button from 'component/button';
import emoji from 'emoji-dictionary';

const QUICK_EMOJIS = [
  emoji.getUnicode('rocket'),
  emoji.getUnicode('jeans'),
  emoji.getUnicode('fire'),
  emoji.getUnicode('heart'),
  emoji.getUnicode('open_mouth'),
];

type Props = {
  name: string,
  label?: string | Node,
  render?: () => React$Node,
  prefix?: string,
  postfix?: string,
  error?: string | boolean,
  helper?: string | React$Node,
  type?: string,
  onChange?: (any) => any,
  defaultValue?: string | number,
  placeholder?: string | number,
  children?: React$Node,
  stretch?: boolean,
  affixClass?: string, // class applied to prefix/postfix label
  autoFocus?: boolean,
  labelOnLeft: boolean,
  inputButton?: React$Node,
  blockWrap: boolean,
  charCount?: number,
  textAreaMaxLength?: number,
  range?: number,
  min?: number,
  max?: number,
  quickActionLabel?: string,
  quickActionHandler?: (any) => any,
  disabled?: boolean,
  onChange: (any) => void,
  value?: string | number,
  noEmojis?: boolean,
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
      textAreaMaxLength,
      quickActionLabel,
      quickActionHandler,
      noEmojis,
      ...inputProps
    } = this.props;
    const errorMessage = typeof error === 'object' ? error.message : error;
    const Wrapper = blockWrap
      ? ({ children: innerChildren }) => <fieldset-section class="radio">{innerChildren}</fieldset-section>
      : ({ children: innerChildren }) => <span className="radio">{innerChildren}</span>;

    const quickAction =
      quickActionLabel && quickActionHandler ? (
        <div className="form-field__quick-action">
          <Button button="link" onClick={quickActionHandler} label={quickActionLabel} />
        </div>
      ) : null;

    let input;
    if (type) {
      if (type === 'radio') {
        input = (
          <Wrapper>
            <input id={name} type="radio" {...inputProps} />
            <label htmlFor={name}>{label}</label>
          </Wrapper>
        );
      } else if (type === 'checkbox') {
        input = (
          <div className="checkbox">
            <input id={name} type="checkbox" {...inputProps} />
            <label htmlFor={name}>{label}</label>
          </div>
        );
      } else if (type === 'range') {
        input = (
          <div>
            <input id={name} type="range" {...inputProps} />
            <label htmlFor={name}>{label}</label>
          </div>
        );
      } else if (type === 'select') {
        input = (
          <fieldset-section>
            {(label || errorMessage) && (
              <label htmlFor={name}>{errorMessage ? <span className="error__text">{errorMessage}</span> : label}</label>
            )}
            <select id={name} {...inputProps}>
              {children}
            </select>
          </fieldset-section>
        );
      } else if (type === 'select-tiny') {
        input = (
          <fieldset-section class="select--slim">
            {(label || errorMessage) && (
              <label htmlFor={name}>{errorMessage ? <span className="error__text">{errorMessage}</span> : label}</label>
            )}
            <select id={name} {...inputProps}>
              {children}
            </select>
          </fieldset-section>
        );
      } else if (type === 'markdown') {
        const handleEvents = {
          contextmenu: openEditorMenu,
        };

        const getInstance = (editor) => {
          // SimpleMDE max char check
          editor.codemirror.on('beforeChange', (instance, changes) => {
            if (textAreaMaxLength && changes.update) {
              var str = changes.text.join('\n');
              var delta = str.length - (instance.indexFromPos(changes.to) - instance.indexFromPos(changes.from));
              if (delta <= 0) {
                return;
              }
              delta = instance.getValue().length + delta - textAreaMaxLength;
              if (delta > 0) {
                str = str.substr(0, str.length - delta);
                changes.update(changes.from, changes.to, str.split('\n'));
              }
            }
          });

          // "Create Link (Ctrl-K)": highlight URL instead of label:
          editor.codemirror.on('changes', (instance, changes) => {
            try {
              // Grab the last change from the buffered list. I assume the
              // buffered one ('changes', instead of 'change') is more efficient,
              // and that "Create Link" will always end up last in the list.
              const lastChange = changes[changes.length - 1];
              if (lastChange.origin === '+input') {
                // https://github.com/Ionaru/easy-markdown-editor/blob/8fa54c496f98621d5f45f57577ce630bee8c41ee/src/js/easymde.js#L765
                const EASYMDE_URL_PLACEHOLDER = '(https://)';

                // The URL placeholder is always placed last, so just look at the
                // last text in the array to also cover the multi-line case:
                const urlLineText = lastChange.text[lastChange.text.length - 1];

                if (urlLineText.endsWith(EASYMDE_URL_PLACEHOLDER) && urlLineText !== '[]' + EASYMDE_URL_PLACEHOLDER) {
                  const from = lastChange.from;
                  const to = lastChange.to;
                  const isSelectionMultiline = lastChange.text.length > 1;
                  const baseIndex = isSelectionMultiline ? 0 : from.ch;

                  // Everything works fine for the [Ctrl-K] case, but for the
                  // [Button] case, this handler happens before the original
                  // code, thus our change got wiped out.
                  // Add a small delay to handle that case.
                  setTimeout(() => {
                    instance.setSelection(
                      { line: to.line, ch: baseIndex + urlLineText.lastIndexOf('(') + 1 },
                      { line: to.line, ch: baseIndex + urlLineText.lastIndexOf(')') }
                    );
                  }, 25);
                }
              }
            } catch (err) {
              // Do nothing (revert to original behavior)
            }
          });
        };

        // Ideally, the character count should (and can) be appended to the
        // SimpleMDE's "options::status" bar. However, I couldn't figure out how
        // to pass the current value to it's callback, nor query the current
        // text length from the callback. So, we'll use our own widget.
        const hasCharCount = charCount !== undefined && charCount >= 0;
        const countInfo = hasCharCount && textAreaMaxLength !== undefined && (
          <span className="comment__char-count-mde">{`${charCount || '0'}/${textAreaMaxLength}`}</span>
        );

        input = (
          <div className="form-field--SimpleMDE" onContextMenu={stopContextMenu}>
            <fieldset-section>
              <div className="form-field__two-column">
                <div>
                  <label htmlFor={name}>{label}</label>
                </div>
                {quickAction}
              </div>
              <SimpleMDE
                {...inputProps}
                id={name}
                type="textarea"
                events={handleEvents}
                getMdeInstance={getInstance}
                options={{
                  spellChecker: true,
                  hideIcons: ['heading', 'image', 'fullscreen', 'side-by-side'],
                  previewRender(plainText) {
                    const preview = <MarkdownPreview content={plainText} noDataStore />;
                    return ReactDOMServer.renderToString(preview);
                  },
                }}
              />
              {countInfo}
            </fieldset-section>
          </div>
        );
      } else if (type === 'textarea') {
        const hasCharCount = charCount !== undefined && charCount >= 0;
        const countInfo = hasCharCount && textAreaMaxLength !== undefined && (
          <span className="comment__char-count">{`${charCount || '0'}/${textAreaMaxLength}`}</span>
        );
        input = (
          <fieldset-section>
            {(label || quickAction) && (
              <div className="form-field__two-column">
                <div>
                  <label htmlFor={name}>{label}</label>
                </div>
                {quickAction}
              </div>
            )}
            <textarea
              type={type}
              id={name}
              maxLength={textAreaMaxLength || FF_MAX_CHARS_DEFAULT}
              ref={this.input}
              {...inputProps}
            />
            <div className="form-field__textarea-info">
              {!noEmojis && (
                <div className="form-field__quick-emojis">
                  {QUICK_EMOJIS.map((emoji) => (
                    <Button
                      key={emoji}
                      disabled={inputProps.disabled}
                      type="button"
                      className="button--emoji"
                      label={emoji}
                      onClick={() => {
                        inputProps.onChange({
                          target: { value: inputProps.value ? `${inputProps.value} ${emoji}` : emoji },
                        });
                      }}
                    />
                  ))}
                </div>
              )}
              {countInfo}
            </div>
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
              {(label || errorMessage) && (
                <label htmlFor={name}>
                  {errorMessage ? <span className="error__text">{errorMessage}</span> : label}
                </label>
              )}
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
