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
      showDeveloperMenu: lbry.getClientSetting("showDeveloperMenu"),
      useCustomLighthouseServers: lbry.getClientSetting(
        "useCustomLighthouseServers"
      ),
      customLighthouseServers: lbry
        .getClientSetting("customLighthouseServers")
        .join("\n"),
      upgradePath: "",
    };
  }

  handleShowDeveloperMenuChange(event) {
    lbry.setClientSetting("showDeveloperMenu", event.target.checked);
    lbry.showMenuIfNeeded();
    this.setState({
      showDeveloperMenu: event.target.checked,
    });
  }

  handleUseCustomLighthouseServersChange(event) {
    lbry.setClientSetting("useCustomLighthouseServers", event.target.checked);
    this.setState({
      useCustomLighthouseServers: event.target.checked,
    });
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
          <h3>{__("Developer Settings")}</h3>
          <div className="form-row">
            <label>
              <FormField
                type="checkbox"
                onChange={event => {
                  this.handleShowDeveloperMenuChange();
                }}
                checked={this.state.showDeveloperMenu}
              />
              {" "}
              {__("Show developer menu")}
            </label>
          </div>
          <div className="form-row">
            <label>
              <FormField
                type="checkbox"
                onChange={event => {
                  this.handleUseCustomLighthouseServersChange();
                }}
                checked={this.state.useCustomLighthouseServers}
              />
              {" "}
              {__("Use custom search servers")}
            </label>
          </div>
          {this.state.useCustomLighthouseServers
            ? <div className="form-row">
                <label>
                  {__("Custom search servers (one per line)")}
                  <div>
                    <FormField
                      type="textarea"
                      className="developer-page__custom-lighthouse-servers"
                      value={this.state.customLighthouseServers}
                      onChange={event => {
                        this.handleCustomLighthouseServersChange();
                      }}
                      checked={this.state.debugMode}
                    />
                  </div>
                </label>
              </div>
            : null}
        </section>
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
