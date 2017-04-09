import React from 'react';
import {Icon} from './common.js';

var requiredFieldWarningStyle = {
  color: '#cc0000',
  transition: 'opacity 400ms ease-in',
};

var formFieldCounter = 0;

var FormField = React.createClass({
  _fieldRequiredText: 'This field is required',
  _type: null,
  _element: null,

  propTypes: {
    type: React.PropTypes.string.isRequired,
    row: React.PropTypes.bool,
    hidden: React.PropTypes.bool,
  },
  getInitialState: function() {
    return {
      errorState: 'hidden',
      adviceText: null,
    }
  },
  componentWillMount: function() {
    if (['text', 'radio', 'checkbox', 'file'].includes(this.props.type)) {
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
      errorState: 'shown',
      adviceText: text,
    });

    // setTimeout(() => {
    //   this.setState({
    //     errorState: 'fading',
    //   });
    //   setTimeout(() => {
    //     this.setState({
    //       errorState: 'hidden',
    //     });
    //   }, 450);
    // }, 5000);
  },
  warnRequired: function() {
    this.showError(this._fieldRequiredText);
  },
  focus: function() {
    this.refs.field.focus();
  },
  getValue: function() {
    if (this.props.type == 'checkbox') {
      return this.refs.field.checked;
    } else if (this.props.type == 'file') {
      return this.refs.field.files[0].path;
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
          hasError = this.state.errorState != 'hidden';
    delete otherProps.type;
    delete otherProps.hidden;
    delete otherProps.label;
    delete otherProps.row;
    delete otherProps.helper;

    ++formFieldCounter;
    const elementId = "form-field-" + formFieldCounter

    if (this.props.hidden) {
      return null;
    }

    const field = <div className="form-field">
      { this.props.label ?
        <div className={"form-field__label " + (hasError ? 'form-field__label--error' : '')}>
          <label htmlFor={elementId}>{this.props.label}</label>
        </div> : ''
      }
      <this._element id={elementId} type={this._type} name={this.props.name} ref="field" placeholder={this.props.placeholder}
                     className={'form-field__input form-field__input-' + this.props.type + ' ' + (this.props.className || '') + (hasError ? 'form-field__input--error' : '')}
        {...otherProps}>
        {this.props.children}
      </this._element>
      { !hasError && this.props.helper ?  <div className="form-field__helper">{this.props.helper}</div> : '' }
      { hasError ?  <div className="form-field__error">{this.state.adviceText}</div> : '' }
    </div>
    return (
      this.props.row ?
        <div className="form-row">{field}</div> :
        field
    );
  }
});

export default FormField;
