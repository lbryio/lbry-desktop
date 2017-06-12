import React from "react";
import ReactModal from "react-modal";
import Link from "component/link";
import app from "../app.js";

export class Modal extends React.PureComponent {
  static propTypes = {
    type: React.PropTypes.oneOf(["alert", "confirm", "custom"]),
    overlay: React.PropTypes.bool,
    onConfirmed: React.PropTypes.func,
    onAborted: React.PropTypes.func,
    confirmButtonLabel: React.PropTypes.string,
    abortButtonLabel: React.PropTypes.string,
    confirmButtonDisabled: React.PropTypes.bool,
    abortButtonDisabled: React.PropTypes.bool,
  };

  static defaultProps = {
    type: "alert",
    overlay: true,
    confirmButtonLabel: app.i18n.__("OK"),
    abortButtonLabel: app.i18n.__("Cancel"),
    confirmButtonDisabled: false,
    abortButtonDisabled: false,
  };

  render() {
    return (
      <ReactModal
        onCloseRequested={this.props.onAborted || this.props.onConfirmed}
        {...this.props}
        className={(this.props.className || "") + " modal"}
        overlayClassName={
          ![null, undefined, ""].includes(this.props.overlayClassName)
            ? this.props.overlayClassName
            : "modal-overlay"
        }
      >
        <div>
          {this.props.children}
        </div>
        {this.props.type == "custom" // custom modals define their own buttons
          ? null
          : <div className="modal__buttons">
              <Link
                button="primary"
                label={this.props.confirmButtonLabel}
                className="modal__button"
                disabled={this.props.confirmButtonDisabled}
                onClick={this.props.onConfirmed}
              />
              {this.props.type == "confirm"
                ? <Link
                    button="alt"
                    label={this.props.abortButtonLabel}
                    className="modal__button"
                    disabled={this.props.abortButtonDisabled}
                    onClick={this.props.onAborted}
                  />
                : null}
            </div>}
      </ReactModal>
    );
  }
}

export class ExpandableModal extends React.PureComponent {
  static propTypes = {
    expandButtonLabel: React.PropTypes.string,
    extraContent: React.PropTypes.element,
  };

  static defaultProps = {
    confirmButtonLabel: app.i18n.__("OK"),
    expandButtonLabel: app.i18n.__("Show More..."),
    hideButtonLabel: app.i18n.__("Show Less"),
  };

  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  toggleExpanded() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    return (
      <Modal type="custom" {...this.props}>
        {this.props.children}
        {this.state.expanded ? this.props.extraContent : null}
        <div className="modal__buttons">
          <Link
            button="primary"
            label={this.props.confirmButtonLabel}
            className="modal__button"
            onClick={this.props.onConfirmed}
          />
          <Link
            button="alt"
            label={
              !this.state.expanded
                ? this.props.expandButtonLabel
                : this.props.hideButtonLabel
            }
            className="modal__button"
            onClick={() => {
              this.toggleExpanded();
            }}
          />
        </div>
      </Modal>
    );
  }
}

export default Modal;
