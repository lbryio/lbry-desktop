import React from 'react';
import {Icon} from './common.js';

var formFieldCounter = 0,
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
  getInitialState: function() {
    return {
      isError: null,
      errorMessage: null,
    }
  },
  componentWillMount: function() {
    if (['text', 'number', 'radio', 'checkbox', 'file'].includes(this.props.type)) {
      this._element = 'input';
      this._type = this.props.type;
    } else if (this.props.type == 'text-number') {
      this._element = 'input';
      this._type = 'text';
    } else {
      // Non <input> field, e.g. <select>, <textarea>
      this._element = this.props.type;
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
    } else if (this.props.type == 'file') {
      return this.refs.field.files.length && this.refs.field.files[0].path ?
                this.refs.field.files[0].path : null;
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
      { this.props.postfix ? <span className="form-field__postfix">{this.props.postfix}</span> : '' }
      { isError && this.state.errorMessage ?  <div className="form-field__error">{this.state.errorMessage}</div> : '' }
    </div>
  }
})

export let FormRow = React.createClass({
  _fieldRequiredText: 'This field is required',
  propTypes: {
    label: React.PropTypes.string,
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
