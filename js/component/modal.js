var Modal = React.createClass({
  propTypes: {
    type: React.PropTypes.oneOf(['alert', 'confirm', 'custom']),
    onConfirmed: React.PropTypes.func,
    onAborted: React.PropTypes.func,
    confirmButtonLabel: React.PropTypes.string,
    abortButtonLabel: React.PropTypes.string,
  },
  getDefaultProps: function() {
    return {
      type: 'alert',
      confirmButtonLabel: 'OK',
      abortButtonLabel: 'Cancel',
    };
  },
  render: function() {
    var props = Object.assign({}, this.props);

    if (typeof props.className == 'undefined') {
      props.className = 'modal';
    } else {
      props.className += ' modal';
    }

    if (typeof props.overlayClassName == 'undefined') {
      props.overlayClassName = 'modal-overlay';
    } else {
      props.overlayClassName += ' modal-overlay';
    }

    props.onCloseRequested = props.onAborted || props.onConfirmed;

    if (this.props.type == 'alert') {
      var buttons = (
        <div className="modal__buttons">
          <Link button="primary" label={props.confirmButtonLabel} className="modal__button" onClick={props.onConfirmed} />
        </div>
      );
    } else if (this.props.type == 'confirm') {
      var buttons = (
        <div className="modal__buttons">
          <Link button="alt" label={props.abortButtonLabel} className="modal__button" onClick={props.onAborted} />
          <Link button="primary" label={props.confirmButtonLabel} className="modal__button" onClick={props.onConfirmed} />
        </div>
      );
    } else {
      var buttons = null;
    }

    return (
      <ReactModal {...props}>
         {this.props.children}
         {buttons}
      </ReactModal>
    );
  }
});
