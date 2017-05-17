import React from 'react';
import lbry from '../lbry.js';

export class SnackBar extends React.Component {
  constructor(props) {
    super(props);

    this._displayTime = 5; // in seconds
    this._hideTimeout = null;

    this.state = {
      snacks: []
    };
  }

  handleSnackReceived(event) {
    // if (this._hideTimeout) {
    //   clearTimeout(this._hideTimeout);
    // }

    let snacks = this.state.snacks;
    snacks.push(event.detail);
    this.setState({ snacks: snacks});
  }

  componentWillMount() {
    document.addEventListener('globalNotice', this.handleSnackReceived);
  }

  componentWillUnmount() {
    document.removeEventListener('globalNotice', this.handleSnackReceived);
  }

  render() {
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
  }
}

export default SnackBar;