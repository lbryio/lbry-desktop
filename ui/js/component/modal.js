import React from 'react';
import ReactModal from 'react-modal';
import {Link} from './link.js';


export const Modal = React.createClass({
  propTypes: {
    type: React.PropTypes.oneOf(['alert', 'confirm', 'custom']),
    overlay: React.PropTypes.bool,
    onConfirmed: React.PropTypes.func,
    onAborted: React.PropTypes.func,
    confirmButtonLabel: React.PropTypes.string,
    abortButtonLabel: React.PropTypes.string,
    confirmButtonDisabled: React.PropTypes.bool,
    abortButtonDisabled: React.PropTypes.bool,
  },
  getDefaultProps: function() {
    return {
      type: 'alert',
      overlay: true,
      confirmButtonLabel: 'OK',
      abortButtonLabel: 'Cancel',
      confirmButtonDisabled: false,
      abortButtonDisabled: false,
    };
  },
  render: function() {
    return (
      <ReactModal onCloseRequested={this.props.onAborted || this.props.onConfirmed} {...this.props}
                  className={(this.props.className || '') + ' modal'}
                  overlayClassName={![null, undefined, ""].includes(this.props.overlayClassName) ? this.props.overlayClassName : 'modal-overlay'}>
        <div>
          {this.props.children}
        </div>
        {this.props.type == 'custom' // custom modals define their own buttons
          ? null
          : <div className="modal__buttons">
             <Link button="primary" label={this.props.confirmButtonLabel} className="modal__button" disabled={this.props.confirmButtonDisabled} onClick={this.props.onConfirmed} />
             {this.props.type == 'confirm'
               ? <Link button="alt" label={this.props.abortButtonLabel} className="modal__button" disabled={this.props.abortButtonDisabled} onClick={this.props.onAborted} />
               : null}
            </div>}
      </ReactModal>
    );
  }
});

export const ExpandableModal = React.createClass({
  propTypes: {
    expandButtonLabel: React.PropTypes.string,
    extraContent: React.PropTypes.element,
  },
  getDefaultProps: function() {
    return {
      confirmButtonLabel: 'OK',
      expandButtonLabel: 'Show More...',
      hideButtonLabel: 'Show Less',
    }
  },
  getInitialState: function() {
    return {
      expanded: false,
    }
  },
  toggleExpanded: function() {
    this.setState({
      expanded: !this.state.expanded,
    });
  },
  render: function() {
    return (
      <Modal type="custom" {... this.props}>
        {this.props.children}
        {this.state.expanded
          ? this.props.extraContent
          : null}
        <div className="modal__buttons">
          <Link button="primary" label={this.props.confirmButtonLabel} className="modal__button" onClick={this.props.onConfirmed} />
          <Link button="alt" label={!this.state.expanded ? this.props.expandButtonLabel : this.props.hideButtonLabel}
                className="modal__button" onClick={this.toggleExpanded} />
        </div>
      </Modal>
    );
  }
});

export default Modal;
