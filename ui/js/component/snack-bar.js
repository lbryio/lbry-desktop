import React from 'react';
import lbry from '../lbry.js';

export const SnackBar = React.createClass({

  _displayTime: 5, // in seconds

  _hideTimeout: null,

  getInitialState: function() {
    return {
      snacks: []
    }
  },
  handleSnackReceived: function(event) {
    // if (this._hideTimeout) {
    //   clearTimeout(this._hideTimeout);
    // }

    let snacks = this.state.snacks;
    snacks.push(event.detail);
    this.setState({ snacks: snacks});
  },
  componentWillMount: function() {
    document.addEventListener('globalNotice', this.handleSnackReceived);
  },
  componentWillUnmount: function() {
    document.removeEventListener('globalNotice', this.handleSnackReceived);
  },
  render: function() {
    if (!this.state.snacks.length) {
      this._hideTimeout = null; //should be unmounting anyway, but be safe?
      return null;
    }

    let snack = this.state.snacks[0];

    if (this._hideTimeout === null) {
      this._hideTimeout = setTimeout(() => {
        this._hideTimeout = null;
        let snacks = this.state.snacks;
        snacks.shift();
        this.setState({ snacks: snacks });
      }, this._displayTime * 1000);
    }

    return (
      <div className="snack-bar">
        {snack.message}
        {snack.linkText && snack.linkTarget ?
          <a className="snack-bar__action" href={snack.linkTarget}>{snack.linkText}</a> : ''}
      </div>
    );
  },
});

export default SnackBar;