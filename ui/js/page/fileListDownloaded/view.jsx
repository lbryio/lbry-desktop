import React from "react";
import Link from "component/link";
import { FileTile } from "component/fileTile";
import { BusyMessage, Thumbnail } from "component/common.js";
import FileList from "component/fileList";
import SubHeader from "component/subHeader";

class FileListDownloaded extends React.PureComponent {
  componentWillMount() {
    if (!this.props.isFetchingClaims) this.props.fetchClaims();
    if (!this.props.isFetching) this.props.fetchFileInfosDownloaded();
  }

  componentWillUnmount() {
    this.props.cancelResolvingUris();
  }

  render() {
    const { fileInfos, isFetching, navigate } = this.props;

    let content;
    if (fileInfos && fileInfos.length > 0) {
      content = <FileList fileInfos={fileInfos} fetching={isFetching} />;
    } else {
      if (isFetching) {
        content = <BusyMessage message={__("Loading")} />;
      } else {
        content = (
          <span>
            {__("You haven't downloaded anything from LBRY yet. Go")}{" "}
            <Link
              onClick={() => navigate("/discover")}
              label={__("search for your first download")}
            />!
          </span>
        );
      }
    }

    return (
      <main className="main--single-column">
        <SubHeader />
        {content}
      </main>
    );
  }
}

export default FileListDownloaded;
