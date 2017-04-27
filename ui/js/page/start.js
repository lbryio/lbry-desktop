import React from 'react';
import lbry from '../lbry.js';

var StartPage = React.createClass({
  componentWillMount: function() {
    lbry.stop();
  },
  render: function() {
    return (
      <main className="page">
        <h3>LBRY is Closed</h3>
        <Link href="lbry://lbry" label="Click here to start LBRY" />
      </main>
    );
  }
});

export default StartPage;
