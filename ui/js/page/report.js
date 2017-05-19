import React from 'react';
import Link from 'component/link';
import Modal from '../component/modal.js';
import lbry from '../lbry.js';

class ReportPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      submitting: false,
      modal: null,
    };
  }

  submitMessage() {
    if (this._messageArea.value) {
      this.setState({
        submitting: true
      });
      lbry.reportBug(this._messageArea.value, () => {
        this.setState({
          submitting: false,
          modal: 'submitted',
        });
      });
      this._messageArea.value = '';
    }
  }

  closeModal() {
    this.setState({
      modal: null,
    })
  }

  render() {
    return (
      <main className="main--single-column">
        <section className="card">
          <h3>Report an Issue</h3>
          <p>Please describe the problem you experienced and any information you think might be useful to us. Links to screenshots are great!</p>
          <div className="form-row">
            <textarea ref={(t) => this._messageArea = t} cols="80" rows="10" name="message" type="text"/>
          </div>
          <div className="form-row form-row-submit">
            <button onClick={(event) => { this.submitMessage(event) }} className={'button-block button-primary ' + (this.state.submitting ? 'disabled' : '')}>{this.state.submitting ? 'Submitting...' : 'Submit Report'}</button>
          </div>
        </section>
        <section className="card">
          <h3>Developer?</h3>
          You can also <Link href="https://github.com/lbryio/lbry/issues" label="submit an issue on GitHub"/>.
        </section>
        <Modal isOpen={this.state.modal == 'submitted'} contentLabel="Bug report submitted"
               onConfirmed={(event) => { this.closeModal(event) }}>
          Your bug report has been submitted! Thank you for your feedback.
        </Modal>
      </main>
    );
  }
}

export default ReportPage;
