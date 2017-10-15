import React from "react";
import FormField from "component/formField";
import { Icon } from "component/common.js";

let formFieldCounter = 0;

export const formFieldNestedLabelTypes = ["radio", "checkbox"];

export function formFieldId() {
  return "form-field-" + ++formFieldCounter;
}

export class Form extends React.PureComponent {
  static propTypes = {
    onSubmit: React.PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit();
  }

  render() {
    return (
      <form onSubmit={event => this.handleSubmit(event)}>
        {this.props.children}
      </form>
    );
  }
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

  static defaultProps = {
    isFocus: false,
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
    return this._field.getOptions();
  }

  onFocus() {
    this.setState({ isFocus: true });
  }

  onBlur() {
    this.setState({ isFocus: false });
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
    delete fieldProps.isFocus;

    return (
      <div
        className={"form-row" + (this.state.isFocus ? " form-row--focus" : "")}
      >
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
                  (this.state.isError ? "form-field__label--error" : " ")
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
          onFocus={this.onFocus.bind(this)}
          onBlur={this.onBlur.bind(this)}
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

export const Submit = props => {
  const { title, label, icon, disabled } = props;

  const className =
    "button-block" +
    " button-primary" +
    " button-set-item" +
    " button--submit" +
    (disabled ? " disabled" : "");

  const content = (
    <span className="button__content">
      {"icon" in props ? <Icon icon={icon} fixed={true} /> : null}
      {label ? <span className="button-label">{label}</span> : null}
    </span>
  );

  return (
    <button type="submit" className={className} title={title}>
      {content}
    </button>
  );
};
