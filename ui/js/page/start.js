import React from "react";
import lbry from "../lbry.js";

class StartPage extends React.PureComponent {
  componentWillMount() {
    lbry.stop();
  }

  render() {
    return (
      <main className="main--single-column">
        <h3>{__("LBRY is Closed")}</h3>
        <Link href="lbry://lbry" label={__("Click here to start LBRY")} />
      </main>
    );
  }
}

export default StartPage;
