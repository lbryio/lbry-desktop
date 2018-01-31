import React from "react";
import lbry from "lbry";
import lbryuri from "lbryuri";
import FormField from "component/formField";
import { Form, FormRow, Submit } from "component/form.js";
import Link from "component/link";
import Modal from "modal/modal";
import * as modals from "constants/modal_types";

class SpeechUpload extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      thumbnailUploadPath: "",
      thumbnailUploadStatus: "upload",
      thumbnailNFSW: false,
    };
  }

  // handleThumbNSFWChange(event) {
  //   this.setState({
  //     thumbnailNFSW: event.target.checked,
  //   });
  // }

  handleThumbnailStatusChange(status) {
    console.log("status change:", status);
    this.setState({
      thumbnailUploadStatus: status,
    });
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.uploadStatus === "error") {
  //     alert("UPLOAD FAILED, PLEASE TRY AGAIN.");
  //     // this.props.resetUpload();
  //   }

  //   // if (nextProps.uploadStatus === "upload") {
  //   //   this.setState({
  //   //     thumbnailUploadStatus: "upload",
  //   //   });
  //   // }

  //   // if (nextProps.uploadStatus === "manual") {
  //   //   this.setState({
  //   //     thumbnailUploadStatus: "manual",
  //   //   });
  //   // }

  //   // if (nextProps.uploadStatus === "sending") {
  //   //   this.setState({
  //   //     thumbnailUploadStatus: "sending",
  //   //   });
  //   // }

  //   if (nextProps.uploadStatus === "complete") {
  //     this.setState({
  //       thumbnailUploadStatus: "complete",
  //       meta_thumbnail: nextProps.uploadUrl,
  //     });
  //   }
  // }

  closeModal() {
    this.setState({
      modal: null,
    });
  }

  upload(path) {
    this.closeModal();
    this.setState({
      thumbnailUploadStatus: "sending",
    });
    this.props.upload(path);
  }

  render() {
    const { openModal } = this.props;

    return (
      <div>
        <div
          className="card__content"
          style={
            this.state.thumbnailUploadStatus !== "manual"
              ? null
              : { display: "none" }
          }
        >
          <FormRow
            name="thumbnail"
            label={__("Upload Thumbnail")}
            ref="thumbnail"
            type="file"
            onChange={event => {
              openModal(modals.CONFIRM_SPEECH_UPLOAD, {
                path: event.target.value,
              });
            }}
          />
        </div>

        <div
          className="card__content"
          style={
            this.state.thumbnailUploadStatus === "manual"
              ? null
              : { display: "none" }
          }
        >
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

        <div
          className="card__content"
          style={
            this.state.thumbnailUploadStatus === "upload"
              ? null
              : { display: "none" }
          }
        >
          <a onClick={() => this.handleThumbnailStatusChange("manual")}>
            Enter Thumbnail URL
          </a>
        </div>

        <div
          className="card__content"
          style={
            this.state.thumbnailUploadStatus === "manual"
              ? null
              : { display: "none" }
          }
        >
          <a onClick={() => this.handleThumbnailStatusChange("upload")}>
            Upload Thumbnail
          </a>
        </div>

        <div
          className="card__content"
          style={
            this.state.thumbnailUploadStatus === "sending"
              ? null
              : { display: "none" }
          }
        >
          Uploading thumbnail...
        </div>

        <div
          className="card__content"
          style={
            this.state.thumbnailUploadStatus === "complete"
              ? null
              : { display: "none" }
          }
        >
          Complete: {this.state.meta_thumbnail}
        </div>
      </div>
    );
  }
}

export default SpeechUpload;
