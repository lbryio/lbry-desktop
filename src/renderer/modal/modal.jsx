// @flow
/* eslint-disable react/no-multi-comp */
// These should probably just be combined into one modal component
import * as React from 'react';
import ReactModal from 'react-modal';
import Button from 'component/link/index';
import app from 'app';

type ModalProps = {
  type: string,
  overlay: boolean,
  confirmButtonLabel: string,
  abortButtonLabel: string,
  confirmButtonDisabled: boolean,
  abortButtonDisabled: boolean,
  onConfirmed?: any => any,
  onAborted?: any => any,
  className?: string,
  overlayClassName?: string,
  children?: React.Node,
  extraContent?: React.Node,
  expandButtonLabel?: string,
  hideButtonLabel?: string,
};

export class Modal extends React.PureComponent<ModalProps> {
  static defaultProps = {
    type: 'alert',
    overlay: true,
    /* eslint-disable no-underscore-dangle */
    confirmButtonLabel: app.i18n.__('OK'),
    abortButtonLabel: app.i18n.__('Cancel'),
    /* eslint-enable no-underscore-dangle */
    confirmButtonDisabled: false,
    abortButtonDisabled: false,
  };

  render() {
    return (
      <ReactModal
        onCloseRequested={this.props.onAborted || this.props.onConfirmed}
        {...this.props}
        className={`${this.props.className || ''} modal`}
        overlayClassName={
          ![null, undefined, ''].includes(this.props.overlayClassName)
            ? this.props.overlayClassName
            : 'modal-overlay'
        }
      >
        <div>{this.props.children}</div>
        {this.props.type === 'custom' ? null : ( // custom modals define their own buttons
          <div className="card__actions card__actions--center">
            <Button
              label={this.props.confirmButtonLabel}
              disabled={this.props.confirmButtonDisabled}
              onClick={this.props.onConfirmed}
            />
            {this.props.type === 'confirm' ? (
              <Button
                alt
                label={this.props.abortButtonLabel}
                disabled={this.props.abortButtonDisabled}
                onClick={this.props.onAborted}
              />
            ) : null}
          </div>
        )}
      </ReactModal>
    );
  }
}

type State = {
  expanded: boolean,
};

export class ExpandableModal extends React.PureComponent<ModalProps, State> {
  static defaultProps = {
    /* eslint-disable no-underscore-dangle */
    confirmButtonLabel: app.i18n.__('OK'),
    expandButtonLabel: app.i18n.__('Show More...'),
    hideButtonLabel: app.i18n.__('Show Less'),
    /* eslint-enable no-underscore-dangle */
  };

  constructor(props: ModalProps) {
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
          <Button
            button="primary"
            label={this.props.confirmButtonLabel}
            className="modal__button"
            onClick={this.props.onConfirmed}
          />
          <Button
            button="alt"
            label={!this.state.expanded ? this.props.expandButtonLabel : this.props.hideButtonLabel}
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
/* eslint-enable react/no-multi-comp */
