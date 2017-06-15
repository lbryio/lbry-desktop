import React from "react";
import Link from "component/link";
import { FormRow } from "component/form";
import { doShowSnackBar } from "actions/app";
import lbry from "../lbry.js";

class ReportPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      submitting: false,
      message: "",
    };
  }

  submitMessage() {
    const message = this.state.message;
    if (message) {
      this.setState({
        submitting: true,
      });
      lbry.report_bug({ message }).then(() => {
        this.setState({
          submitting: false,
        });

        // Display global notice
        const action = doShowSnackBar({
          message: __("Message received! Thanks for helping."),
          isError: false,
        });
        window.app.store.dispatch(action);
      });

      this.setState({ message: "" });
    }
  }

  onMessageChange(event) {
    this.setState({
      message: event.target.value,
    });
  }

  render() {
    return (
      <main className="main--single-column">
        <section className="card">
          <div className="card__content">
            <h3>{__("Report an Issue")}</h3>
            <p>
              {__(
                "Please describe the problem you experienced and any information you think might be useful to us. Links to screenshots are great!"
              )}
            </p>
            <div className="form-row">
              <FormRow
                type="textarea"
                rows="10"
                name="message"
                value={this.state.message}
                onChange={event => {
                  this.onMessageChange(event);
                }}
                placeholder={__("Description of your issue")}
              />
            </div>
            <div className="form-row form-row-submit">
              <button
                onClick={event => {
                  this.submitMessage(event);
                }}
                className={
                  "button-block button-primary " +
                  (this.state.submitting ? "disabled" : "")
                }
              >
                {this.state.submitting
                  ? __("Submitting...")
                  : __("Submit Report")}
              </button>
            </div>
          </div>
        </section>
        <section className="card">
          <div className="card__content">
            <h3>{__("Developer?")}</h3>
            {__("You can also")}
            {" "}
            <Link
              href="https://github.com/lbryio/lbry/issues"
              label={__("submit an issue on GitHub")}
            />.
          </div>
        </section>
      </main>
    );
  }
}

export default ReportPage;
