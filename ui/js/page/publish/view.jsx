import React from "react";
import lbry from "lbry";
import lbryuri from "lbryuri";
import { FormField, FormRow } from "component/form.js";
import Link from "component/link";
import rewards from "rewards";
import Modal from "component/modal";
import { BusyMessage } from "component/common";

class PublishPage extends React.PureComponent {
  constructor(props) {
    super(props);

    this._requiredFields = ["meta_title", "name", "bid", "tos_agree"];

    this.state = {
      rawName: "",
      name: "",
      bid: 10,
      hasFile: false,
      feeAmount: "",
      feeCurrency: "USD",
      channel: "anonymous",
      newChannelName: "@",
      newChannelBid: 10,
      myClaimValue: 0.0,
      myClaimMetadata: null,
      copyrightNotice: "",
      otherLicenseDescription: "",
      otherLicenseUrl: "",
      uploadProgress: 0.0,
      uploaded: false,
      errorMessage: null,
      submitting: false,
      creatingChannel: false,
      modal: null,
    };
  }

  _updateChannelList(channel) {
    const { fetchingChannels, fetchChannelListMine } = this.props;

    if (!fetchingChannels) fetchChannelListMine();
  }

  handleSubmit(event) {
    if (typeof event !== "undefined") {
      event.preventDefault();
    }

    this.setState({
      submitting: true,
    });

    let checkFields = this._requiredFields;
    if (!this.myClaimExists()) {
      checkFields.unshift("file");
    }

    let missingFieldFound = false;
    for (let fieldName of checkFields) {
      const field = this.refs[fieldName];
      if (field) {
        if (field.getValue() === "" || field.getValue() === false) {
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
      if (this.refs.file.getValue() !== "") {
        delete metadata.sources;
      }
    } else {
      var metadata = {};
    }

    for (let metaField of [
      "title",
      "description",
      "thumbnail",
      "license",
      "license_url",
      "language",
    ]) {
      var value = this.refs["meta_" + metaField].getValue();
      if (value !== "") {
        metadata[metaField] = value;
      }
    }

    metadata.nsfw = parseInt(this.refs.meta_nsfw.getValue()) === 1;

    const licenseUrl = this.refs.meta_license_url.getValue();
    if (licenseUrl) {
      metadata.license_url = licenseUrl;
    }

    var doPublish = () => {
      var publishArgs = {
        name: this.state.name,
        bid: parseFloat(this.state.bid),
        metadata: metadata,
        ...(this.state.channel != "new" && this.state.channel != "anonymous"
          ? { channel_name: this.state.channel }
          : {}),
      };

      if (this.refs.file.getValue() !== "") {
        publishArgs.file_path = this.refs.file.getValue();
      }

      const success = claim => {};
      const failure = error => this.handlePublishError(error);

      this.handlePublishStarted();
      this.props.publish(publishArgs).then(success, failure);
    };

    if (this.state.isFee) {
      lbry.wallet_unused_address().then(address => {
        metadata.fee = {
          currency: this.state.feeCurrency,
          amount: parseFloat(this.state.feeAmount),
          address: address,
        };

        doPublish();
      });
    } else {
      doPublish();
    }
  }

  handlePublishStarted() {
    this.setState({
      modal: "publishStarted",
    });
  }

  handlePublishStartedConfirmed() {
    this.props.navigate("/published");
  }

  handlePublishError(error) {
    this.setState({
      submitting: false,
      modal: "error",
      errorMessage: error.message,
    });
  }

  claim() {
    const { claimsByUri } = this.props;
    const { uri } = this.state;

    return claimsByUri[uri];
  }

  topClaimValue() {
    if (!this.claim()) return null;

    return parseFloat(this.claim().amount);
  }

  myClaimExists() {
    const { myClaims } = this.props;
    const { name } = this.state;

    if (!name) return false;

    return !!myClaims.find(claim => claim.name === name);
  }

  topClaimIsMine() {
    const myClaimInfo = this.myClaimInfo();
    const { claimsByUri } = this.props;
    const { uri } = this.state;

    if (!uri) return null;

    const claim = claimsByUri[uri];

    if (!claim) return true;
    if (!myClaimInfo) return false;

    return myClaimInfo.amount >= claimInfo.amount;
  }

  myClaimInfo() {
    return Object.values(this.props.myClaims).find(
      claim => claim.name === name
    );
  }

  handleNameChange(event) {
    var rawName = event.target.value;

    this.nameChanged(rawName);
  }

  nameChanged(rawName) {
    if (!rawName) {
      this.setState({
        rawName: "",
        name: "",
        uri: "",
      });

      return;
    }

    if (!lbryuri.isValidName(rawName, false)) {
      this.refs.name.showError(
        __("LBRY names must contain only letters, numbers and dashes.")
      );
      return;
    }

    let channel = "";
    if (this.state.channel !== "anonymous") channel = this.state.channel;

    const name = rawName.toLowerCase();
    const uri = lbryuri.build({ contentName: name, channelName: channel });
    this.setState({
      rawName: rawName,
      name: name,
      uri,
    });

    if (this.resolveUriTimeout) {
      clearTimeout(this.resolveUriTimeout);
      this.resolveUriTimeout = undefined;
    }
    const resolve = () => this.props.resolveUri(uri);

    this.resolveUriTimeout = setTimeout(resolve.bind(this), 500, {
      once: true,
    });
  }

  handleBidChange(event) {
    this.setState({
      bid: event.target.value,
    });
  }

  handleFeeAmountChange(event) {
    this.setState({
      feeAmount: event.target.value,
    });
  }

  handleFeeCurrencyChange(event) {
    this.setState({
      feeCurrency: event.target.value,
    });
  }

  handleFeePrefChange(feeEnabled) {
    this.setState({
      isFee: feeEnabled,
    });
  }

  handleLicenseChange(event) {
    var licenseType = event.target.options[
      event.target.selectedIndex
    ].getAttribute("data-license-type");
    var newState = {
      copyrightChosen: licenseType == "copyright",
      otherLicenseChosen: licenseType == "other",
    };

    if (licenseType == "copyright") {
      newState.copyrightNotice = __("All rights reserved.");
    }

    this.setState(newState);
  }

  handleCopyrightNoticeChange(event) {
    this.setState({
      copyrightNotice: event.target.value,
    });
  }

  handleOtherLicenseDescriptionChange(event) {
    this.setState({
      otherLicenseDescription: event.target.value,
    });
  }

  handleOtherLicenseUrlChange(event) {
    this.setState({
      otherLicenseUrl: event.target.value,
    });
  }

  handleChannelChange(channelName) {
    this.setState({
      channel: channelName,
    });
    const nameChanged = () => this.nameChanged(this.state.rawName);
    setTimeout(nameChanged.bind(this), 500, { once: true });
  }

  handleTOSChange(event) {
    this.setState({
      TOSAgreed: event.target.checked,
    });
  }

  handleCreateChannelClick(event) {
    if (this.state.newChannelName.length < 5) {
      this.refs.newChannelName.showError(
        __("LBRY channel names must be at least 4 characters in length.")
      );
      return;
    }

    this.setState({
      creatingChannel: true,
    });

    const newChannelName = this.state.newChannelName;
    lbry
      .channel_new({
        channel_name: newChannelName,
        amount: parseFloat(this.state.newChannelBid),
      })
      .then(
        () => {
          setTimeout(() => {
            this.setState({
              creatingChannel: false,
            });

            this._updateChannelList(newChannelName);
          }, 10000);
        },
        error => {
          // TODO: better error handling
          this.refs.newChannelName.showError(
            __("Unable to create channel due to an internal error.")
          );
          this.setState({
            creatingChannel: false,
          });
        }
      );
  }

  getLicenseUrl() {
    if (!this.refs.meta_license) {
      return "";
    } else if (this.state.otherLicenseChosen) {
      return this.state.otherLicenseUrl;
    } else {
      return (
        this.refs.meta_license.getSelectedElement().getAttribute("data-url") ||
        ""
      );
    }
  }

  componentWillMount() {
    this.props.fetchClaimListMine();
    this._updateChannelList();
  }

  onFileChange() {
    if (this.refs.file.getValue()) {
      this.setState({ hasFile: true });
    } else {
      this.setState({ hasFile: false });
    }
  }

  getNameBidHelpText() {
    if (
      this.state.uri &&
      this.props.resolvingUris.indexOf(this.state.uri) !== -1 &&
      this.claim() === undefined
    ) {
      return <BusyMessage />;
    } else if (!this.state.name) {
      return __("Select a URL for this publish.");
    } else if (!this.claim()) {
      return __("This URL is unused.");
    } else if (this.myClaimExists() && !this.state.prefillDone) {
      return (
        <Notice>
          {__("You already have a claim with this name.")}{" "}
          <Link
            label={__("Use data from my existing claim")}
            onClick={() => this.handlePrefillClicked()}
          />
        </Notice>
      );
    } else if (this.claim()) {
      if (this.topClaimValue() === 1) {
        return (
          <span>
            {__(
              'A deposit of at least one credit is required to win "%s". However, you can still get a permanent URL for any amount.',
              this.state.name
            )}
          </span>
        );
      } else {
        return (
          <span>
            {__(
              'A deposit of at least "%s" credits is required to win "%s". However, you can still get a permanent URL for any amount.',
              this.topClaimValue(),
              this.state.name
            )}
          </span>
        );
      }
    } else {
      return "";
    }
  }

  closeModal() {
    this.setState({
      modal: null,
    });
  }

  render() {
    const lbcInputHelp = __(
      "This LBC remains yours and the deposit can be undone at any time."
    );

    return (
      <main className="main--single-column">
        <form
          onSubmit={event => {
            this.handleSubmit(event);
          }}
        >
          <section className="card">
            <div className="card__title-primary">
              <h4>{__("Content")}</h4>
              <div className="card__subtitle">
                {__("What are you publishing?")}
              </div>
            </div>
            <div className="card__content">
              <FormRow
                name="file"
                label="File"
                ref="file"
                type="file"
                onChange={event => {
                  this.onFileChange(event);
                }}
                helper={
                  this.myClaimExists()
                    ? __(
                        "If you don't choose a file, the file from your existing claim will be used."
                      )
                    : null
                }
              />
            </div>
            {!this.state.hasFile
              ? ""
              : <div>
                  <div className="card__content">
                    <FormRow
                      label={__("Title")}
                      type="text"
                      ref="meta_title"
                      name="title"
                      placeholder={__("Title")}
                    />
                  </div>
                  <div className="card__content">
                    <FormRow
                      type="text"
                      label={__("Thumbnail URL")}
                      ref="meta_thumbnail"
                      name="thumbnail"
                      placeholder="http://spee.ch/mylogo"
                    />
                  </div>
                  <div className="card__content">
                    <FormRow
                      label={__("Description")}
                      type="textarea"
                      ref="meta_description"
                      name="description"
                      placeholder={__("Description of your content")}
                    />
                  </div>
                  <div className="card__content">
                    <FormRow
                      label={__("Language")}
                      type="select"
                      defaultValue="en"
                      ref="meta_language"
                      name="language"
                    >
                      <option value="en">{__("English")}</option>
                      <option value="zh">{__("Chinese")}</option>
                      <option value="fr">{__("French")}</option>
                      <option value="de">{__("German")}</option>
                      <option value="jp">{__("Japanese")}</option>
                      <option value="ru">{__("Russian")}</option>
                      <option value="es">{__("Spanish")}</option>
                    </FormRow>
                  </div>
                  <div className="card__content">
                    <FormRow
                      type="select"
                      label={__("Maturity")}
                      defaultValue="en"
                      ref="meta_nsfw"
                      name="nsfw"
                    >
                      {/* <option value=""></option> */}
                      <option value="0">{__("All Ages")}</option>
                      <option value="1">{__("Adults Only")}</option>
                    </FormRow>
                  </div>
                </div>}
          </section>

          <section className="card">
            <div className="card__title-primary">
              <h4>{__("Access")}</h4>
              <div className="card__subtitle">
                {__("How much does this content cost?")}
              </div>
            </div>
            <div className="card__content">
              <div className="form-row__label-row">
                <label className="form-row__label">{__("Price")}</label>
              </div>
              <FormRow
                label={__("Free")}
                type="radio"
                name="isFree"
                value="1"
                onChange={() => {
                  this.handleFeePrefChange(false);
                }}
                defaultChecked={!this.state.isFee}
              />
              <FormField
                type="radio"
                name="isFree"
                label={!this.state.isFee ? __("Choose price...") : __("Price ")}
                onChange={() => {
                  this.handleFeePrefChange(true);
                }}
                defaultChecked={this.state.isFee}
              />
              <span className={!this.state.isFee ? "hidden" : ""}>
                <FormField
                  type="number"
                  className="form-field__input--inline"
                  step="0.01"
                  placeholder="1.00"
                  min="0.01"
                  onChange={event => this.handleFeeAmountChange(event)}
                />
                {" "}
                <FormField
                  type="select"
                  onChange={event => {
                    this.handleFeeCurrencyChange(event);
                  }}
                >
                  <option value="USD">{__("US Dollars")}</option>
                  <option value="LBC">{__("LBRY credits")}</option>
                </FormField>
              </span>
              {this.state.isFee
                ? <div className="form-field__helper">
                    {__(
                      "If you choose to price this content in dollars, the number of credits charged will be adjusted based on the value of LBRY credits at the time of purchase."
                    )}
                  </div>
                : ""}
              <FormRow
                label="License"
                type="select"
                ref="meta_license"
                name="license"
                onChange={event => {
                  this.handleLicenseChange(event);
                }}
              >
                <option />
                <option>{__("Public Domain")}</option>
                <option data-url="https://creativecommons.org/licenses/by/4.0/legalcode">
                  {__("Creative Commons Attribution 4.0 International")}
                </option>
                <option data-url="https://creativecommons.org/licenses/by-sa/4.0/legalcode">
                  {__(
                    "Creative Commons Attribution-ShareAlike 4.0 International"
                  )}
                </option>
                <option data-url="https://creativecommons.org/licenses/by-nd/4.0/legalcode">
                  {__(
                    "Creative Commons Attribution-NoDerivatives 4.0 International"
                  )}
                </option>
                <option data-url="https://creativecommons.org/licenses/by-nc/4.0/legalcode">
                  {__(
                    "Creative Commons Attribution-NonCommercial 4.0 International"
                  )}
                </option>
                <option data-url="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode">
                  {__(
                    "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International"
                  )}
                </option>
                <option data-url="https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode">
                  {__(
                    "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International"
                  )}
                </option>
                <option
                  data-license-type="copyright"
                  {...(this.state.copyrightChosen
                    ? { value: this.state.copyrightNotice }
                    : {})}
                >
                  {__("Copyrighted...")}
                </option>
                <option
                  data-license-type="other"
                  {...(this.state.otherLicenseChosen
                    ? { value: this.state.otherLicenseDescription }
                    : {})}
                >
                  {__("Other...")}
                </option>
              </FormRow>
              <FormField
                type="hidden"
                ref="meta_license_url"
                name="license_url"
                value={this.getLicenseUrl()}
              />
              {this.state.copyrightChosen
                ? <FormRow
                    label={__("Copyright notice")}
                    type="text"
                    name="copyright-notice"
                    value={this.state.copyrightNotice}
                    onChange={event => {
                      this.handleCopyrightNoticeChange(event);
                    }}
                  />
                : null}
              {this.state.otherLicenseChosen
                ? <FormRow
                    label={__("License description")}
                    type="text"
                    name="other-license-description"
                    onChange={event => {
                      this.handleOtherLicenseDescriptionChange();
                    }}
                  />
                : null}
              {this.state.otherLicenseChosen
                ? <FormRow
                    label={__("License URL")}
                    type="text"
                    name="other-license-url"
                    onChange={event => {
                      this.handleOtherLicenseUrlChange(event);
                    }}
                  />
                : null}
            </div>
          </section>

          <ChannelSection
            {...this.props}
            handleChannelChange={this.handleChannelChange.bind(this)}
            channel={this.state.channel}
          />

          <section className="card">
            <div className="card__title-primary">
              <h4>{__("Address")}</h4>
              <div className="card__subtitle">
                {__("Where should this content permanently reside?")}
                {" "}
                <Link
                  label={__("Read more")}
                  href="https://lbry.io/faq/naming"
                />.
              </div>
            </div>
            <div className="card__content">
              <FormRow
                prefix={`lbry://${this.state.channel === "anonymous"
                  ? ""
                  : `${this.state.channel}/`}`}
                type="text"
                ref="name"
                placeholder="myname"
                value={this.state.rawName}
                onChange={event => {
                  this.handleNameChange(event);
                }}
                helper={this.getNameBidHelpText()}
              />
            </div>
            {this.state.rawName
              ? <div className="card__content">
                  <FormRow
                    ref="bid"
                    type="number"
                    step="0.01"
                    label={__("Deposit")}
                    postfix="LBC"
                    onChange={event => {
                      this.handleBidChange(event);
                    }}
                    value={this.state.bid}
                    placeholder={this.claim() ? this.topClaimValue() + 10 : 100}
                    helper={lbcInputHelp}
                  />
                </div>
              : ""}
          </section>

          <section className="card">
            <div className="card__title-primary">
              <h4>{__("Terms of Service")}</h4>
            </div>
            <div className="card__content">
              <FormRow
                label={
                  <span>
                    {__("I agree to the")}
                    {" "}
                    <Link
                      href="https://www.lbry.io/termsofservice"
                      label={__("LBRY terms of service")}
                      checked={this.state.TOSAgreed}
                    />
                  </span>
                }
                type="checkbox"
                name="tos_agree"
                ref={field => {
                  this.refs.tos_agree = field;
                }}
                onChange={event => {
                  this.handleTOSChange(event);
                }}
              />
            </div>
          </section>

          <div className="card-series-submit">
            <Link
              button="primary"
              label={
                !this.state.submitting ? __("Publish") : __("Publishing...")
              }
              onClick={event => {
                this.handleSubmit(event);
              }}
              disabled={this.state.submitting}
            />
            <Link
              button="cancel"
              onClick={this.props.back}
              label={__("Cancel")}
            />
            <input type="submit" className="hidden" />
          </div>
        </form>

        <Modal
          isOpen={this.state.modal == "publishStarted"}
          contentLabel={__("File published")}
          onConfirmed={event => {
            this.handlePublishStartedConfirmed(event);
          }}
        >
          <p>
            {__("Your file has been published to LBRY at the address")}
            {" "}<code>{this.state.uri}</code>!
          </p>
          <p>
            {__(
              'The file will take a few minutes to appear for other LBRY users. Until then it will be listed as "pending" under your published files.'
            )}
          </p>
        </Modal>
        <Modal
          isOpen={this.state.modal == "error"}
          contentLabel={__("Error publishing file")}
          onConfirmed={event => {
            this.closeModal(event);
          }}
        >
          {__(
            "The following error occurred when attempting to publish your file"
          )}: {this.state.errorMessage}
        </Modal>
      </main>
    );
  }
}

class ChannelSection extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      newChannelName: "@",
      newChannelBid: 10,
      addingChannel: false,
    };
  }

  handleChannelChange(event) {
    const channel = event.target.value;
    if (channel === "new") this.setState({ addingChannel: true });
    else {
      this.setState({ addingChannel: false });
      this.props.handleChannelChange(event.target.value);
    }
  }

  handleNewChannelNameChange(event) {
    const newChannelName = event.target.value.startsWith("@")
      ? event.target.value
      : "@" + event.target.value;

    if (
      newChannelName.length > 1 &&
      !lbryuri.isValidName(newChannelName.substr(1), false)
    ) {
      this.refs.newChannelName.showError(
        __("LBRY channel names must contain only letters, numbers and dashes.")
      );
      return;
    } else {
      this.refs.newChannelName.clearError();
    }

    this.setState({
      newChannelName,
    });
  }

  handleNewChannelBidChange(event) {
    this.setState({
      newChannelBid: event.target.value,
    });
  }

  handleCreateChannelClick(event) {
    if (this.state.newChannelName.length < 5) {
      this.refs.newChannelName.showError(
        __("LBRY channel names must be at least 4 characters in length.")
      );
      return;
    }

    this.setState({
      creatingChannel: true,
    });

    const newChannelName = this.state.newChannelName;
    const amount = parseFloat(this.state.newChannelBid);
    this.setState({
      creatingChannel: true,
    });
    const success = (() => {
      this.setState({
        creatingChannel: false,
        addingChannel: false,
        channel: newChannelName,
      });
      this.props.handleChannelChange(newChannelName);
    }).bind(this);
    const failure = (err => {
      this.setState({
        creatingChannel: false,
      });
      this.refs.newChannelName.showError(
        __("Unable to create channel due to an internal error.")
      );
    }).bind(this);
    this.props.createChannel(newChannelName, amount).then(success, failure);
  }

  render() {
    const lbcInputHelp = __(
      "This LBC remains yours and the deposit can be undone at any time."
    );

    const { fetchingChannels, channels } = this.props;

    let channelContent = [];
    if (channels.length > 0) {
      channelContent.push(
        <FormRow
          key="channel"
          type="select"
          tabIndex="1"
          onChange={this.handleChannelChange.bind(this)}
          value={this.props.channel}
        >
          <option key="anonymous" value="anonymous">
            {__("Anonymous")}
          </option>
          {this.props.channels.map(({ name }) =>
            <option key={name} value={name}>{name}</option>
          )}
          <option key="new" value="new">
            {__("New identity...")}
          </option>
        </FormRow>
      );
      if (fetchingChannels) {
        channelContent.push(
          <BusyMessage message="Updating channels" key="loading" />
        );
      }
    } else if (fetchingChannels) {
      channelContent.push(
        <BusyMessage message="Loading channels" key="loading" />
      );
    }

    return (
      <section className="card">
        <div className="card__title-primary">
          <h4>{__("Identity")}</h4>
          <div className="card__subtitle">
            {__("Who created this content?")}
          </div>
        </div>
        <div className="card__content">
          {channelContent}
        </div>
        {this.state.addingChannel &&
          <div className="card__content">
            <FormRow
              label={__("Name")}
              type="text"
              onChange={event => {
                this.handleNewChannelNameChange(event);
              }}
              value={this.state.newChannelName}
            />
            <FormRow
              label={__("Deposit")}
              postfix="LBC"
              step="0.1"
              min="0"
              type="number"
              helper={lbcInputHelp}
              ref="newChannelName"
              onChange={this.handleNewChannelBidChange.bind(this)}
              value={this.state.newChannelBid}
            />
            <div className="form-row-submit">
              <Link
                button="primary"
                label={
                  !this.state.creatingChannel
                    ? __("Create identity")
                    : __("Creating identity...")
                }
                onClick={this.handleCreateChannelClick.bind(this)}
                disabled={this.state.creatingChannel}
              />
            </div>
          </div>}
      </section>
    );
  }
}

export default PublishPage;
