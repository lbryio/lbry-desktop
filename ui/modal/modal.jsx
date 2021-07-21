// @flow
// These should probably just be combined into one modal component
import * as ICONS from 'constants/icons';
import * as React from 'react';
import ReactModal from 'react-modal';
import Button from 'component/button';
import classnames from 'classnames';
import { useIsMobile } from 'effects/use-screensize';

type ModalProps = {
  type?: string,
  overlay?: boolean,
  confirmButtonLabel?: string,
  abortButtonLabel?: string,
  confirmButtonDisabled?: boolean,
  abortButtonDisabled?: boolean,
  onConfirmed?: (any) => any,
  onAborted?: (any) => any,
  className?: string,
  children?: React.Node,
  extraContent?: React.Node,
  expandButtonLabel?: string,
  hideButtonLabel?: string,
  title?: string | React.Node,
};

export function Modal(props: ModalProps) {
  const {
    children,
    type = 'alert',
    confirmButtonLabel = __('OK'),
    confirmButtonDisabled = false,
    onConfirmed,
    abortButtonLabel = __('Cancel'),
    abortButtonDisabled = false,
    onAborted,
    className,
    title,
    ...modalProps
  } = props;

  const isMobile = useIsMobile();

  return (
    <ReactModal
      {...modalProps}
      onRequestClose={onAborted || onConfirmed}
      className={classnames('modal', className, {
        'modal--card-internal': type === 'card',
      })}
      overlayClassName="modal-overlay"
    >
      {title && <h1 className="card__title card__title--deprecated">{title}</h1>}
      {type === 'card' && (
        <Button
          iconSize={isMobile ? 24 : undefined}
          button="close"
          aria-label={__('Close')}
          icon={ICONS.REMOVE}
          onClick={onAborted}
        />
      )}
      {children}
      {type === 'custom' || type === 'card' ? null : ( // custom modals define their own buttons
        <div className="card__actions">
          <Button button="primary" label={confirmButtonLabel} disabled={confirmButtonDisabled} onClick={onConfirmed} />
          {type === 'confirm' ? (
            <Button button="link" label={abortButtonLabel} disabled={abortButtonDisabled} onClick={onAborted} />
          ) : null}
        </div>
      )}
    </ReactModal>
  );
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
        {this.state.expanded ? <div>{this.props.extraContent}</div> : null}
        <div className="card__actions">
          <Button button="primary" label={this.props.confirmButtonLabel} onClick={this.props.onConfirmed} />
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
