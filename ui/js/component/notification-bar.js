import React from 'react';
import lbry from '../lbry.js';
import Notice from '../component/notice.js';

export const NotificationBar = React.createClass({
  _displayTime: 8, // in seconds

  _hideTimeout: null,

  getInitialState: function() {
    return {
      message: null,
      isError: null,
    }
  },
  handleNoticeReceived: function(event) {
    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
    }

    const {detail: {message, isError}} = event;
    this.setState({
      message: message,
      isError: isError,
    });

    this._hideTimeout = setTimeout(() => {
      this.setState({
        message: null,
        isError: null,
      });
    }, this._displayTime * 1000);
  },
  componentWillMount: function() {
    document.addEventListener('globalNotice', this.handleNoticeReceived);
  },
  componentWillUnmount: function() {
    document.removeEventListener('globalNotice', this.handleNoticeReceived);
  },
  render: function() {
    if (!this.state.message) {
      return null;
    }

    return (
      <Notice isError={this.state.isError} className="notification-bar">
        {this.state.message}
      </Notice>
    );
  },
});

export default NotificationBar;