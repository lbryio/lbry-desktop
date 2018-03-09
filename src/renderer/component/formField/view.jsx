// This file is going to die
/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import FileSelector from 'component/common/file-selector';
import SimpleMDE from 'react-simplemde-editor';
import { formFieldNestedLabelTypes, formFieldId } from 'component/common/form';
import style from 'react-simplemde-editor/dist/simplemde.min.css';

const formFieldFileSelectorTypes = ['file', 'directory'];

class FormField extends React.PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    prefix: PropTypes.string,
    postfix: PropTypes.string,
    hasError: PropTypes.bool,
    trim: PropTypes.bool,
    regexp: PropTypes.oneOfType([PropTypes.instanceOf(RegExp), PropTypes.string]),
  };

  static defaultProps = {
    trim: false,
  };

  constructor(props) {
    super(props);

    this._fieldRequiredText = __('This field is required');
    this._type = null;
    this._element = null;
    this._extraElementProps = {};

    this.state = {
      isError: null,
      errorMessage: null,
    };
  }

  componentWillMount() {
    if (['text', 'number', 'radio', 'checkbox'].includes(this.props.type)) {
      this._element = 'input';
      this._type = this.props.type;
    } else if (this.props.type == 'text-number') {
      this._element = 'input';
      this._type = 'text';
    } else if (this.props.type == 'SimpleMDE') {
      this._element = SimpleMDE;
      this._type = 'textarea';
      this._extraElementProps.options = {
        placeholder: this.props.placeholder,
        hideIcons: ['heading', 'image', 'fullscreen', 'side-by-side'],
      };
    } else if (formFieldFileSelectorTypes.includes(this.props.type)) {
      this._element = 'input';
      this._type = 'hidden';
    } else {
      // Non <input> field, e.g. <select>, <textarea>
      this._element = this.props.type;
    }
  }

  componentDidMount() {
    /**
     * We have to add the webkitdirectory attribute here because React doesn't allow it in JSX
     * https://github.com/facebook/react/issues/3468
     */
    if (this.props.type == 'directory') {
      this.refs.field.webkitdirectory = true;
    }
  }

  handleFileChosen(path) {
    this.refs.field.value = path;
    if (this.props.onChange) {
      // Updating inputs programmatically doesn't generate an event, so we have to make our own
      const event = new Event('change', { bubbles: true });
      this.refs.field.dispatchEvent(event); // This alone won't generate a React event, but we use it to attach the field as a target
      this.props.onChange(event);
    }
  }

  showError(text) {
    this.setState({
      isError: true,
      errorMessage: text,
    });
  }

  clearError() {
    this.setState({
      isError: false,
      errorMessage: '',
    });
  }

  getValue() {
    if (this.props.type == 'checkbox') {
      return this.refs.field.checked;
    } else if (this.props.type == 'SimpleMDE') {
      return this.refs.field.simplemde.value();
    }
    return this.props.trim ? this.refs.field.value.trim() : this.refs.field.value;
  }

  getSelectedElement() {
    return this.refs.field.options[this.refs.field.selectedIndex];
  }

  getOptions() {
    return this.refs.field.options;
  }

  validate() {
    if ('regexp' in this.props) {
      if (!this.getValue().match(this.props.regexp)) {
        this.showError(__('Invalid format.'));
      } else {
        this.clearError();
      }
    }
    this.props.onBlur && this.props.onBlur();
  }

  focus() {
    this.refs.field.focus();
  }

  render() {
    // Pass all unhandled props to the field element
    const otherProps = Object.assign({}, this.props),
      isError = this.state.isError !== null ? this.state.isError : this.props.hasError,
      elementId = this.props.elementId ? this.props.elementId : formFieldId(),
      renderElementInsideLabel =
        this.props.label && formFieldNestedLabelTypes.includes(this.props.type);

    delete otherProps.type;
    delete otherProps.label;
    delete otherProps.hasError;
    delete otherProps.className;
    delete otherProps.postfix;
    delete otherProps.prefix;
    delete otherProps.dispatch;
    delete otherProps.regexp;
    delete otherProps.trim;

    const element = (
      <this._element
        id={elementId}
        type={this._type}
        name={this.props.name}
        ref="field"
        placeholder={this.props.placeholder}
        onBlur={() => this.validate()}
        onFocus={() => this.props.onFocus && this.props.onFocus()}
        className={`form-field__input form-field__input-${this.props.type} ${this.props.className ||
          ''}${isError ? 'form-field__input--error' : ''}`}
        {...otherProps}
        {...this._extraElementProps}
      >
        {this.props.children}
      </this._element>
    );

    return (
      <div className={`form-field form-field--${this.props.type}`}>
        {this.props.prefix ? <span className="form-field__prefix">{this.props.prefix}</span> : ''}
        {element}
        {renderElementInsideLabel && (
          <label
            htmlFor={elementId}
            className={`form-field__label ${isError ? 'form-field__label--error' : ''}`}
          >
            {this.props.label}
          </label>
        )}
        {formFieldFileSelectorTypes.includes(this.props.type) ? (
          <FileSelector
            type={this.props.type}
            onFileChosen={this.handleFileChosen.bind(this)}
            {...(this.props.defaultValue ? { initPath: this.props.defaultValue } : {})}
          />
        ) : null}
        {this.props.postfix ? (
          <span className="form-field__postfix">{this.props.postfix}</span>
        ) : (
          ''
        )}
        {isError && this.state.errorMessage ? (
          <div className="form-field__error">{this.state.errorMessage}</div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default FormField;
/* eslint-enable */
