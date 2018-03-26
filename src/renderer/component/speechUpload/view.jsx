import React from "react";
import lbry from "lbry";
import lbryuri from 'lbryURI';
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
    }
  }

  render() {
    const { openModal, apiStatus, uploadStatus } = this.props;

    return (
      <div>
        {!apiStatus || uploadStatus === status.MANUAL ? (
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
            {apiStatus && (
              <div className="card__content">
                <a
                  className="link"
                  onClick={() => this.props.resetUpload()}
                >
                  Upload Thumbnail
                </a>
              </div>
            )}
          </div>
        ) : (
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

        {apiStatus && uploadStatus === status.UPLOAD && (
          <div className="card__content">
            <a
              className="link"
              onClick={() => this.props.setManualStatus()}
            >
              Enter Thumbnail URL
            </a>
          </div>
        )}

        {apiStatus && uploadStatus === status.SENDING && (
          <div className="card__content">Uploading thumbnail...</div>
        )}

        {apiStatus && uploadStatus === status.COMPLETE && (
          <div className="card__content">Complete: {this.props.uploadUrl}</div>
        )}
      </div>
    );
  }
}

export default SpeechUpload;
