import React from "react";
import FileSelector from "./file-selector.js";
import SimpleMDE from "react-simplemde-editor";
import style from "react-simplemde-editor/dist/simplemde.min.css";

let formFieldCounter = 0,
  formFieldFileSelectorTypes = ["file", "directory"],
  formFieldNestedLabelTypes = ["radio", "checkbox"];

function formFieldId() {
  return "form-field-" + ++formFieldCounter;
}

export class FormField extends React.PureComponent {
  static propTypes = {
    type: React.PropTypes.string.isRequired,
    prefix: React.PropTypes.string,
    postfix: React.PropTypes.string,
    hasError: React.PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this._fieldRequiredText = __("This field is required");
    this._type = null;
    this._element = null;
    this._extraElementProps = {};

    this.state = {
      isError: null,
      errorMessage: null,
    };
  }

  componentWillMount() {
    if (["text", "number", "radio", "checkbox"].includes(this.props.type)) {
      this._element = "input";
      this._type = this.props.type;
    } else if (this.props.type == "text-number") {
      this._element = "input";
      this._type = "text";
    } else if (this.props.type == "SimpleMDE") {
      this._element = SimpleMDE;
      this._type = "textarea";
      this._extraElementProps.options = {
        hideIcons: ["guide", "heading", "image", "fullscreen"],
      };
    } else if (formFieldFileSelectorTypes.includes(this.props.type)) {
      this._element = "input";
      this._type = "hidden";
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
    if (this.props.type == "directory") {
      this.refs.field.webkitdirectory = true;
    }
  }

  handleFileChosen(path) {
    this.refs.field.value = path;
    if (this.props.onChange) {
      // Updating inputs programmatically doesn't generate an event, so we have to make our own
      const event = new Event("change", { bubbles: true });
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

  focus() {
    this.refs.field.focus();
  }

  getValue() {
    if (this.props.type == "checkbox") {
      return this.refs.field.checked;
    } else if (this.props.type == "SimpleMDE") {
      return this.refs.field.simplemde.value();
    } else {
      return this.refs.field.value;
    }
  }

  getSelectedElement() {
    return this.refs.field.options[this.refs.field.selectedIndex];
  }

  getOptions() {
    return this.refs.field.options;
  }

  render() {
    // Pass all unhandled props to the field element
    const otherProps = Object.assign({}, this.props),
      isError = this.state.isError !== null
        ? this.state.isError
        : this.props.hasError,
      elementId = this.props.id ? this.props.id : formFieldId(),
      renderElementInsideLabel =
        this.props.label && formFieldNestedLabelTypes.includes(this.props.type);

    delete otherProps.type;
    delete otherProps.label;
    delete otherProps.hasError;
    delete otherProps.className;
    delete otherProps.postfix;
    delete otherProps.prefix;
    const element = (
      <this._element
        id={elementId}
        type={this._type}
        name={this.props.name}
        ref="field"
        placeholder={this.props.placeholder}
        className={
          "form-field__input form-field__input-" +
          this.props.type +
          " " +
          (this.props.className || "") +
          (isError ? "form-field__input--error" : "")
        }
        {...otherProps}
        {...this._extraElementProps}
      >
        {this.props.children}
      </this._element>
    );

    return (
      <div className={"form-field form-field--" + this.props.type}>
        {this.props.prefix
          ? <span className="form-field__prefix">{this.props.prefix}</span>
          : ""}
        {renderElementInsideLabel
          ? <label
              htmlFor={elementId}
              className={
                "form-field__label " +
                (isError ? "form-field__label--error" : "")
              }
            >
              {element}
              {this.props.label}
            </label>
          : element}
        {formFieldFileSelectorTypes.includes(this.props.type)
          ? <FileSelector
              type={this.props.type}
              onFileChosen={this.handleFileChosen.bind(this)}
              {...(this.props.defaultValue
                ? { initPath: this.props.defaultValue }
                : {})}
            />
          : null}
        {this.props.postfix
          ? <span className="form-field__postfix">{this.props.postfix}</span>
          : ""}
        {isError && this.state.errorMessage
          ? <div className="form-field__error">{this.state.errorMessage}</div>
          : ""}
      </div>
    );
  }
}

export class FormRow extends React.PureComponent {
  static propTypes = {
    label: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element,
    ]),
    // helper: React.PropTypes.html,
  };

  constructor(props) {
    super(props);

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
    return this.refs.field.getValue();
  }

  getSelectedElement() {
    return this.refs.field.getSelectedElement();
  }

  getOptions() {
    return this.refs.field.getOptions();
  }

  focus() {
    this.refs.field.focus();
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
        <FormField ref="field" hasError={this.state.isError} {...fieldProps} />
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
