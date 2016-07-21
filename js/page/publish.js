var publishNumberInputStyle = {
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
  publish: function() {
    this.setState({
      submitting: true,
    });

    var metadata = {
      title: this.refs.meta_title.value,
      author: this.refs.meta_author.value,
      description: this.refs.meta_description.value,
      language: this.refs.meta_language.value,
      license: this.refs.meta_license.value,
    };

    if (this.refs.meta_thumbnail.value) {
      metadata.thumbnail = this.refs.meta_thumbnail.value;
    }

    var doPublish = () => {
      lbry.publish({
        name: this.state.name,
        file_path: this._tempFilePath,
        bid: parseFloat(this.state.bid),
        metadata: metadata,
      }, (message) => {
        this.handlePublishSuccess(this.state.name, this.state.title);
        this.setState({
          submitting: false,
        });
      }, (error) => {
        this.handlePublishError(error);
        this.setState({
          submitting: false,
        });
      });
    };

    if (this.state.isFee) {
      lbry.getNewAddress((address) => {
        metadata.fee = {
          'LBC': {
            amount: parseFloat(this.state.fee),
            address: address,
          },
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
      nameResolved: false,
      claimValue: 0.0,
      fileInfo: null,
      uploadProgress: 0.0,
      uploaded: false,
      tempFileReady: false,
      submitting: false,
    };
  },
  handlePublishSuccess: function(name, title) {
    alert(`Your file ${title} has been published to LBRY at the address lbry://${name}!\n\n` +
          `You will now be taken to your My Files page, where your newly published file should appear within a few minutes.`);
    window.location = "?myfiles";
  },
  handlePublishError: function(error) {
    alert(`The following error occurred when attempting to publish your file:\n\n` +
          error.message);
  },
  handleNameChange: function(event) {
    var name = event.target.value;

    if (!name) {
      this.setState({
        name: '',
        nameResolved: false,
      });

      return;
    }

    lbry.resolveName(name, (info) => {
      if (!info) {
        this.setState({
          name: name,
          nameResolved: false,
        });
      } else {
        lbry.search(name, (results) => {
          var claimValue = results[0].value;

          this.setState({
            name: name,
            nameResolved: true,
            claimValue: parseFloat(claimValue),
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
  handleFeeChange: function(event) {
    this.setState({
      fee: event.target.value,
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
  readyToPublish: function() {
    var bidFloat = parseFloat(this.state.bid);
    return (this.state.name && this.state.fileInfo && !isNaN(bidFloat) && (!this.state.claimValue || bidFloat > this.state.claimValue));
  },
  render: function() {
    if (this.state.fileInfo && !this.state.tempFileReady) {
      // A file was chosen but the daemon hasn't finished processing it yet, i.e. it's loading, so
      // we need a value for the progress bar.

      if (!this.state.uploaded) {
        // Still uploading
        var progressOpts = {
          value: this.state.uploadProgress,
        };
      } else {
        // Fully uploaded and waiting for server to finish processing, so set progress bar to "indeterminite"
        var progressOpts = {};
      }
    }

    return (
      <main className="page">
        <SubPageLogo />
        <h1>Publish Content</h1>
        <section>
          <h4>LBRY name</h4>
          <div className="help">What LBRY name would you like to claim for this file?</div>
          lbry://<input type="text" ref="name" onChange={this.handleNameChange} />
          {
            (!this.state.name ? '' :
              (this.state.nameResolved ? <em> This name is currently claimed for <strong>{lbry.formatCredits(this.state.claimValue)}</strong> credits</em>
                                       : <em> This name is available</em>))
          }
        </section>

        <section>
          <h4>Choose file</h4>
          <form>
            <input name="file" type="file" onChange={this.handleFileChange} />
            { !this.state.fileInfo ? '' :
                (!this.state.tempFileReady ? <div>
                                               <progress {...progressOpts}></progress>
                                               {!this.state.uploaded ? <span> Importing file into LBRY...</span> : <span> Processing file...</span>}
                                             </div>
                                           : <div>File ready for publishing!</div>) }
          </form>
        </section>

        <section>
          <h4>Bid amount</h4>
          <section className="help">How much would you like to bid for this name?
          { !this.state.nameResolved ? <span> Since this name is not currently resolved, you may bid as low as you want, but higher bids help prevent others from claiming your name.</span>
                                     : <span> You must bid over <strong>{lbry.formatCredits(this.state.claimValue)}</strong> credits to claim this name.</span> }
          </section>
          Credits <input style={publishNumberInputStyle} type="text" onChange={this.handleBidChange} value={this.state.bid} placeholder={this.state.nameResolved ? lbry.formatCredits(this.state.claimValue + 10) : 100} />
          {this.state.bid && isNaN(this.state.bid) ? <span className="warning"> Must be a number</span> : ''}
        </section>

        <section>
          <h4>Fee</h4>
          <section className="help">How much would you like to charge for this file? </section>
          <label style={settingsRadioOptionStyles}>
            <input type="radio" onChange={ () => { this.handleFeePrefChange(false) } } checked={!this.state.isFee} /> No fee
          </label>
          <label style={settingsRadioOptionStyles}>
            <input type="radio" onChange={ () => { this.handleFeePrefChange(true) } } checked={this.state.isFee} /> { !this.state.isFee ? 'Choose fee...' : 'Fee (in LBRY credits) ' }
            <input className={ this.state.isFee ? '' : 'hidden '} onChange={this.handleFeeChange} placeholder="5.5" style={publishNumberInputStyle} />
            {this.state.fee && isNaN(this.state.fee) ? <span className="warning"> Must be a number</span> : ''}
          </label>
        </section>


        <section>
          <h4>Your content</h4>

          <section><label for="title" style={publishFieldLabelStyle}>Title</label> <input ref="meta_title" name="title" placeholder="My Show, Episode 1" style={publishFieldStyle} /></section>
          <section><label for="author" style={publishFieldLabelStyle}>Author</label> <input ref="meta_author" name="author" placeholder="My Company, Inc." style={publishFieldStyle} /></section>
          <section><label for="license" style={publishFieldLabelStyle}>License info</label> <input ref="meta_license" name="license" placeholder={'Copyright My Company, Inc. ' + (new Date().getFullYear()) + '.'} style={publishFieldStyle} /></section>
          <section>
            <label for="language" style={publishFieldLabelStyle}>Language</label> <select ref="meta_language" name="language">
               <option value="en" selected>English</option>
               <option value="zh">Chinese</option>
               <option value="fr">French</option>
               <option value="de">German</option>
               <option value="jp">Japanese</option>
               <option value="ru">Russian</option>
               <option value="es">Spanish</option>
            </select>
          </section>

          <section>
            <label for="description" style={publishFieldLabelStyle}>Description</label> <textarea ref="meta_description" name="description" placeholder="Description of your content" style={publishFieldStyle}></textarea>
          </section>
        </section>

        <h4>Additional content information (optional)</h4>

        <section><label for="meta_thumbnail" style={publishFieldLabelStyle}>Thumbnail URL</label> <input ref="meta_thumbnail" name="thumbnail" placeholder="http://mycompany.com/images/ep_1.jpg" style={publishFieldStyle} /></section>

        <section>
        <Link button="primary" label="Publish" onClick={this.publish} disabled={!this.readyToPublish() || this.state.submitting} />
        </section>
        <section>
          <Link href="/" label="<< Return"/>
        </section>
       </main>
    );
  }
});