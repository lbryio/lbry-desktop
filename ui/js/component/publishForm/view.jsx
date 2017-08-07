import React from "react";
import lbry from "lbry";
import lbryuri from "lbryuri";
import FormField from "component/formField";
import { FormRow } from "component/form.js";
import Link from "component/link";
import FormFieldPrice from "component/formFieldPrice";
import Modal from "component/modal";
import { BusyMessage } from "component/common";
import ChannelSection from "./internal/channelSection";

class PublishForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this._requiredFields = ["name", "bid", "meta_title", "tosAgree"];

    this._defaultCopyrightNotice = "All rights reserved.";

    this.state = {
      rawName: "",
      name: "",
      bid: 10,
      hasFile: false,
      feeAmount: "",
      feeCurrency: "LBC",
      channel: "anonymous",
      newChannelName: "@",
      newChannelBid: 10,
      meta_title: "",
      meta_thumbnail: "",
      meta_description: "",
      meta_language: "en",
      meta_nsfw: "0",
      licenseType: "",
      copyrightNotice: this._defaultCopyrightNotice,
      otherLicenseDescription: "",
      otherLicenseUrl: "",
      tosAgree: false,
      prefillDone: false,
      uploadProgress: 0.0,
      uploaded: false,
      errorMessage: null,
      submitting: false,
      creatingChannel: false,
      modal: null,
      isFee: false,
      customUrl: false,
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

    let metadata = {};

    for (let metaField of ["title", "description", "thumbnail", "language"]) {
      const value = this.state["meta_" + metaField];
      if (value) {
        metadata[metaField] = value;
      }
    }

    metadata.license = this.getLicense();
    metadata.licenseUrl = this.getLicenseUrl();
    metadata.nsfw = !!parseInt(this.state.meta_nsfw);

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

    if (this.state.isFee && parseFloat(this.state.feeAmount) > 0) {
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

    return myClaimInfo.amount >= claim.amount;
  }

  myClaimInfo() {
    const { name } = this.state;

    return Object.values(this.props.myClaims).find(
      claim => claim.name === name
    );
  }

  handleNameChange(event) {
    var rawName = event.target.value;
    this.setState({
      customUrl: Boolean(rawName.length),
    });

    this.nameChanged(rawName);
  }

  nameChanged(rawName) {
    if (!rawName) {
      this.setState({
        rawName: "",
        name: "",
        uri: "",
        prefillDone: false,
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
      prefillDone: false,
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

  handlePrefillClicked() {
    const claimInfo = this.myClaimInfo();
    const {
      license,
      licenseUrl,
      title,
      thumbnail,
      description,
      language,
      nsfw,
    } = claimInfo.value.stream.metadata;

    let newState = {
      meta_title: title,
      meta_thumbnail: thumbnail,
      meta_description: description,
      meta_language: language,
      meta_nsfw: nsfw,
      prefillDone: true,
      bid: claimInfo.amount,
    };

    if (license == this._defaultCopyrightNotice) {
      newState.licenseType = "copyright";
      newState.copyrightNotice = this._defaultCopyrightNotice;
    } else {
      // If the license URL or description matches one of the drop-down options, use that
      let licenseType = "other"; // Will be overridden if we find a match
      for (let option of this._meta_license.getOptions()) {
        if (
          option.getAttribute("data-url") === licenseUrl ||
          option.text === license
        ) {
          licenseType = option.value;
        }
      }

      if (licenseType == "other") {
        newState.otherLicenseDescription = license;
        newState.otherLicenseUrl = licenseUrl;
      }
      newState.licenseType = licenseType;
    }

    this.setState(newState);
  }

  handleBidChange(event) {
    this.setState({
      bid: event.target.value,
    });
  }

  handleFeeChange(newValue) {
    this.state.feeAmount = newValue.amount;
    this.state.feeCurrency = newValue.currency;
  }

  handleFeePrefChange(feeEnabled) {
    this.setState({
      isFee: feeEnabled,
      feeAmount: this.state.feeAmount == "" ? "5.00" : this.state.feeAmount,
    });
  }

  handleMetadataChange(event) {
    /**
     * This function is used for all metadata inputs that store the final value directly into state.
     * The only exceptions are inputs related to license description and license URL, which require
     * more complex logic and the final value is determined at submit time.
     */
    this.setState({
      ["meta_" + event.target.name]: event.target.value,
    });
  }

  handleDescriptionChanged(text) {
    this.setState({
      meta_description: text,
    });
  }

  handleLicenseTypeChange(event) {
    this.setState({
      licenseType: event.target.value,
    });
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
      tosAgree: event.target.checked,
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

  getLicense() {
    switch (this.state.licenseType) {
      case "copyright":
        return this.state.copyrightNotice;
      case "other":
        return this.state.otherLicenseDescription;
      default:
        return this._meta_license.getSelectedElement().text;
    }
  }

  getLicenseUrl() {
    switch (this.state.licenseType) {
      case "copyright":
        return "";
      case "other":
        return this.state.otherLicenseUrl;
      default:
        return this._meta_license.getSelectedElement().getAttribute("data-url");
    }
  }

  componentWillMount() {
    this.props.fetchClaimListMine();
    this._updateChannelList();
  }

  onFileChange() {
    if (this.refs.file.getValue()) {
      this.setState({ hasFile: true });
      if (!this.state.customUrl) {
        let fileName = this._getFileName(this.refs.file.getValue());
        this.nameChanged(fileName);
      }
    } else {
      this.setState({ hasFile: false });
    }
  }

  _getFileName(fileName) {
    const path = require("path");
    const extension = path.extname(fileName);

    fileName = path.basename(fileName, extension);
    fileName = fileName.replace(lbryuri.REGEXP_INVALID_URI, "");
    return fileName;
  }

  getNameBidHelpText() {
    if (this.state.prefillDone) {
      return __("Existing claim data was prefilled");
    }

    if (
      this.state.uri &&
      this.props.resolvingUris.indexOf(this.state.uri) !== -1 &&
      this.claim() === undefined
    ) {
      return __("Checking...");
    } else if (!this.state.name) {
      return __("Select a URL for this publish.");
    } else if (!this.claim()) {
      return __("This URL is unused.");
    } else if (this.myClaimExists() && !this.state.prefillDone) {
      return (
        <span>
          {__("You already have a claim with this name.")}{" "}
          <Link
            label={__("Use data from my existing claim")}
            onClick={() => this.handlePrefillClicked()}
          />
        </span>
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
            {!this.state.hasFile && !this.myClaimExists()
              ? null
              : <div>
                  <div className="card__content">
                    <FormRow
                      label={__("Title")}
                      type="text"
                      name="title"
                      value={this.state.meta_title}
                      placeholder="Titular Title"
                      onChange={event => {
                        this.handleMetadataChange(event);
                      }}
                    />
                  </div>
                  <div className="card__content">
                    <FormRow
                      type="text"
                      label={__("Thumbnail URL")}
                      name="thumbnail"
                      value={this.state.meta_thumbnail}
                      placeholder="http://spee.ch/mylogo"
                      onChange={event => {
                        this.handleMetadataChange(event);
                      }}
                    />
                  </div>
                  <div className="card__content">
                    <FormRow
                      label={__("Description")}
                      type="SimpleMDE"
                      ref="meta_description"
                      name="description"
                      value={this.state.meta_description}
                      placeholder={__("Description of your content")}
                      onChange={text => {
                        this.handleDescriptionChanged(text);
                      }}
                    />
                  </div>
                  <div className="card__content">
                    <FormRow
                      label={__("Language")}
                      type="select"
                      value={this.state.meta_language}
                      name="language"
                      onChange={event => {
                        this.handleMetadataChange(event);
                      }}
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
                      value={this.state.meta_nsfw}
                      name="nsfw"
                      onChange={event => {
                        this.handleMetadataChange(event);
                      }}
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
                onChange={() => this.handleFeePrefChange(false)}
                checked={!this.state.isFee}
              />
              <FormField
                type="radio"
                name="isFree"
                label={!this.state.isFee ? __("Choose price...") : __("Price ")}
                onChange={() => {
                  this.handleFeePrefChange(true);
                }}
                checked={this.state.isFee}
              />
              <span className={!this.state.isFee ? "hidden" : ""}>
                {/*min=0.01 caused weird interactions with step (e.g. down from 5 equals 4.91 rather than 4.9) */}
                <FormFieldPrice
                  min="0"
                  step="0.1"
                  defaultValue={{ amount: 5.0, currency: "LBC" }}
                  onChange={val => this.handleFeeChange(val)}
                />
              </span>
              {/*
                 && this.state.feeCurrency.toUpperCase() != "LBC"
               for some reason, react does not trigger a re-render on currency change (despite trigger a state change), so
               the above logic cannot be added to the below check
               */}
              {this.state.isFee
                ? <div className="form-field__helper">
                    {__(
                      "All content fees are charged in LBC. For non-LBC payment methods, the number of credits charged will be adjusted based on the value of LBRY credits at the time of purchase."
                    )}
                  </div>
                : null}
              <FormRow
                label="License"
                type="select"
                value={this.state.licenseType}
                ref={row => {
                  this._meta_license = row;
                }}
                onChange={event => {
                  this.handleLicenseTypeChange(event);
                }}
              >
                <option />
                <option value="publicDomain">{__("Public Domain")}</option>
                <option
                  value="cc-by"
                  data-url="https://creativecommons.org/licenses/by/4.0/legalcode"
                >
                  {__("Creative Commons Attribution 4.0 International")}
                </option>
                <option
                  value="cc-by-sa"
                  data-url="https://creativecommons.org/licenses/by-sa/4.0/legalcode"
                >
                  {__(
                    "Creative Commons Attribution-ShareAlike 4.0 International"
                  )}
                </option>
                <option
                  value="cc-by-nd"
                  data-url="https://creativecommons.org/licenses/by-nd/4.0/legalcode"
                >
                  {__(
                    "Creative Commons Attribution-NoDerivatives 4.0 International"
                  )}
                </option>
                <option
                  value="cc-by-nc"
                  data-url="https://creativecommons.org/licenses/by-nc/4.0/legalcode"
                >
                  {__(
                    "Creative Commons Attribution-NonCommercial 4.0 International"
                  )}
                </option>
                <option
                  value="cc-by-nc-sa"
                  data-url="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode"
                >
                  {__(
                    "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International"
                  )}
                </option>
                <option
                  value="cc-by-nc-nd"
                  data-url="https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode"
                >
                  {__(
                    "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International"
                  )}
                </option>
                <option value="copyright">
                  {__("Copyrighted...")}
                </option>
                <option value="other">
                  {__("Other...")}
                </option>
              </FormRow>

              {this.state.licenseType == "copyright"
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

              {this.state.licenseType == "other"
                ? <FormRow
                    label={__("License description")}
                    type="text"
                    name="other-license-description"
                    value={this.state.otherLicenseDescription}
                    onChange={event => {
                      this.handleOtherLicenseDescriptionChange(event);
                    }}
                  />
                : null}

              {this.state.licenseType == "other"
                ? <FormRow
                    label={__("License URL")}
                    type="text"
                    name="other-license-url"
                    value={this.state.otherLicenseUrl}
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
              <h4>{__("Content URL")}</h4>
              <div className="card__subtitle">
                {__(
                  "This is the exact address where people find your content (ex. lbry://myvideo)."
                )}
                {" "}
                <Link
                  label={__("Learn more")}
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
                    />
                  </span>
                }
                type="checkbox"
                checked={this.state.tosAgree}
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
              disabled={
                this.state.submitting ||
                (this.state.uri &&
                  this.props.resolvingUris.indexOf(this.state.uri) !== -1) ||
                (this.claim() &&
                  !this.topClaimIsMine() &&
                  this.state.bid <= this.topClaimValue())
              }
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

export default PublishForm;
