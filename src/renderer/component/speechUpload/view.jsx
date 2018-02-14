import React from "react";
import lbry from "lbry";
import lbryuri from "lbryuri";
import FormField from "component/formField";
import { Form, FormRow, Submit } from "component/form.js";
import Link from "component/link";
import Modal from "modal/modal";
import * as modals from "constants/modal_types";
import * as status from "constants/upload";

class SpeechUpload extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      thumbnailUploadPath: "",
    };
  }

  render() {
    const { openModal } = this.props;

    return (
      <div>
        <div
          className="card__content"
          style={
            this.props.uploadStatus !== status.MANUAL
              ? null
              : { display: "none" }
          }
        >
          <FormRow
            name="thumbnail"
            label={__("Upload Thumbnail")}
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
            this.props.uploadStatus === status.MANUAL
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
            this.props.uploadStatus === status.UPLOAD
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
            this.props.uploadStatus === status.MANUAL
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
            this.props.uploadStatus === status.SENDING
              ? null
              : { display: "none" }
          }
        >
          Uploading thumbnail...
        </div>

        <div
          className="card__content"
          style={
            this.props.uploadStatus === status.COMPLETE
              ? null
              : { display: "none" }
          }
        >
          Complete: {this.props.uploadUrl}
        </div>
      </div>
    );
  }
}

export default SpeechUpload;
