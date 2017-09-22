import lbry from "../lbry.js";
import React from "react";
import FormField from "component/formField";
import Link from "../component/link";

const fs = require("fs");
const { ipcRenderer } = require("electron");

class DeveloperPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      upgradePath: "",
    };
  }

  handleUpgradeFileChange(event) {
    this.setState({
      upgradePath: event.target.value,
    });
  }

  handleForceUpgradeClick() {
    let upgradeSent = false;
    if (!this.state.upgradePath) {
      alert(__("Please select a file to upgrade from"));
    } else {
      try {
        const stats = fs.lstatSync(this.state.upgradePath);
        if (stats.isFile()) {
          console.log("Starting upgrade using " + this.state.upgradePath);
          ipcRenderer.send("upgrade", this.state.upgradePath);
          upgradeSent = true;
        }
      } catch (e) {}
      if (!upgradeSent) {
        alert(
          'Failed to start upgrade. Is "' +
            this.state.upgradePath +
            '" a valid path to the upgrade?'
        );
      }
    }
  }

  render() {
    return (
      <main>
        <section className="card">
          <div className="form-row">
            <FormField
              name="file"
              ref="file"
              type="file"
              onChange={event => {
                this.handleUpgradeFileChange();
              }}
            />
            &nbsp;
            <Link
              label={__("Force Upgrade")}
              button="alt"
              onClick={event => {
                this.handleForceUpgradeClick();
              }}
            />
          </div>
        </section>
      </main>
    );
  }
}

export default DeveloperPage;
