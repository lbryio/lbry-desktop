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
  children?: React.Node,
  extraContent?: React.Node,
  expandButtonLabel?: string,
  hideButtonLabel?: string,
  fullScreen: boolean,
  title?: string | React.Node,
};

export class Modal extends React.PureComponent<ModalProps> {
  static defaultProps = {
    type: 'alert',
    overlay: true,
    confirmButtonLabel: __('OK'),
    abortButtonLabel: __('Cancel'),
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
      title,
      ...modalProps
    } = this.props;
    return (
      <ReactModal
        {...modalProps}
        onRequestClose={onAborted || onConfirmed}
        className={classnames('card', className, {
          modal: !fullScreen,
          'modal--fullscreen': fullScreen,
        })}
        overlayClassName="modal-overlay"
      >
        {title && (
          <header className="card__header">
            <h1 className="card__title">{title}</h1>
          </header>
        )}
        {children}
        {type === 'custom' ? null : ( // custom modals define their own buttons
          <div className="card__actions">
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
    confirmButtonLabel: __('OK'),
    expandButtonLabel: __('Show More...'),
    hideButtonLabel: __('Show Less'),
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
        {this.state.expanded ? (
          <div className="card__content">{this.props.extraContent}</div>
        ) : null}
        <div className="card__actions">
          <Button
            button="primary"
            label={this.props.confirmButtonLabel}
            onClick={this.props.onConfirmed}
          />
          <Button
            button="link"
            label={!this.state.expanded ? this.props.expandButtonLabel : this.props.hideButtonLabel}
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
