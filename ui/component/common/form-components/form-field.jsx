// @flow
import 'easymde/dist/easymde.min.css';
import { FF_MAX_CHARS_DEFAULT } from 'constants/form-field';
import { openEditorMenu, stopContextMenu } from 'util/context-menu';
import { lazyImport } from 'util/lazyImport';
import Button from 'component/button';
import MarkdownPreview from 'component/common/markdown-preview';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SimpleMDE from 'react-simplemde-editor';
import type { ElementRef, Node } from 'react';
import Drawer from '@mui/material/Drawer';
import CommentSelectors from 'component/commentCreate/comment-selectors';

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
  label?: string | Node,
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
  commentSelectorsProps?: any,
  showSelectors?: boolean,
  submitButtonRef?: any,
  tipModalOpen?: boolean,
  onChange?: (any) => any,
  setShowSelectors?: (boolean) => void,
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
    const { autoFocus } = this.props;
    const input = this.input.current;

    if (input && autoFocus) input.focus();
  }

  componentDidUpdate() {
    const { showSelectors, slimInput } = this.props;
    const input = this.input.current;

    // Opened selectors (emoji/sticker) -> blur input and hide keyboard
    if (slimInput && showSelectors && input) input.blur();
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
      commentSelectorsProps,
      showSelectors,
      submitButtonRef,
      tipModalOpen,
      quickActionHandler,
      setShowSelectors,
      render,
      handleTip,
      handleSubmit,
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

    const quickAction =
      quickActionLabel && quickActionHandler ? (
        <div className="form-field__quick-action">
          <Button button="link" onClick={quickActionHandler} label={quickActionLabel} />
        </div>
      ) : null;

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
        case 'textarea':
          return (
            <fieldset-section>
              <TextareaWrapper
                isDrawerOpen={Boolean(this.state.drawerOpen)}
                toggleDrawer={() => this.setState({ drawerOpen: !this.state.drawerOpen })}
                closeSelector={setShowSelectors ? () => setShowSelectors(false) : () => {}}
                commentSelectorsProps={commentSelectorsProps}
                showSelectors={Boolean(showSelectors)}
                slimInput={slimInput}
                tipModalOpen={tipModalOpen}
              >
                {(!slimInput || this.state.drawerOpen) && (label || quickAction) && (
                  <div className="form-field__two-column">
                    <label htmlFor={name}>{label}</label>
                    {quickAction}
                    {countInfo}
                  </div>
                )}

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
                      toggleSelectors={setShowSelectors ? () => setShowSelectors(!showSelectors) : undefined}
                      handleTip={handleTip}
                      handleSubmit={() => {
                        if (handleSubmit) handleSubmit();
                        if (slimInput) this.setState({ drawerOpen: false });
                      }}
                      claimIsMine={commentSelectorsProps && commentSelectorsProps.claimIsMine}
                      {...inputProps}
                      handlePreventClick={
                        !this.state.drawerOpen ? () => this.setState({ drawerOpen: true }) : undefined
                      }
                      autoFocus={this.state.drawerOpen}
                      submitButtonRef={submitButtonRef}
                    />
                  </React.Suspense>
                )}
              </TextareaWrapper>
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

type TextareaWrapperProps = {
  slimInput?: boolean,
  children: Node,
  isDrawerOpen: boolean,
  showSelectors?: boolean,
  commentSelectorsProps?: any,
  tipModalOpen?: boolean,
  toggleDrawer: () => void,
  closeSelector?: () => void,
};

function TextareaWrapper(wrapperProps: TextareaWrapperProps) {
  const {
    children,
    slimInput,
    isDrawerOpen,
    commentSelectorsProps,
    showSelectors,
    tipModalOpen,
    toggleDrawer,
    closeSelector,
  } = wrapperProps;

  function handleCloseAll() {
    toggleDrawer();
    if (closeSelector) closeSelector();
  }

  return slimInput ? (
    !isDrawerOpen ? (
      <div role="button" onClick={toggleDrawer}>
        {children}
      </div>
    ) : (
      <Drawer
        className="comment-create--drawer"
        anchor="bottom"
        open
        onClose={handleCloseAll}
        // The Modal tries to enforce focus when open and doesn't allow clicking or changing any
        // other input boxes, so in this case it is disabled when trying to type in a custom tip
        ModalProps={{ disableEnforceFocus: tipModalOpen }}
      >
        {children}

        {showSelectors && <CommentSelectors closeSelector={closeSelector} {...commentSelectorsProps} />}
      </Drawer>
    )
  ) : (
    <>{children}</>
  );
}
