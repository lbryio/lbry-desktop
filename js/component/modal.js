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

    if (this.props.type == 'custom') {
      var buttons = null;
    } else {
      var buttons = (
        <div className="modal__buttons">
          {this.props.type == 'confirm'
            ? <Link button="alt" label={props.abortButtonLabel} className="modal__button" onClick={props.onAborted} />
            : null}
          <Link button="primary" label={props.confirmButtonLabel} className="modal__button" onClick={props.onConfirmed} />
        </div>
      );
    }

    return (
      <ReactModal {...props}>
         {this.props.children}
         {buttons}
      </ReactModal>
    );
  }
});
