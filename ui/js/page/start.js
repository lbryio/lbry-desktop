import React from 'react';
import lbry from '../lbry.js';

class StartPage extends React.Component {
  componentWillMount() {
    lbry.stop();
  }

  render() {
    return (
      <main className="main--single-column">
        <h3>__("LBRY is Closed")</h3>
        <Link href="lbry://lbry" label="Click here to start LBRY" />
      </main>
    );
  }
}

export default StartPage;
