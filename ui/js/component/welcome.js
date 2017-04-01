import React from 'react';
import ModalPage from './modal-page.js';
import {Link} from '../component/link.js';

export const Welcome = React.createClass({
  propTypes: {
    onDone: React.PropTypes.func.isRequired,
  },
  handleOKClicked: function() {
    this.props.onDone();
  },
  render: function() {
    return (
      <ModalPage contentLabel="Welcome to LBRY" {...this.props}>
        <h1>Welcome to LBRY</h1>
        Content will go here...
        <section>
          <Link button="primary" label="OK" onClick={this.handleOKClicked} />
        </section>
      </ModalPage>
    );
  }
});

