// @ts-expect-error - TS2882 (ts-migration)
import "easymde/dist/easymde.min.css";
import { FF_MAX_CHARS_DEFAULT } from "constants/form-field";
import { openEditorMenu, stopContextMenu } from "util/context-menu";
import * as ICONS from "constants/icons";
import Button from "component/button";
import MarkdownPreview from "component/common/markdown-preview";
import React from "react";
import ReactDOMServer from "react-dom/server";
import SimpleMDE from "react-simplemde-editor";
import TextareaWithSuggestions from "component/textareaWithSuggestions";
import type { ElementRef, ReactNode } from "react";

type Props = {
  autoFocus?: boolean;
  blockWrap: boolean;
  charCount?: number;
  children?: React.ReactNode;
  disabled?: boolean;
  helper?: string | React.ReactNode;
  hideSuggestions?: boolean;
  isLivestream?: boolean;
  label?: string | React.ReactNode;
  labelOnLeft: boolean;
  name: string;
  noEmojis?: boolean;
  placeholder?: string | number;
  quickActionLabel?: string;
  textAreaMaxLength?: number;
  type?: string;
  value?: string | number;
  onChange?: (arg1?: any) => any;
  openEmoteMenu?: () => void;
  quickActionHandler?: (arg1?: any) => any;
  render?: () => React.ReactElement;
  header?: React.ReactNode;
};

export class FormFieldAreaAdvanced extends React.PureComponent<Props> {
  static defaultProps = { labelOnLeft: false, blockWrap: true };

  input: {
    current: ElementRef<any>;
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
      autoFocus,
      blockWrap,
      charCount,
      children,
      helper,
      hideSuggestions,
      isLivestream,
      label,
      header,
      labelOnLeft,
      name,
      noEmojis,
      quickActionLabel,
      textAreaMaxLength,
      type,
      openEmoteMenu,
      quickActionHandler,
      render,
      ...inputProps
    } = this.props;

    // Ideally, the character count should (and can) be appended to the
    // SimpleMDE's "options::status" bar. However, I couldn't figure out how
    // to pass the current value to it's callback, nor query the current
    // text length from the callback. So, we'll use our own widget.
    const hasCharCount = charCount !== undefined && charCount >= 0;
    const countInfo = hasCharCount && textAreaMaxLength !== undefined && (
      <span className="comment__char-count-mde">{`${charCount || "0"}/${textAreaMaxLength}`}</span>
    );

    const quickAction =
      quickActionLabel && quickActionHandler ? (
        <div className="form-field__quick-action">
          {/* @ts-expect-error - TS2322 (ts-migration) */}
          <Button button="link" onClick={quickActionHandler} label={quickActionLabel} />
        </div>
      ) : null;

    const input = () => {
      switch (type) {
        case "markdown":
          const handleEvents = { contextmenu: openEditorMenu } as const;

          const getInstance = (editor: unknown) => {
            // SimpleMDE max char check
            // @ts-expect-error - TS2339 - Property 'codemirror' does not exist on type 'unknown'.
            editor.codemirror.on("beforeChange", (instance, changes) => {
              if (textAreaMaxLength && changes.update) {
                let str = changes.text.join("\n");
                let delta = str.length - (instance.indexFromPos(changes.to) - instance.indexFromPos(changes.from));

                if (delta <= 0) return;

                delta = instance.getValue().length + delta - textAreaMaxLength;
                if (delta > 0) {
                  str = str.substring(0, str.length - delta);
                  changes.update(changes.from, changes.to, str.split("\n"));
                }
              }
            });

            // "Create Link (Ctrl-K)": highlight URL instead of label:
            // @ts-expect-error - TS2339 - Property 'codemirror' does not exist on type 'unknown'.
            editor.codemirror.on("changes", (instance, changes) => {
              try {
                // Grab the last change from the buffered list. I assume the
                // buffered one ('changes', instead of 'change') is more efficient,
                // and that "Create Link" will always end up last in the list.
                const lastChange = changes[changes.length - 1];
                if (lastChange.origin === "+input") {
                  // https://github.com/Ionaru/easy-markdown-editor/blob/8fa54c496f98621d5f45f57577ce630bee8c41ee/src/js/easymde.js#L765
                  const EASYMDE_URL_PLACEHOLDER = "(https://)";

                  // The URL placeholder is always placed last, so just look at the
                  // last text in the array to also cover the multi-line case:
                  const urlLineText = lastChange.text[lastChange.text.length - 1];

                  if (urlLineText.endsWith(EASYMDE_URL_PLACEHOLDER) && urlLineText !== "[]" + EASYMDE_URL_PLACEHOLDER) {
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
                        { line: to.line, ch: baseIndex + urlLineText.lastIndexOf("(") + 1 },
                        { line: to.line, ch: baseIndex + urlLineText.lastIndexOf(")") }
                      );
                    }, 25);
                  }
                }
              } catch (e: any) {} // Do nothing (revert to original behavior)
            });
          };

          return (
            <div className="form-field--SimpleMDE" onContextMenu={stopContextMenu}>
              {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
              <fieldset-section>
                {!header && (
                  <div className="form-field__two-column">
                    <div>
                      <label htmlFor={name}>{label}</label>
                    </div>
                    {quickAction}
                  </div>
                )}
                {!!header && <div className="form-field__textarea-header">{header}</div>}
                <SimpleMDE
                  {...inputProps}
                  id={name}
                  type="textarea"
                  // @ts-expect-error - TS2322 - SimpleMDE types each event as CodeMirror's on() overloads, not as a handler
                  events={handleEvents}
                  getMdeInstance={getInstance}
                  options={{
                    spellChecker: true,
                    hideIcons: ["heading", "image", "fullscreen", "side-by-side"],
                    previewRender(plainText: unknown) {
                      // @ts-expect-error - TS2322 - Type 'unknown' is not assignable to type 'string'.
                      const preview = <MarkdownPreview content={plainText} noDataStore />;
                      return ReactDOMServer.renderToString(preview);
                    },
                  }}
                />
                {countInfo}
                {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
              </fieldset-section>
            </div>
          );
        case "textarea":
          return (
            // @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'.
            <fieldset-section>
              {!header && (label || quickAction) && (
                <div className="form-field__two-column">
                  <label htmlFor={name}>{label}</label>
                  {quickAction}
                </div>
              )}
              {!!header && <div className="form-field__textarea-header">{header}</div>}
              {hideSuggestions ? (
                <textarea
                  type={type}
                  id={name}
                  maxLength={textAreaMaxLength || FF_MAX_CHARS_DEFAULT}
                  // @ts-expect-error - TS2322 - Type '{ current: unknown; }' is not assignable to type 'LegacyRef<HTMLTextAreaElement>'.
                  ref={this.input}
                  {...inputProps}
                />
              ) : (
                <TextareaWithSuggestions
                  type={type}
                  id={name}
                  maxLength={textAreaMaxLength || FF_MAX_CHARS_DEFAULT}
                  inputRef={this.input}
                  isLivestream={isLivestream}
                  {...inputProps}
                />
              )}
              <div className="form-field__textarea-info">
                {!noEmojis && openEmoteMenu && (
                  <Button
                    // @ts-expect-error - TS2322 (ts-migration)
                    type="alt"
                    className="button--comment-icons"
                    title="Emotes"
                    onClick={openEmoteMenu}
                    icon={ICONS.EMOJI}
                    iconSize={20}
                  />
                )}
                {countInfo}
              </div>
              {/* @ts-expect-error - TS2339 - Property 'fieldset-section' does not exist on type 'JSX.IntrinsicElements'. */}
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

export default FormFieldAreaAdvanced;
