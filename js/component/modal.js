import React from 'react';
import ReactModal from 'react-modal';
import {Link} from './link.js';


var Modal = React.createClass({
  propTypes: {
    type: React.PropTypes.oneOf(['alert', 'confirm', 'custom']),
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
                  overlayClassName={(this.props.overlayClassName || '') + ' modal-overlay'}>
        <div>
          {this.props.children}
        </div>
        {this.props.type == 'custom' // custom modals define their own buttons
          ? null
          : <div className="modal__buttons">
              {this.props.type == 'confirm'
                ? <Link button="alt" label={this.props.abortButtonLabel} className="modal__button" disabled={this.props.abortButtonDisabled} onClick={this.props.onAborted} />
                : null}
              <Link button="primary" label={this.props.confirmButtonLabel} className="modal__button" disabled={this.props.confirmButtonDisabled} onClick={this.props.onConfirmed} />
            </div>}
      </ReactModal>
    );
  }
});

export default Modal;
