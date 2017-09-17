import React from "react";
import lbryuri from "lbryuri.js";
import FormField from "component/formField";
import FileTile from "component/fileTile";
import { BusyMessage } from "component/common.js";

class FileList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: "date",
    };

    this._sortFunctions = {
      date: function(fileInfos) {
        return fileInfos.slice().reverse();
      },
      title: function(fileInfos) {
        return fileInfos.slice().sort(function(fileInfo1, fileInfo2) {
          const title1 = fileInfo1.metadata
            ? fileInfo1.metadata.stream.metadata.title.toLowerCase()
            : fileInfo1.name;
          const title2 = fileInfo2.metadata
            ? fileInfo2.metadata.stream.metadata.title.toLowerCase()
            : fileInfo2.name;
          if (title1 < title2) {
            return -1;
          } else if (title1 > title2) {
            return 1;
          } else {
            return 0;
          }
        });
      },
      filename: function(fileInfos) {
        return fileInfos
          .slice()
          .sort(function({ file_name: fileName1 }, { file_name: fileName2 }) {
            const fileName1Lower = fileName1.toLowerCase();
            const fileName2Lower = fileName2.toLowerCase();
            if (fileName1Lower < fileName2Lower) {
              return -1;
            } else if (fileName2Lower > fileName1Lower) {
              return 1;
            } else {
              return 0;
            }
          });
      },
    };
  }

  getChannelSignature(fileInfo) {
    if (fileInfo.value) {
      return fileInfo.value.publisherSignature.certificateId;
    } else {
      return fileInfo.metadata.publisherSignature.certificateId;
    }
  }

  handleSortChanged(event) {
    this.setState({
      sortBy: event.target.value,
    });
  }

  render() {
    const { handleSortChanged, fetching, fileInfos } = this.props;
    const { sortBy } = this.state;
    const content = [];

    this._sortFunctions[sortBy](fileInfos).forEach(fileInfo => {
      let uriParams = {};

      if (fileInfo.channel_name) {
        uriParams.channelName = fileInfo.channel_name;
        uriParams.contentName = fileInfo.name;
        uriParams.claimId = this.getChannelSignature(fileInfo);
      } else {
        uriParams.claimId = fileInfo.claim_id;
        uriParams.name = fileInfo.name;
      }
      const uri = lbryuri.build(uriParams);

      content.push(
        <FileTile
          key={fileInfo.outpoint || fileInfo.claim_id}
          uri={uri}
          hidePrice={true}
          showActions={true}
          showEmpty={this.props.fileTileShowEmpty}
        />
      );
    });
    return (
      <section className="file-list__header">
        {fetching && <BusyMessage />}
        <span className="sort-section">
          {__("Sort by")} {" "}
          <FormField type="select" onChange={this.handleSortChanged.bind(this)}>
            <option value="date">{__("Date")}</option>
            <option value="title">{__("Title")}</option>
          </FormField>
        </span>
        {content}
      </section>
    );
  }
}

export default FileList;
