import React from "react";
import FormField from "component/formField";

let formFieldCounter = 0;

export const formFieldNestedLabelTypes = ["radio", "checkbox"];

export function formFieldId() {
  return "form-field-" + ++formFieldCounter;
}

export class FormRow extends React.PureComponent {
  static propTypes = {
    label: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element,
    ]),
    errorMessage: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object,
    ]),
    // helper: React.PropTypes.html,
  };

  constructor(props) {
    super(props);

    this._field = null;

    this._fieldRequiredText = __("This field is required");

    this.state = this.getStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps));
  }

  getStateFromProps(props) {
    return {
      isError: !!props.errorMessage,
      errorMessage: typeof props.errorMessage === "string"
        ? props.errorMessage
        : props.errorMessage instanceof Error
          ? props.errorMessage.toString()
          : "",
    };
  }

  showError(text) {
    this.setState({
      isError: true,
      errorMessage: text,
    });
  }

  showRequiredError() {
    this.showError(this._fieldRequiredText);
  }

  clearError(text) {
    this.setState({
      isError: false,
      errorMessage: "",
    });
  }

  getValue() {
    return this._field.getValue();
  }

  getSelectedElement() {
    return this._field.getSelectedElement();
  }

  getOptions() {
    if (!this._field || !this._field.getOptions) {
      console.log(this);
      console.log(this._field);
      console.log(this._field.getOptions);
    }
    return this._field.getOptions();
  }

  focus() {
    this._field.focus();
  }

  render() {
    const fieldProps = Object.assign({}, this.props),
      elementId = formFieldId(),
      renderLabelInFormField = formFieldNestedLabelTypes.includes(
        this.props.type
      );

    if (!renderLabelInFormField) {
      delete fieldProps.label;
    }
    delete fieldProps.helper;
    delete fieldProps.errorMessage;

    return (
      <div className="form-row">
        {this.props.label && !renderLabelInFormField
          ? <div
              className={
                "form-row__label-row " +
                (this.props.labelPrefix ? "form-row__label-row--prefix" : "")
              }
            >
              <label
                htmlFor={elementId}
                className={
                  "form-field__label " +
                  (this.state.isError ? "form-field__label--error" : "")
                }
              >
                {this.props.label}
              </label>
            </div>
          : ""}
        <FormField
          ref={ref => {
            this._field = ref ? ref.getWrappedInstance() : null;
          }}
          hasError={this.state.isError}
          {...fieldProps}
        />
        {!this.state.isError && this.props.helper
          ? <div className="form-field__helper">{this.props.helper}</div>
          : ""}
        {this.state.isError
          ? <div className="form-field__error">{this.state.errorMessage}</div>
          : ""}
      </div>
    );
  }
}
