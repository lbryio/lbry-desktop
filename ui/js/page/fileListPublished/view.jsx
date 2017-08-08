import React from "react";
import Link from "component/link";
import FileTile from "component/fileTile";
import { BusyMessage, Thumbnail } from "component/common.js";
import FileList from "component/fileList";
import SubHeader from "component/subHeader";

class FileListPublished extends React.PureComponent {
  componentWillMount() {
    if (!this.props.isFetching) this.props.fetchClaims();
  }

  componentDidUpdate() {
    // if (this.props.claims.length > 0) this.props.fetchClaims();
  }

  componentWillUnmount() {
    this.props.cancelResolvingUris();
  }

  render() {
    const { claims, isFetching, navigate } = this.props;

    let content;

    if (claims && claims.length > 0) {
      content = (
        <FileList
          fileInfos={claims}
          fetching={isFetching}
          fileTileShowEmpty={FileTile.SHOW_EMPTY_PENDING}
        />
      );
    } else {
      if (isFetching) {
        content = <BusyMessage message={__("Loading")} />;
      } else {
        content = (
          <span>
            {__(
              "It looks like you haven't published anything to LBRY yet. Go"
            )}{" "}
            <Link
              onClick={() => navigate("/publish")}
              label={__("share your beautiful cats with the world")}
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

export default FileListPublished;
