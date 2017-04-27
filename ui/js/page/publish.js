import React from 'react';
import lbry from '../lbry.js';
import {FormField, FormRow} from '../component/form.js';
import {Link} from '../component/link.js';
import rewards from '../rewards.js';
import lbryio from '../lbryio.js';
import Modal from '../component/modal.js';

var PublishPage = React.createClass({
  _requiredFields: ['meta_title', 'name', 'bid', 'tos_agree'],

  _updateChannelList: function(channel) {
    // Calls API to update displayed list of channels. If a channel name is provided, will select
    // that channel at the same time (used immediately after creating a channel)
    lbry.channel_list_mine().then((channels) => {
      rewards.claimReward(rewards.TYPE_FIRST_CHANNEL).then(() => {}, () => {})
      this.setState({
        channels: channels,
        ... channel ? {channel} : {}
      });
    });
  },
  handleSubmit: function(event) {
    if (typeof event !== 'undefined') {
      event.preventDefault();
    }

    this.setState({
      submitting: true,
    });

    let checkFields = this._requiredFields;
    if (!this.state.myClaimExists) {
      checkFields.unshift('file');
    }

    let missingFieldFound = false;
    for (let fieldName of checkFields) {
      const field = this.refs[fieldName];
      if (field) {
        if (field.getValue() === '' || field.getValue() === false) {
          field.showRequiredError();
          if (!missingFieldFound) {
            field.focus();
            missingFieldFound = true;
          }
        } else {
          field.clearError();
        }
      }
    }

    if (missingFieldFound) {
      this.setState({
        submitting: false,
      });
      return;
    }

    if (this.state.nameIsMine) {
      // Pre-populate with existing metadata
      var metadata = Object.assign({}, this.state.myClaimMetadata);
      if (this.refs.file.getValue() !== '') {
        delete metadata.sources;
      }
    } else {
      var metadata = {};
    }

    for (let metaField of ['title', 'description', 'thumbnail', 'license', 'license_url', 'language']) {
      var value = this.refs['meta_' + metaField].getValue();
      if (value !== '') {
        metadata[metaField] = value;
      }
    }

    metadata.nsfw = Boolean(parseInt(!!this.refs.meta_nsfw.getValue()));

    const licenseUrl = this.refs.meta_license_url.getValue();
    if (licenseUrl) {
      metadata.license_url = licenseUrl;
    }

    var doPublish = () => {
      var publishArgs = {
        name: this.state.name,
        bid: parseFloat(this.state.bid),
        metadata: metadata,
        ... this.state.channel != 'new' && this.state.channel != 'anonymous' ? {channel_name: this.state.channel} : {},
      };

      if (this.refs.file.getValue() !== '') {
	      publishArgs.file_path = this.refs.file.getValue();
      }

      lbry.publish(publishArgs, (message) => {
        this.handlePublishStarted();
      }, null, (error) => {
        this.handlePublishError(error);
      });
    };

    if (this.state.isFee) {
      lbry.getUnusedAddress((address) => {
        metadata.fee = {};
        metadata.fee[this.state.feeCurrency] = {
          amount: parseFloat(this.state.feeAmount),
          address: address,
        };

        doPublish();
      });
    } else {
      doPublish();
    }
  },
  getInitialState: function() {
    return {
      channels: null,
      rawName: '',
      name: '',
      bid: 10,
      hasFile: false,
      feeAmount: '',
      feeCurrency: 'USD',
      channel: 'anonymous',
      newChannelName: '@',
      newChannelBid: 10,
      nameResolved: null,
      myClaimExists: null,
      topClaimValue: 0.0,
      myClaimValue: 0.0,
      myClaimMetadata: null,
      copyrightNotice: '',
      otherLicenseDescription: '',
      otherLicenseUrl: '',
      uploadProgress: 0.0,
      uploaded: false,
      errorMessage: null,
      submitting: false,
      creatingChannel: false,
      modal: null,
    };
  },
  handlePublishStarted: function() {
    this.setState({
      modal: 'publishStarted',
    });
  },
  handlePublishStartedConfirmed: function() {
    window.location = "?published";
  },
  handlePublishError: function(error) {
    this.setState({
      submitting: false,
      modal: 'error',
      errorMessage: error.message,
    });
  },
  handleNameChange: function(event) {
    var rawName = event.target.value;

    if (!rawName) {
      this.setState({
        rawName: '',
        name: '',
        nameResolved: false,
      });

      return;
    }

    if (!lbry.nameIsValid(rawName, false)) {
      this.refs.name.showError('LBRY names must contain only letters, numbers and dashes.');
      return;
    }

    const name = rawName.toLowerCase();
    this.setState({
      rawName: rawName,
      name: name,
      nameResolved: null,
      myClaimExists: null,
    });

    lbry.getMyClaim(name, (myClaimInfo) => {
      if (name != this.state.name) {
        // A new name has been typed already, so bail
        return;
      }

      this.setState({
        myClaimExists: !!myClaimInfo,
      });
      lbry.resolve({uri: name}).then((claimInfo) => {
        if (name != this.state.name) {
          return;
        }

        if (!claimInfo) {
          this.setState({
            nameResolved: false,
          });
        } else {
          const topClaimIsMine = (myClaimInfo && myClaimInfo.claim.amount >= claimInfo.claim.amount);
          const newState = {
            nameResolved: true,
            topClaimValue: parseFloat(claimInfo.claim.amount),
            myClaimExists: !!myClaimInfo,
            myClaimValue: myClaimInfo ? parseFloat(myClaimInfo.claim.amount) : null,
            myClaimMetadata: myClaimInfo ? myClaimInfo.value : null,
            topClaimIsMine: topClaimIsMine,
          };

          if (topClaimIsMine) {
            newState.bid = myClaimInfo.claim.amount;
          } else if (this.state.myClaimMetadata) {
            // Just changed away from a name we have a claim on, so clear pre-fill
            newState.bid = '';
          }

          this.setState(newState);
        }
      }, () => { // Assume an error means the name is available
        this.setState({
          name: name,
          nameResolved: false,
          myClaimExists: false,
        });
      });
    });
  },
  handleBidChange: function(event) {
    this.setState({
      bid: event.target.value,
    });
  },
  handleFeeAmountChange: function(event) {
    this.setState({
      feeAmount: event.target.value,
    });
  },
  handleFeeCurrencyChange: function(event) {
    this.setState({
      feeCurrency: event.target.value,
    });
  },
  handleFeePrefChange: function(feeEnabled) {
    this.setState({
      isFee: feeEnabled
    });
  },
  handleLicenseChange: function(event) {
    var licenseType = event.target.options[event.target.selectedIndex].getAttribute('data-license-type');
    var newState = {
      copyrightChosen: licenseType == 'copyright',
      otherLicenseChosen: licenseType == 'other',
    };

    if (licenseType == 'copyright') {
      newState.copyrightNotice = 'All rights reserved.'
    }

    this.setState(newState);
  },
  handleCopyrightNoticeChange: function(event) {
    this.setState({
      copyrightNotice: event.target.value,
    });
  },
  handleOtherLicenseDescriptionChange: function(event) {
    this.setState({
      otherLicenseDescription: event.target.value,
    });
  },
  handleOtherLicenseUrlChange: function(event) {
    this.setState({
      otherLicenseUrl: event.target.value,
    });
  },
  handleChannelChange: function (event) {
    const channel = event.target.value;

    this.setState({
      channel: channel,
    });
  },
  handleNewChannelNameChange: function (event) {
    const newChannelName = (event.target.value.startsWith('@') ? event.target.value : '@' + event.target.value);

    if (newChannelName.length > 1 && !lbry.nameIsValid(newChannelName.substr(1), false)) {
      this.refs.newChannelName.showError('LBRY channel names must contain only letters, numbers and dashes.');
      return;
    } else {
      this.refs.newChannelName.clearError()
    }

    this.setState({
      newChannelName: newChannelName,
    });
  },
  handleNewChannelBidChange: function (event) {
    this.setState({
      newChannelBid: event.target.value,
    });
  },
  handleTOSChange: function(event) {
    this.setState({
      TOSAgreed: event.target.checked,
    });
  },
  handleCreateChannelClick: function (event) {
    if (this.state.newChannelName.length < 5) {
      this.refs.newChannelName.showError('LBRY channel names must be at least 4 characters in length.');
      return;
    }

    this.setState({
      creatingChannel: true,
    });

    const newChannelName = this.state.newChannelName;
    lbry.channel_new({channel_name: newChannelName, amount: parseInt(this.state.newChannelBid)}).then(() => {
      setTimeout(() => {
        this.setState({
          creatingChannel: false,
        });

        this._updateChannelList(newChannelName);
      }, 5000);
    }, (error) => {
      // TODO: better error handling
      this.refs.newChannelName.showError('Unable to create channel due to an internal error.');
      this.setState({
        creatingChannel: false,
      });
    });
  },
  getLicenseUrl: function() {
    if (!this.refs.meta_license) {
      return '';
    } else if (this.state.otherLicenseChosen) {
      return this.state.otherLicenseUrl;
    } else {
      return this.refs.meta_license.getSelectedElement().getAttribute('data-url') || '' ;
    }
  },
  componentWillMount: function() {
    this._updateChannelList();
  },
  componentDidUpdate: function() {
  },
  onFileChange: function() {
    if (this.refs.file.getValue()) {
      this.setState({ hasFile: true })
    } else {
      this.setState({ hasFile: false })
    }
  },
  getNameBidHelpText: function() {
    if (!this.state.name) {
      return "Select a URL for this publish.";
    } else if (this.state.nameResolved === false) {
      return "This URL is unused.";
    } else if (this.state.myClaimExists) {
      return "You have already used this URL. Publishing to it again will update your previous publish."
    } else if (this.state.topClaimValue) {
      return <span>A deposit of at least <strong>{this.state.topClaimValue}</strong> {this.state.topClaimValue == 1 ? 'credit ' : 'credits '}
                  is required to win <strong>{this.state.name}</strong>. However, you can still get a permanent URL for any amount.</span>
    } else {
      return '';
    }
  },
  closeModal: function() {
    this.setState({
      modal: null,
    });
  },
  render: function() {
    if (this.state.channels === null) {
      return null;
    }

    const lbcInputHelp = "This LBC remains yours and the deposit can be undone at any time."

    return (
      <main ref="page">
        <form onSubmit={this.handleSubmit}>
          <section className="card">
            <div className="card__title-primary">
              <h4>Content</h4>
              <div className="card__subtitle">
                What are you publishing?
              </div>
            </div>
            <div className="card__content">
              <FormRow name="file" label="File" ref="file" type="file" onChange={this.onFileChange}
                       helper={this.state.myClaimExists ? "If you don't choose a file, the file from your existing claim will be used." : null}/>
            </div>
            { !this.state.hasFile ? '' :
                <div>
                <div className="card__content">
                  <FormRow label="Title" type="text" ref="meta_title" name="title" placeholder="Titular Title" />
                </div>
                <div className="card__content">
                  <FormRow type="text" label="Thumbnail URL" ref="meta_thumbnail" name="thumbnail" placeholder="http://spee.ch/mylogo" />
                </div>
                <div className="card__content">
                  <FormRow label="Description" type="textarea" ref="meta_description" name="description" placeholder="Description of your content" />
                </div>
                <div className="card__content">
                  <FormRow label="Language" type="select" defaultValue="en" ref="meta_language" name="language">
                    <option value="en">English</option>
                    <option value="zh">Chinese</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="jp">Japanese</option>
                    <option value="ru">Russian</option>
                    <option value="es">Spanish</option>
                  </FormRow>
                </div>
                <div className="card__content">
                  <FormRow type="select" label="Maturity" defaultValue="en" ref="meta_nsfw" name="nsfw">
                    {/* <option value=""></option> */}
                    <option value="0">All Ages</option>
                    <option value="1">Adults Only</option>
                  </FormRow>
                </div>
              </div>}
          </section>

          <section className="card">
            <div className="card__title-primary">
              <h4>Access</h4>
              <div className="card__subtitle">
                How much does this content cost?
              </div>
            </div>
            <div className="card__content">
              <div className="form-row__label-row">
                <label className="form-row__label">Price</label>
              </div>
              <FormRow label="Free" type="radio" name="isFree" value="1" onChange={ () => { this.handleFeePrefChange(false) } } defaultChecked={!this.state.isFee} />
              <FormField type="radio" name="isFree" label={!this.state.isFee ? 'Choose price...' : 'Price ' }
                         onChange={ () => { this.handleFeePrefChange(true) } } defaultChecked={this.state.isFee} />
             <span className={!this.state.isFee ? 'hidden' : ''}>
               <FormField type="number" className="form-field__input--inline" step="0.01" placeholder="1.00" onChange={this.handleFeeAmountChange} /> <FormField type="select" onChange={this.handleFeeCurrencyChange}>
               <option value="USD">US Dollars</option>
               <option value="LBC">LBRY credits</option>
             </FormField>
               </span>
              { this.state.isFee ?
                  <div className="form-field__helper">
                    If you choose to price this content in dollars, the number of credits charged will be adjusted based on the value of LBRY credits at the time of purchase.
                  </div> : '' }
              <FormRow label="License" type="select" ref="meta_license" name="license" onChange={this.handleLicenseChange}>
                <option></option>
                <option>Public Domain</option>
                <option data-url="https://creativecommons.org/licenses/by/4.0/legalcode">Creative Commons Attribution 4.0 International</option>
                <option data-url="https://creativecommons.org/licenses/by-sa/4.0/legalcode">Creative Commons Attribution-ShareAlike 4.0 International</option>
                <option data-url="https://creativecommons.org/licenses/by-nd/4.0/legalcode">Creative Commons Attribution-NoDerivatives 4.0 International</option>
                <option data-url="https://creativecommons.org/licenses/by-nc/4.0/legalcode">Creative Commons Attribution-NonCommercial 4.0 International</option>
                <option data-url="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</option>
                <option data-url="https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International</option>
                <option data-license-type="copyright" {... this.state.copyrightChosen ? {value: this.state.copyrightNotice} : {}}>Copyrighted...</option>
                <option data-license-type="other" {... this.state.otherLicenseChosen ? {value: this.state.otherLicenseDescription} : {}}>Other...</option>
              </FormRow>
              <FormField type="hidden" ref="meta_license_url" name="license_url" value={this.getLicenseUrl()} />
              {this.state.copyrightChosen
                ?  <FormRow label="Copyright notice" type="text" name="copyright-notice"
                            value={this.state.copyrightNotice} onChange={this.handleCopyrightNoticeChange} />
                : null}
              {this.state.otherLicenseChosen ?
               <FormRow label="License description" type="text" name="other-license-description" onChange={this.handleOtherLicenseDescriptionChange} />
                : null}
              {this.state.otherLicenseChosen ?
               <FormRow label="License URL" type="text" name="other-license-url" onChange={this.handleOtherLicenseUrlChange} />
                : null}
            </div>
          </section>

          <section className="card">
            <div className="card__title-primary">
              <h4>Identity</h4>
              <div className="card__subtitle">
                Who created this content?
              </div>
            </div>
            <div className="card__content">
              <FormRow type="select" tabIndex="1" onChange={this.handleChannelChange} value={this.state.channel}>
                <option key="anonymous" value="anonymous">Anonymous</option>
                {this.state.channels.map(({name}) => <option key={name} value={name}>{name}</option>)}
                <option key="new" value="new">New identity...</option>
              </FormRow>
            </div>
            {this.state.channel == 'new' ?
               <div className="card__content">
                 <FormRow label="Name" type="text" onChange={this.handleNewChannelNameChange} ref={newChannelName => { this.refs.newChannelName = newChannelName }}
                          value={this.state.newChannelName} />
                 <FormRow label="Deposit"
                          postfix="LBC"
                          step="0.01"
                          type="number"
                          helper={lbcInputHelp}
                          onChange={this.handleNewChannelBidChange}
                          value={this.state.newChannelBid} />
                 <div className="form-row-submit">
                    <Link button="primary" label={!this.state.creatingChannel ? 'Create identity' : 'Creating identity...'} onClick={this.handleCreateChannelClick} disabled={this.state.creatingChannel} />
                 </div>
                </div>
              : null}
          </section>


          <section className="card">
            <div className="card__title-primary">
              <h4>Address</h4>
              <div className="card__subtitle">Where should this content permanently reside? <Link label="Read more" href="https://lbry.io/faq/naming" />.</div>
            </div>
            <div className="card__content">
              <FormRow prefix="lbry://" type="text" ref="name" placeholder="myname" value={this.state.rawName} onChange={this.handleNameChange}
                       helper={this.getNameBidHelpText()} />
            </div>
            { this.state.rawName ?
                <div className="card__content">
                  <FormRow ref="bid"
                             type="number"
                             step="0.01"
                             label="Deposit"
                             postfix="LBC"
                             onChange={this.handleBidChange}
                             value={this.state.bid}
                             placeholder={this.state.nameResolved ? this.state.topClaimValue + 10 : 100}
                             helper={lbcInputHelp} />
                </div> : '' }
          </section>

          <section className="card">
            <div className="card__title-primary">
              <h4>Terms of Service</h4>
            </div>
            <div className="card__content">
              <FormRow label={
                <span>I agree to the <Link href="https://www.lbry.io/termsofservice" label="LBRY terms of service" checked={this.state.TOSAgreed} /></span>
              } type="checkbox" name="tos_agree" ref={(field) => { this.refs.tos_agree = field }} onChange={this.handleTOSChange} />
            </div>
          </section>

          <div className="card-series-submit">
            <Link button="primary" label={!this.state.submitting ? 'Publish' : 'Publishing...'} onClick={this.handleSubmit} disabled={this.state.submitting} />
            <Link button="cancel" onClick={window.history.back} label="Cancel" />
            <input type="submit" className="hidden" />
          </div>
        </form>

        <Modal isOpen={this.state.modal == 'publishStarted'} contentLabel="File published"
               onConfirmed={this.handlePublishStartedConfirmed}>
          <p>Your file has been published to LBRY at the address <code>lbry://{this.state.name}</code>!</p>
          <p>The file will take a few minutes to appear for other LBRY users. Until then it will be listed as "pending" under your published files.</p>
        </Modal>
        <Modal isOpen={this.state.modal == 'error'} contentLabel="Error publishing file"
               onConfirmed={this.closeModal}>
          The following error occurred when attempting to publish your file: {this.state.errorMessage}
        </Modal>
      </main>
    );
  }
});

export default PublishPage;
