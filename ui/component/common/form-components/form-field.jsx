// @flow
import 'easymde/dist/easymde.min.css';

import { FF_MAX_CHARS_DEFAULT } from 'constants/form-field';
import { openEditorMenu, stopContextMenu } from 'util/context-menu';
import { lazyImport } from 'util/lazyImport';
import MarkdownPreview from 'component/common/markdown-preview';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SimpleMDE from 'react-simplemde-editor';
import type { ElementRef } from 'react';
import { InputSimple, BlockWrapWrapper } from './input-simple';
import { InputSelect } from './input-select';
import { CountInfo, QuickAction, Label } from './common';
import { TextareaWrapper } from './slim-input-field';

// prettier-ignore
const TextareaWithSuggestions = lazyImport(() => import('component/textareaWithSuggestions' /* webpackChunkName: "suggestions" */));

type Props = {
  uri?: string,
  affixClass?: string, // class applied to prefix/postfix label
  autoFocus?: boolean,
  blockWrap: boolean,
  charCount?: number,
  children?: React$Node,
  defaultValue?: string | number,
  disabled?: boolean,
  error?: string | boolean,
  helper?: string | React$Node,
  hideSuggestions?: boolean,
  inputButton?: React$Node,
  isLivestream?: boolean,
  label?: any,
  labelOnLeft: boolean,
  max?: number,
  min?: number,
  name: string,
  placeholder?: string | number,
  postfix?: string,
  prefix?: string,
  quickActionLabel?: string,
  range?: number,
  readOnly?: boolean,
  stretch?: boolean,
  textAreaMaxLength?: number,
  type?: string,
  value?: string | number,
  slimInput?: boolean,
  slimInputButtonRef?: any,
  commentSelectorsProps?: any,
  showSelectors?: any,
  submitButtonRef?: any,
  tipModalOpen?: boolean,
  noticeLabel?: any,
  onSlimInputClose?: () => void,
  onChange?: (any) => any,
  setShowSelectors?: ({ tab?: string, open: boolean }) => void,
  quickActionHandler?: (any) => any,
  render?: () => React$Node,
  handleTip?: (isLBC: boolean) => any,
  handleSubmit?: () => any,
};

type State = {
  drawerOpen: boolean,
};

export class FormField extends React.PureComponent<Props, State> {
  static defaultProps = { labelOnLeft: false, blockWrap: true };

  input: { current: ElementRef<any> };

  constructor(props: Props) {
    super(props);
    this.input = React.createRef();

    this.state = {
      drawerOpen: false,
    };
  }

  componentDidMount() {
    const { autoFocus, showSelectors, slimInput } = this.props;
    const input = this.input.current;

    if (input && autoFocus) input.focus();
    if (slimInput && showSelectors && showSelectors.open && input) input.blur();
  }

  render() {
    const {
      uri,
      affixClass,
      autoFocus,
      blockWrap,
      charCount,
      children,
      error,
      helper,
      hideSuggestions,
      inputButton,
      isLivestream,
      label,
      labelOnLeft,
      name,
      postfix,
      prefix,
      quickActionLabel,
      stretch,
      textAreaMaxLength,
      type,
      slimInput,
      slimInputButtonRef,
      commentSelectorsProps,
      showSelectors,
      submitButtonRef,
      tipModalOpen,
      noticeLabel,
      onSlimInputClose,
      quickActionHandler,
      setShowSelectors,
      render,
      handleTip,
      handleSubmit,
      ...inputProps
    } = this.props;

    const errorMessage = typeof error === 'object' ? error.message : error;

    const wrapperProps = { type, helper };
    const labelProps = { name, label };
    const countInfoProps = { charCount, textAreaMaxLength };
    const quickActionProps = { label: quickActionLabel, quickActionHandler };
    const inputSimpleProps = { name, label, ...inputProps };
    const inputSelectProps = { name, error, label, children, ...inputProps };

    switch (type) {
      case 'radio':
        return (
          <FormFieldWrapper {...wrapperProps}>
            <BlockWrapWrapper blockWrap={blockWrap}>
              <InputSimple {...inputSimpleProps} type="radio" />
            </BlockWrapWrapper>
          </FormFieldWrapper>
        );
      case 'checkbox':
        return (
          <FormFieldWrapper {...wrapperProps}>
            <div className="checkbox">
              <InputSimple {...inputSimpleProps} type="checkbox" />
            </div>
          </FormFieldWrapper>
        );
      case 'range':
        return (
          <FormFieldWrapper {...wrapperProps}>
            <div className="range">
              <InputSimple {...inputSimpleProps} type="range" />
            </div>
          </FormFieldWrapper>
        );
      case 'select':
        return (
          <FormFieldWrapper {...wrapperProps}>
            <InputSelect {...inputSelectProps} />
          </FormFieldWrapper>
        );
      case 'select-tiny':
        return (
          <FormFieldWrapper {...wrapperProps}>
            <InputSelect {...inputSelectProps} className="select--slim" />
          </FormFieldWrapper>
        );
      case 'markdown':
        const handleEvents = { contextmenu: openEditorMenu };

        const getInstance = (editor) => {
          // SimpleMDE max char check
          editor.codemirror.on('beforeChange', (instance, changes) => {
            if (textAreaMaxLength && changes.update) {
              var str = changes.text.join('\n');
              var delta = str.length - (instance.indexFromPos(changes.to) - instance.indexFromPos(changes.from));

              if (delta <= 0) return;

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
            } catch (e) {} // Do nothing (revert to original behavior)
          });
        };

        return (
          <FormFieldWrapper {...wrapperProps}>
            <div className="form-field--SimpleMDE" onContextMenu={stopContextMenu}>
              <fieldset-section>
                <div className="form-field__two-column">
                  <div>
                    <Label {...labelProps} />
                  </div>

                  <QuickAction {...quickActionProps} />
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

                <CountInfo {...countInfoProps} />
              </fieldset-section>
            </div>
          </FormFieldWrapper>
        );
      case 'textarea':
        const closeSelector =
          setShowSelectors && showSelectors
            ? () => setShowSelectors({ tab: showSelectors.tab || undefined, open: false })
            : () => {};

        return (
          <FormFieldWrapper {...wrapperProps}>
            <fieldset-section>
              <TextareaWrapper
                isDrawerOpen={Boolean(this.state.drawerOpen)}
                toggleDrawer={() => this.setState({ drawerOpen: !this.state.drawerOpen })}
                closeSelector={closeSelector}
                commentSelectorsProps={commentSelectorsProps}
                showSelectors={Boolean(showSelectors && showSelectors.open)}
                slimInput={slimInput}
                slimInputButtonRef={slimInputButtonRef}
                onSlimInputClose={onSlimInputClose}
                tipModalOpen={tipModalOpen}
              >
                {(!slimInput || this.state.drawerOpen) && label && (
                  <div className="form-field__two-column">
                    <Label {...labelProps} />

                    <QuickAction {...quickActionProps} />

                    <CountInfo {...countInfoProps} />
                  </div>
                )}

                {noticeLabel}

                {hideSuggestions ? (
                  <textarea
                    type={type}
                    id={name}
                    maxLength={textAreaMaxLength || FF_MAX_CHARS_DEFAULT}
                    ref={this.input}
                    {...inputProps}
                  />
                ) : (
                  <React.Suspense fallback={null}>
                    <TextareaWithSuggestions
                      uri={uri}
                      type={type}
                      id={name}
                      maxLength={textAreaMaxLength || FF_MAX_CHARS_DEFAULT}
                      inputRef={this.input}
                      isLivestream={isLivestream}
                      toggleSelectors={
                        setShowSelectors && showSelectors
                          ? () => {
                              const input = this.input.current;
                              if (!showSelectors.open && input) input.blur();
                              setShowSelectors({ tab: showSelectors.tab || undefined, open: !showSelectors.open });
                            }
                          : undefined
                      }
                      handleTip={handleTip}
                      handleSubmit={() => {
                        if (handleSubmit) handleSubmit();
                        if (slimInput) this.setState({ drawerOpen: false });
                        closeSelector();
                      }}
                      claimIsMine={commentSelectorsProps && commentSelectorsProps.claimIsMine}
                      {...inputProps}
                      slimInput={slimInput}
                      handlePreventClick={
                        !this.state.drawerOpen ? () => this.setState({ drawerOpen: true }) : undefined
                      }
                      autoFocus={this.state.drawerOpen && (!showSelectors || !showSelectors.open)}
                      submitButtonRef={submitButtonRef}
                    />
                  </React.Suspense>
                )}
              </TextareaWrapper>
            </fieldset-section>
          </FormFieldWrapper>
        );
      default:
        const inputElementProps = { type, name, ref: this.input, ...inputProps };

        return (
          <FormFieldWrapper {...wrapperProps}>
            <fieldset-section>
              {(label || errorMessage) && <Label {...labelProps} errorMessage={errorMessage} />}

              {prefix && <label htmlFor={name}>{prefix}</label>}

              {inputButton ? (
                <input-submit>
                  <input {...inputElementProps} />
                  {inputButton}
                </input-submit>
              ) : (
                <input {...inputElementProps} />
              )}
            </fieldset-section>
          </FormFieldWrapper>
        );
    }
  }
}

export default FormField;

type WrapperProps = {
  type?: string,
  children?: any,
  helper?: any,
};

const FormFieldWrapper = (wrapperProps: WrapperProps) => {
  const { type, children, helper } = wrapperProps;

  return (
    <>
      {type && children}
      {helper && <div className="form-field__help">{helper}</div>}
    </>
  );
};
