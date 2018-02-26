import React from "react";
import lbry from "lbry";
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.uploadStatus === status.ERROR) {
      this.props.alertError("Upload failed. Please try again.");
      this.props.resetUpload();
      // console.log(`this.refs.thumbnail.value = ""`);
    }
  }

  render() {
    const { openModal } = this.props;

    return (
      <div>
        {this.props.uploadStatus === status.MANUAL ? null : (
          <div className="card__content">
            <FormRow
              name="thumbnail"
              ref="thumbnail"
              label={__("Upload Thumbnail")}
              type="file"
              onChange={event => {
                openModal(modals.CONFIRM_SPEECH_UPLOAD, {
                  path: event.target.value,
                });
              }}
            />
          </div>
        )}

        {this.props.uploadStatus !== status.MANUAL ? null : (
          <div>
            <div className="card__content">
              <FormRow
                type="text"
                label={__("Thumbnail URL")}
                name="thumbnail"
                value={this.state.meta_thumbnail}
                placeholder="http://spee.ch/mylogo"
                onChange={event => this.props.setManualUrl(event.target.value)}
              />
            </div>
            <div className="card__content">
              <a onClick={() => this.props.resetUpload()}>Upload Thumbnail</a>
            </div>
          </div>
        )}

        {this.props.uploadStatus !== status.UPLOAD ? null : (
          <div className="card__content">
            <a onClick={() => this.props.setManualStatus()}>
              Enter Thumbnail URL
            </a>
          </div>
        )}

        {this.props.uploadStatus !== status.SENDING ? null : (
          <div className="card__content">Uploading thumbnail...</div>
        )}

        {this.props.uploadStatus !== status.COMPLETE ? null : (
          <div className="card__content">Complete: {this.props.uploadUrl}</div>
        )}
      </div>
    );
  }
}

export default SpeechUpload;
