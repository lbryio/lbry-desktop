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

  handleSubmit: function() {
    this.setState({
      submitting: true,
    });

    var checkFields = this._requiredFields.slice();
    if (!this.state.nameIsMine) {
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

    if (missingFieldFound) {
      this.setState({
        submitting: false,
      });
      return;
    }

    if (this.state.nameIsMine) {
      // Pre-populate with existing metadata
      var metadata = Object.assign({}, this.state.claimMetadata);
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

    /*
    metadata.license = {};
    metadata.license.name = this.refs.meta_license.getValue();

    var licenseUrl = this.refs.meta_license_url.getValue();
    if (licenseUrl != '') {
      metadata.license.url = licenseUrl;
    }
    */

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

      console.log(publishArgs);
      lbry.publish(publishArgs, (message) => {
        this.handlePublishStarted();
        this.setState({
          submitting: false,
        });
      }, null, (error) => {
        this.handlePublishError(error);
        this.setState({
          submitting: false,
        });
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
      name: '',
      bid: '',
      feeAmount: '',
      feeCurrency: 'USD',
      nameResolved: false,
      nameIsMine: false,
      claimValue: 0.0,
      claimMetadata: null,
      fileInfo: null,
      uploadProgress: 0.0,
      uploaded: false,
      tempFileReady: false,
      submitting: false,
    };
  },
  handlePublishStarted: function() {
    alert(`Your file ${this.refs.meta_title.getValue()} has been published to LBRY at the address lbry://${this.state.name}!\n\n` +
          `You will now be taken to your My Files page, where your newly published file will be listed. Your file will take a few minutes to appear for other LBRY users; until then it will be listed as "pending."`);
    window.location = "?published";
  },
  handlePublishError: function(error) {
    alert(`The following error occurred when attempting to publish your file:\n\n` +
          error.message);
  },
  handleNameChange: function(event) {
    var rawName = event.target.value;

    if (!rawName) {
      this.setState({
        name: '',
        nameResolved: false,
      });

      return;
    }

    var name = lbry.formatName(rawName);

    lbry.resolveName(name, (info) => {
      if (name != lbry.formatName(this.refs.name.getValue())) {
        // A new name has been typed already, so bail
        return;
      }

      if (!info) {
        this.setState({
          name: name,
          nameResolved: false,
        });
      } else {
        lbry.getClaimInfo(name, (claimInfo) => {
          if (name != this.refs.name.getValue()) {
            return;
          }

          var newState = {
            name: name,
            nameResolved: true,
            nameIsMine: claimInfo.is_mine,
            claimValue: parseFloat(claimInfo.amount),
            claimMetadata: claimInfo.value,
          };

          if (claimInfo.is_mine) {
            newState.bid = claimInfo.amount;
          } else if (this.state.nameIsMine && !claimInfo.name_is_mine) {
            // Just changed away from a name we control, so clear pre-fill
            newState.bid = '';
          }

          this.setState(newState);
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

      xhr.open('POST', '/upload', true);
      xhr.send(new FormData(fileInput.form));
    }
  },
  handleFeePrefChange: function(feeEnabled) {
    this.setState({
      isFee: feeEnabled
    });
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
  render: function() {
    return (
      <main ref="page">
        <section className="card">
          <h4>LBRY Name</h4>
          <div className="form-row">
            lbry://<FormField type="text" ref="name" onChange={this.handleNameChange} />
            {
              (!this.state.name ? '' :
                (! this.state.nameResolved ? <em> The name <strong>{this.state.name}</strong> is available.</em>
                                           : (this.state.nameIsMine ? <em> You already control the name <strong>{this.state.name}</strong>. You can use this page to update your claim.</em>
                                                                    : <em> The name {this.state.name} is currently claimed for <strong>{lbry.formatCredits(this.state.claimValue)}</strong> credits.</em>)))
            }
            <div className="help">What LBRY name would you like to claim for this file?</div>
          </div>
        </section>

        <section className="card">
          <h4>Choose File</h4>
          <form>
            <FormField name="file" ref="file" type="file" onChange={this.handleFileChange} />
            { !this.state.fileInfo ? '' :
                (!this.state.tempFileReady ? <div>
                                               <progress ref='progress'></progress>
                                               {!this.state.uploaded ? <span> Importing file into LBRY...</span> : <span> Processing file...</span>}
                                             </div>
                                           : <div>File ready for publishing!</div>) }
          </form>
          { this.state.nameIsMine ? <div className="help">If you don't choose a file, the file from your existing claim will be used.</div> : null }
        </section>

        <section className="card">
          <h4>Bid Amount</h4>
          <div className="form-row">
            Credits <FormField ref="bid" style={publishNumberStyle} type="text" onChange={this.handleBidChange} value={this.state.bid} placeholder={this.state.nameResolved ? lbry.formatCredits(this.state.claimValue + 10) : 100} />
            <div className="help">How much would you like to bid for this name?
            { !this.state.nameResolved ? <span> Since this name is not currently resolved, you may bid as low as you want, but higher bids help prevent others from claiming your name.</span>
                                       : (this.state.nameIsMine ? <span> Your current bid is <strong>{lbry.formatCredits(this.state.claimValue)}</strong> credits.</span>
                                                                : <span> You must bid over <strong>{lbry.formatCredits(this.state.claimValue)}</strong> credits to claim this name.</span>) }
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
          <label htmlFor="license">License info</label><FormField type="text" ref="meta_license" name="license" defaultValue="Creative Commons Attribution 3.0 United States" style={publishFieldStyle} />
          </div>
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
          <div className="form-row">
            <label htmlFor="meta_license_url">License URL</label> <FormField type="text" ref="meta_license_url" name="license_url" defaultValue="https://creativecommons.org/licenses/by/3.0/us/legalcode" style={publishFieldStyle} />
          </div>
        </section>

        <div className="card-series-submit">
          <Link button="primary" label={!this.state.submitting ? 'Publish' : 'Publishing...'} onClick={this.handleSubmit} disabled={this.state.submitting} />
          <Link button="cancel" href="/" label="Cancel"/>
         </div>
       </main>
    );
  }
});
