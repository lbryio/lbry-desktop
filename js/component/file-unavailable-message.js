import React from 'react';
import {Link, ToolTipLink} from '../component/link.js';

const FileUnavailableMessage = React.createClass({
  _unavailableMessage: "The content on LBRY is hosted by its users. It appears there are no users " +
                       "connected that have this file at the moment.",
  propTypes: {
    onShowActionsClicked: React.PropTypes.func,
  },
  render: function() {
    return (
      <div className="file-unavailable-message">
        <span className="empty">This file is not currently available.</span> { ' ' }
        <ToolTipLink label="Why?" tooltip={this._unavailableMessage} className="not-available-tooltip-link" /> { ' ' }
        {'onShowActionsClicked' in this.props
          ? <Link label="Try Anyway" className="button-text" onClick={this.props.onShowActionsClicked} />
          : null}
      </div>
    );
  }
});

export default FileUnavailableMessage;
