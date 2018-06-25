// @flow
import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import classnames from 'classnames';
import MarkdownPreview from 'component/common/markdown-preview';
import SimpleMDE from 'react-simplemde-editor';
import 'simplemde/dist/simplemde.min.css';
import Toggle from 'react-toggle';
import { openEditorMenu } from 'util/contextMenu';

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
  affixClass?: string, // class applied to prefix/postfix label
  useToggle?: boolean,
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
      affixClass,
      useToggle,
      ...inputProps
    } = this.props;

    const errorMessage = typeof error === 'object' ? error.message : error;

    let input;
    if (type) {
      if (type === 'select') {
        input = (
          <select className="form-field__select" id={name} {...inputProps}>
            {children}
          </select>
        );
      } else if (type === 'markdown') {
        const stopContextMenu = event => {
          event.preventDefault();
          event.stopPropagation();
        };
        const handleEvents = {
          contextmenu(codeMirror, event) {
            openEditorMenu(event, codeMirror);
          },
        };
        input = (
          <div className="form-field--SimpleMDE" onContextMenu={stopContextMenu}>
            <SimpleMDE
              {...inputProps}
              type="textarea"
              events={handleEvents}
              options={{
                hideIcons: ['heading', 'image', 'fullscreen', 'side-by-side'],
                previewRender(plainText) {
                  const preview = <MarkdownPreview content={plainText} />;
                  return ReactDOMServer.renderToString(preview);
                },
              }}
            />
          </div>
        );
      } else if (type === 'textarea') {
        input = <textarea type={type} id={name} {...inputProps} />;
      } else if (type === 'checkbox' && useToggle) {
        input = <Toggle id={name} {...inputProps} />;
      } else {
        input = <input type={type} id={name} {...inputProps} />;
      }
    }

    return (
      <div
        className={classnames('form-field', {
          'form-field--stretch': stretch || type === 'markdown',
          'form-field--disabled': inputProps.disabled,
        })}
      >
        {(label || errorMessage) && (
          <label
            className={classnames('form-field__label', { 'form-field__error': errorMessage })}
            htmlFor={name}
          >
            {!errorMessage && label}
            {errorMessage}
          </label>
        )}
        <div
          className={classnames('form-field__input', {
            'form-field--auto-height': type === 'markdown',
          })}
        >
          {prefix && (
            <label htmlFor={name} className={classnames('form-field__prefix', affixClass)}>
              {prefix}
            </label>
          )}
          {input}
          {postfix && (
            <label htmlFor={name} className={classnames('form-field__postfix', affixClass)}>
              {postfix}
            </label>
          )}
        </div>
        {helper && <div className="form-field__help">{helper}</div>}
      </div>
    );
  }
}

export default FormField;
