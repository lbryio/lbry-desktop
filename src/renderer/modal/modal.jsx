// @flow
/* eslint-disable react/no-multi-comp */
// These should probably just be combined into one modal component
import * as React from 'react';
import ReactModal from 'react-modal';
import Button from 'component/button';
import app from 'app';
import classnames from 'classnames';

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
  fullScreen: boolean,
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
    fullScreen: false,
  };

  render() {
    const {
      children,
      type,
      confirmButtonLabel,
      confirmButtonDisabled,
      onConfirmed,
      abortButtonLabel,
      abortButtonDisabled,
      onAborted,
      fullScreen,
      className,
      overlayClassName,
      ...modalProps
    } = this.props;
    return (
      <ReactModal
        {...modalProps}
        onRequestClose={onAborted || onConfirmed}
        className={classnames(className, {
          modal: !fullScreen,
          'modal--fullscreen': fullScreen,
        })}
        overlayClassName={
          ![null, undefined, ''].includes(overlayClassName) ? overlayClassName : 'modal-overlay'
        }
      >
        <div>{children}</div>
        {type === 'custom' ? null : ( // custom modals define their own buttons
          <div className="card__actions card__actions--center">
            <Button
              button="primary"
              label={confirmButtonLabel}
              disabled={confirmButtonDisabled}
              onClick={onConfirmed}
            />
            {type === 'confirm' ? (
              <Button
                button="link"
                label={abortButtonLabel}
                disabled={abortButtonDisabled}
                onClick={onAborted}
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
            button="link"
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
