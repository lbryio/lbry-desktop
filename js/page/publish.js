import React from 'react';
import lbry from '../lbry.js';
import FormField from '../component/form.js';
import {Link} from '../component/link.js';
import Modal from '../component/modal.js';


var publishNumberStyle = {
  width: '50px',
}, publishFieldLabelStyle = {
  display: 'inline-block',
  width: '118px',
  textAlign: 'right',
  verticalAlign: 'top',
}, publishFieldStyle = {
  width: '330px',
};

var PublishPage = React.createClass({
  _requiredFields: ['name', 'bid', 'meta_title', 'meta_author', 'meta_license', 'meta_description'],

  handleSubmit: function(event) {
    if (typeof event !== 'undefined') {
      event.preventDefault();
    }

    this.setState({
      submitting: true,
    });

    var checkFields = this._requiredFields.slice();
    if (!this.state.myClaimExists) {
      checkFields.push('file');
    }

    var missingFieldFound = false;
    for (let fieldName of checkFields) {
      var field = this.refs[fieldName];
      if (field.getValue() === '') {
        field.warnRequired();
        if (!missingFieldFound) {
          field.focus();
          missingFieldFound = true;
        }
      }
    }

    let fileProcessing = false;
    if (this.state.fileInfo && !this.state.tempFileReady) {
      this.refs.file.showAdvice('Your file is still processing.');
      this.refs.file.focus();
      fileProcessing = true;
    }

    if (missingFieldFound || fileProcessing) {
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

    for (let metaField of ['title', 'author', 'description', 'thumbnail', 'license', 'license_url', 'language', 'nsfw']) {
      var value = this.refs['meta_' + metaField].getValue();
      if (value !== '') {
        metadata[metaField] = value;
      }
    }

    var licenseUrl = this.refs.meta_license_url.getValue();
    if (licenseUrl) {
      metadata.license_url = licenseUrl;
    }

    var doPublish = () => {
      var publishArgs = {
        name: this.state.name,
        bid: parseFloat(this.state.bid),
        metadata: metadata,
      };

      if (this.refs.file.getValue() !== '') {
        publishArgs.file_path = this._tempFilePath;
      }
      
      lbry.publish(publishArgs, (message) => {
        this.handlePublishStarted();
      }, null, (error) => {
        this.handlePublishError(error);
      });
    };

    if (this.state.isFee) {
      lbry.getNewAddress((address) => {
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
    this._tempFilePath = null;

    return {
      rawName: '',
      name: '',
      bid: '',
      feeAmount: '',
      feeCurrency: 'USD',
      nameResolved: false,
      topClaimValue: 0.0,
      myClaimValue: 0.0,
      myClaimMetadata: null,
      myClaimExists: null,
      fileInfo: null,
      copyrightNotice: '',
      otherLicenseDescription: '',
      otherLicenseUrl: '',
      uploadProgress: 0.0,
      uploaded: false,
      errorMessage: null,
      tempFileReady: false,
      submitting: false,
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
      this.refs.name.showAdvice('LBRY names must contain only letters, numbers and dashes.');
      return;
    }

    this.setState({
      rawName: rawName,
    });

    var name = rawName.toLowerCase();

    lbry.resolveName(name, (info) => {
      if (name != this.refs.name.getValue().toLowerCase()) {
        // A new name has been typed already, so bail
        return;
      }

      if (!info) {
        this.setState({
          name: name,
          nameResolved: false,
          myClaimExists: false,
        });
      } else {
        lbry.getMyClaim(name, (myClaimInfo) => {
          lbry.getClaimInfo(name, (claimInfo) => {
            if (name != this.refs.name.getValue()) {
              return;
            }

            const topClaimIsMine = (myClaimInfo && myClaimInfo.amount >= claimInfo.amount);
            const newState = {
              name: name,
              nameResolved: true,
              topClaimValue: parseFloat(claimInfo.amount),
              myClaimExists: !!myClaimInfo,
              myClaimValue: myClaimInfo ? parseFloat(myClaimInfo.amount) : null,
              myClaimMetadata: myClaimInfo ? myClaimInfo.value : null,
              topClaimIsMine: topClaimIsMine,
            };

            if (topClaimIsMine) {
              newState.bid = myClaimInfo.amount;
            } else if (this.state.myClaimMetadata) {
              // Just changed away from a name we have a claim on, so clear pre-fill
              newState.bid = '';
            }

            this.setState(newState);
          });
        });
      }
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
  handleFileChange: function(event) {
    event.preventDefault();

    var fileInput = event.target;

    this._tempFilePath = null;
    if (fileInput.files.length == 0) {
      // File was removed
      this.setState({
        fileInfo: null,
        uploadProgress: 0.0,
        uploaded: false,
        tempFileReady: false,
      });
    } else {
      var file = fileInput.files[0];
      this.setState({
        fileInfo: {
          name: file.name,
          size: file.size,
        },
        uploadProgress: 0.0,
        uploaded: false,
        tempFileReady: false,
      });

      var xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (event) => {
        this.setState({
          uploadProgress: (event.loaded / event.total),
        });
      });
      xhr.upload.addEventListener('load', (event) => {
        this.setState({
          uploaded: true,
        });
      });
      xhr.addEventListener('load', (event) => {
        this._tempFilePath = JSON.parse(xhr.responseText);
        this.setState({
          tempFileReady: true,
        });
      })

      var formData = new FormData(fileInput.form);
      formData.append('file', fileInput.files[0]);
      xhr.open('POST', lbry.webUiUri + '/upload', true);
      xhr.send(formData);
    }
  },
  handleFeePrefChange: function(feeEnabled) {
    this.setState({
      isFee: feeEnabled
    });
  },
  handeLicenseChange: function(event) {
    var licenseType = event.target.options[event.target.selectedIndex].getAttribute('data-license-type');
    var newState = {
      copyrightChosen: licenseType == 'copyright',
      otherLicenseChosen: licenseType == 'other',
    };

    if (licenseType == 'copyright') {
      var author = this.refs.meta_author.getValue();
      newState.copyrightNotice = 'Copyright ' + (new Date().getFullYear()) + (author ? ' ' + author : '');
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
  getLicenseUrl: function() {
    if (!this.refs.meta_license) {
      return '';
    } else if (this.state.otherLicenseChosen) {
      return this.state.otherLicenseUrl;
    } else {
      return this.refs.meta_license.getSelectedElement().getAttribute('data-url') || '' ;
    }
  },
  componentDidMount: function() {
    document.title = "Publish";
  },
  componentDidUpdate: function() {
    if (this.state.fileInfo && !this.state.tempFileReady) {
      // A file was chosen but the daemon hasn't finished processing it yet, i.e. it's loading, so
      // we're displaying a progress bar and need a value for it.

      // React can't unset the "value" prop (to show an "indeterminate" bar) after it's already
      // been set, so we have to manage it manually.

      if (!this.state.uploaded) {
        // Still uploading
        this.refs.progress.setAttribute('value', this.state.uploadProgress);
      } else {
        // Fully uploaded and waiting for server to finish processing, so set progress bar to "indeterminite"
        this.refs.progress.removeAttribute('value');
      }
    }
  },
  // Also getting a type warning here too
  render: function() {
    return (
      <main ref="page">
        <form onSubmit={this.handleSubmit}>
          <section className="card">
            <h4>LBRY Name</h4>
            <div className="form-row">
              lbry://<FormField type="text" ref="name" value={this.state.rawName} onChange={this.handleNameChange} />
              {
                (!this.state.name ? '' :
                  (! this.state.nameResolved ? <em> The name <strong>{this.state.name}</strong> is available.</em>
                                             : (this.state.myClaimExists ? <em> You already have a claim on the name <strong>{this.state.name}</strong>. You can use this page to update your claim.</em>
                                                                         : <em> The name <strong>{this.state.name}</strong> is currently claimed for <strong>{this.state.topClaimValue}</strong> {this.state.topClaimValue == 1 ? 'credit' : 'credits'}.</em>)))
              }
              <div className="help">What LBRY name would you like to claim for this file?</div>
            </div>
          </section>

          <section className="card">
            <h4>Choose File</h4>
            <FormField name="file" ref="file" type="file" onChange={this.handleFileChange} />
            { !this.state.fileInfo ? '' :
                (!this.state.tempFileReady ? <div>
                                               <progress ref='progress'></progress>
                                               {!this.state.uploaded ? <span> Importing file into LBRY...</span> : <span> Processing file...</span>}
                                             </div>
                                           : <div>File ready for publishing!</div>) }
            { this.state.myClaimExists ? <div className="help">If you don't choose a file, the file from your existing claim will be used.</div> : null }
          </section>

          <section className="card">
            <h4>Bid Amount</h4>
            <div className="form-row">
              Credits <FormField ref="bid" style={publishNumberStyle} type="text" onChange={this.handleBidChange} value={this.state.bid} placeholder={this.state.nameResolved ? this.state.topClaimValue + 10 : 100} />
              <div className="help">How much would you like to bid for this name?
              { !this.state.nameResolved ? <span> Since this name is not currently resolved, you may bid as low as you want, but higher bids help prevent others from claiming your name.</span>
                                         : (this.state.topClaimIsMine ? <span> You currently control this name with a bid of <strong>{this.state.myClaimValue}</strong> {this.state.myClaimValue == 1 ? 'credit' : 'credits'}.</span>
                                                                      : (this.state.myClaimExists ? <span> You have a non-winning bid on this name for <strong>{this.state.myClaimValue}</strong> {this.state.myClaimValue == 1 ? 'credit' : 'credits'}.
                                                                                                           To control this name, you'll need to increase your bid to more than <strong>{this.state.topClaimValue}</strong> {this.state.topClaimValue == 1 ? 'credit' : 'credits'}.</span>
                                                                                                  : <span> You must bid over <strong>{this.state.topClaimValue}</strong> {this.state.topClaimValue == 1 ? 'credit' : 'credits'} to claim this name.</span>)) }
              </div>
            </div>
          </section>

          <section className="card">
            <h4>Fee</h4>
            <div className="form-row">
              <label>
               <FormField type="radio" onChange={ () => { this.handleFeePrefChange(false) } } checked={!this.state.isFee} /> No fee
              </label>
              <label>
               <FormField type="radio" onChange={ () => { this.handleFeePrefChange(true) } } checked={this.state.isFee} /> { !this.state.isFee ? 'Choose fee...' : 'Fee ' }
               <span className={!this.state.isFee ? 'hidden' : ''}>
                 <FormField type="text" onChange={this.handleFeeAmountChange} style={publishNumberStyle} /> <FormField type="select" onChange={this.handleFeeCurrencyChange}>
                   <option value="USD">US Dollars</option>
                   <option value="LBC">LBRY credits</option>
                 </FormField>
                 </span>
              </label>
              <div className="help">
                <p>How much would you like to charge for this file?</p>
                If you choose to price this content in dollars, the number of credits charged will be adjusted based on the value of LBRY credits at the time of purchase.
              </div>
            </div>
          </section>


          <section className="card">
            <h4>Your Content</h4>

            <div className="form-row">
              <label htmlFor="title">Title</label><FormField type="text" ref="meta_title" name="title" placeholder="My Show, Episode 1" style={publishFieldStyle} />
            </div>
            <div className="form-row">
              <label htmlFor="author">Author</label><FormField type="text" ref="meta_author" name="author" placeholder="My Company, Inc." style={publishFieldStyle} />
            </div>
            <div className="form-row">
            <label htmlFor="license">License</label><FormField type="select" ref="meta_license" name="license" onChange={this.handeLicenseChange}>
              <option data-url="https://creativecommons.org/licenses/by/4.0/legalcode">Creative Commons Attribution 4.0 International</option>
              <option data-url="https://creativecommons.org/licenses/by-sa/4.0/legalcode">Creative Commons Attribution-ShareAlike 4.0 International</option>
              <option data-url="https://creativecommons.org/licenses/by-nd/4.0/legalcode">Creative Commons Attribution-NoDerivatives 4.0 International</option>
              <option data-url="https://creativecommons.org/licenses/by-nc/4.0/legalcode">Creative Commons Attribution-NonCommercial 4.0 International</option>
              <option data-url="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International</option>
              <option data-url="https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International</option>
              <option>Public Domain</option>
              <option data-license-type="copyright" {... this.state.copyrightChosen ? {value: this.state.copyrightNotice} : {}}>Copyrighted...</option>
              <option data-license-type="other" {... this.state.otherLicenseChosen ? {value: this.state.otherLicenseDescription} : {}}>Other...</option>
            </FormField>
            <FormField type="hidden" ref="meta_license_url" name="license_url" value={this.getLicenseUrl()} />
            </div>
            {this.state.copyrightChosen
              ? <div className="form-row">
                  <label htmlFor="copyright-notice" value={this.state.copyrightNotice}>Copyright notice</label><FormField type="text" name="copyright-notice" value={this.state.copyrightNotice} onChange={this.handleCopyrightNoticeChange} style={publishFieldStyle} />
                </div>
              : null}
            {this.state.otherLicenseChosen
              ? <div className="form-row">
                  <label htmlFor="other-license-description">License description</label><FormField type="text" name="other-license-description" onChange={this.handleOtherLicenseDescriptionChange} style={publishFieldStyle} />
                </div>
              : null}
            {this.state.otherLicenseChosen
              ? <div className="form-row">
                  <label htmlFor="other-license-url">License URL</label> <FormField type="text" name="other-license-url" style={publishFieldStyle} onChange={this.handleOtherLicenseUrlChange} />
                </div>
              : null}

            <div className="form-row">
            <label htmlFor="language">Language</label> <FormField type="select" defaultValue="en" ref="meta_language" name="language">
                 <option value="en">English</option>
                 <option value="zh">Chinese</option>
                 <option value="fr">French</option>
                 <option value="de">German</option>
                 <option value="jp">Japanese</option>
                 <option value="ru">Russian</option>
                 <option value="es">Spanish</option>
              </FormField>
            </div>
            <div className="form-row">
              <label htmlFor="description">Description</label> <FormField type="textarea" ref="meta_description" name="description" placeholder="Description of your content" style={publishFieldStyle} />
            </div>
            <div className="form-row">
              <label><FormField type="checkbox" ref="meta_nsfw" name="nsfw" placeholder="Description of your content" /> Not Safe For Work</label>
            </div>
          </section>



          <section className="card">
            <h4>Additional Content Information (Optional)</h4>
            <div className="form-row">
              <label htmlFor="meta_thumbnail">Thumbnail URL</label> <FormField type="text" ref="meta_thumbnail" name="thumbnail" placeholder="http://mycompany.com/images/ep_1.jpg" style={publishFieldStyle} />
            </div>
          </section>

          <div className="card-series-submit">
           <Link button="primary" label={!this.state.submitting ? 'Publish' : 'Publishing...'} onClick={this.handleSubmit} disabled={this.state.submitting} />
           <Link button="cancel" href="/" label="Cancel"/>
           <input type='submit' className='hidden' />
          </div>
        </form>

        <Modal isOpen={this.state.modal == 'publishStarted'} contentLabel="File published"
               onConfirmed={this.handlePublishStartedConfirmed}>
          <p>Your file has been published to LBRY at the address <code>lbry://{this.state.name}</code>!</p>
          You will now be taken to your My Files page, where your newly published file will be listed. The file will take a few minutes to appear for other LBRY users; until then it will be listed as "pending."
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
