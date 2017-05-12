import React from 'react';
import FileSelector from './file-selector.js';
import {Icon} from './common.js';

var formFieldCounter = 0,
    formFieldFileSelectorTypes = ['file', 'directory'],
    formFieldNestedLabelTypes = ['radio', 'checkbox'];

function formFieldId() {
  return "form-field-" + (++formFieldCounter);
}

export let FormField = React.createClass({
  _fieldRequiredText: 'This field is required',
  _type: null,
  _element: null,

  propTypes: {
    type: React.PropTypes.string.isRequired,
    prefix: React.PropTypes.string,
    postfix: React.PropTypes.string,
    hasError: React.PropTypes.bool
  },
  handleFileChosen: function(path) {
    this.refs.field.value = path;
    if (this.props.onChange) { // Updating inputs programmatically doesn't generate an event, so we have to make our own
      const event = new Event('change', {bubbles: true})
      this.refs.field.dispatchEvent(event); // This alone won't generate a React event, but we use it to attach the field as a target
      this.props.onChange(event);
    }
  },
  getInitialState: function() {
    return {
      isError: null,
      errorMessage: null,
    }
  },
  componentWillMount: function() {
    if (['text', 'number', 'radio', 'checkbox'].includes(this.props.type)) {
      this._element = 'input';
      this._type = this.props.type;
    } else if (this.props.type == 'text-number') {
      this._element = 'input';
      this._type = 'text';
    } else if (formFieldFileSelectorTypes.includes(this.props.type)) {
      this._element = 'input';
      this._type = 'hidden';
    } else {
      // Non <input> field, e.g. <select>, <textarea>
      this._element = this.props.type;
    }
  },
  componentDidMount: function() {
    /**
     * We have to add the webkitdirectory attribute here because React doesn't allow it in JSX
     * https://github.com/facebook/react/issues/3468
     */
    if (this.props.type == 'directory') {
      this.refs.field.webkitdirectory = true;
    }
  },
  showError: function(text) {
    this.setState({
      isError: true,
      errorMessage: text,
    });
  },
  focus: function() {
    this.refs.field.focus();
  },
  getValue: function() {
    if (this.props.type == 'checkbox') {
      return this.refs.field.checked;
    } else {
      return this.refs.field.value;
    }
  },
  getSelectedElement: function() {
    return this.refs.field.options[this.refs.field.selectedIndex];
  },
  render: function() {
    // Pass all unhandled props to the field element
    const otherProps = Object.assign({}, this.props),
          isError = this.state.isError !== null ? this.state.isError : this.props.hasError,
          elementId = this.props.id ? this.props.id : formFieldId(),
          renderElementInsideLabel = this.props.label && formFieldNestedLabelTypes.includes(this.props.type);

    delete otherProps.type;
    delete otherProps.label;
    delete otherProps.hasError;
    delete otherProps.className;
    delete otherProps.postfix;
    delete otherProps.prefix;

    const element = <this._element id={elementId} type={this._type} name={this.props.name} ref="field" placeholder={this.props.placeholder}
                                    className={'form-field__input form-field__input-' + this.props.type + ' ' + (this.props.className || '') + (isError ? 'form-field__input--error' : '')}
      {...otherProps}>
      {this.props.children}
    </this._element>;

    return <div className="form-field">
      { this.props.prefix ? <span className="form-field__prefix">{this.props.prefix}</span> : '' }
      { renderElementInsideLabel ?
          <label htmlFor={elementId} className={"form-field__label " + (isError ? 'form-field__label--error' : '')}>
            {element}
            {this.props.label}
          </label> :
        element }
      { formFieldFileSelectorTypes.includes(this.props.type) ?
          <FileSelector type={this.props.type} onFileChosen={this.handleFileChosen}
                        {... this.props.defaultValue ? {initPath: this.props.defaultValue} : {}} /> :
          null }
      { this.props.postfix ? <span className="form-field__postfix">{this.props.postfix}</span> : '' }
      { isError && this.state.errorMessage ?  <div className="form-field__error">{this.state.errorMessage}</div> : '' }
    </div>
  }
})

export let FormRow = React.createClass({
  _fieldRequiredText: 'This field is required',
  propTypes: {
    label: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element])
    // helper: React.PropTypes.html,
  },
  getInitialState: function() {
    return {
      isError: false,
      errorMessage: null,
    }
  },
  showError: function(text) {
    this.setState({
      isError: true,
      errorMessage: text,
    });
  },
  showRequiredError: function() {
    this.showError(this._fieldRequiredText);
  },
  clearError: function(text) {
    this.setState({
      isError: false,
      errorMessage: ''
    });
  },
  getValue: function() {
    return this.refs.field.getValue();
  },
  getSelectedElement: function() {
    return this.refs.field.getSelectedElement();
  },
  focus: function() {
    this.refs.field.focus();
  },
  render: function() {
    const fieldProps = Object.assign({}, this.props),
          elementId = formFieldId(),
          renderLabelInFormField = formFieldNestedLabelTypes.includes(this.props.type);

    if (!renderLabelInFormField) {
      delete fieldProps.label;
    }
    delete fieldProps.helper;

    return <div className="form-row">
      { this.props.label && !renderLabelInFormField ?
        <div className={"form-row__label-row " + (this.props.labelPrefix ? "form-row__label-row--prefix" : "") }>
          <label htmlFor={elementId} className={"form-field__label " + (this.state.isError ? 'form-field__label--error' : '')}>
            {this.props.label}
          </label>
        </div> : '' }
      <FormField ref="field" hasError={this.state.isError} {...fieldProps} />
      { !this.state.isError && this.props.helper ?  <div className="form-field__helper">{this.props.helper}</div> : '' }
      { this.state.isError ?  <div className="form-field__error">{this.state.errorMessage}</div> : '' }
    </div>
  }
})
