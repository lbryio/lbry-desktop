import React from 'react';
import { buildURI } from 'lbryURI';
import FormField from 'component/formField';
import FileTile from 'component/fileTile';
import { BusyMessage } from 'component/common.js';

class FileList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      sortBy: 'dateNew',
    };

    this._sortFunctions = {
      dateNew: fileInfos =>
        this.props.sortByHeight
          ? fileInfos.slice().sort((fileInfo1, fileInfo2) => {
              const height1 = this.props.claimsById[fileInfo1.claim_id]
                ? this.props.claimsById[fileInfo1.claim_id].height
                : 0;
              const height2 = this.props.claimsById[fileInfo2.claim_id]
                ? this.props.claimsById[fileInfo2.claim_id].height
                : 0;
              if (height1 > height2) {
                return -1;
              } else if (height1 < height2) {
                return 1;
              }
              return 0;
            })
          : [...fileInfos].reverse(),
      dateOld: fileInfos =>
        this.props.sortByHeight
          ? fileInfos.slice().sort((fileInfo1, fileInfo2) => {
              const height1 = this.props.claimsById[fileInfo1.claim_id]
                ? this.props.claimsById[fileInfo1.claim_id].height
                : 999999;
              const height2 = this.props.claimsById[fileInfo2.claim_id]
                ? this.props.claimsById[fileInfo2.claim_id].height
                : 999999;
              if (height1 < height2) {
                return -1;
              } else if (height1 > height2) {
                return 1;
              }
              return 0;
            })
          : fileInfos,
      title: fileInfos =>
        fileInfos.slice().sort((fileInfo1, fileInfo2) => {
          const getFileTitle = fileInfo => {
            const { value, metadata, name, claim_name: claimName } = fileInfo;
            if (metadata) {
              // downloaded claim
              return metadata.title || claimName;
            } else if (value) {
              // published claim
              const { title } = value.stream.metadata;
              return title || name;
            }
            // Invalid claim
            return '';
          };
          const title1 = getFileTitle(fileInfo1).toLowerCase();
          const title2 = getFileTitle(fileInfo2).toLowerCase();
          if (title1 < title2) {
            return -1;
          } else if (title1 > title2) {
            return 1;
          }
          return 0;
        }),
      filename: fileInfos =>
        fileInfos.slice().sort(({ file_name: fileName1 }, { file_name: fileName2 }) => {
          const fileName1Lower = fileName1.toLowerCase();
          const fileName2Lower = fileName2.toLowerCase();
          if (fileName1Lower < fileName2Lower) {
            return -1;
          } else if (fileName2Lower > fileName1Lower) {
            return 1;
          }
          return 0;
        }),
    };
  }

  getChannelSignature(fileInfo) {
    if (fileInfo.value) {
      return fileInfo.value.publisherSignature.certificateId;
    }
    return fileInfo.channel_claim_id;
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
      const uriParams = {};

      if (fileInfo.channel_name) {
        uriParams.channelName = fileInfo.channel_name;
        uriParams.contentName = fileInfo.claim_name || fileInfo.name;
        uriParams.claimId = this.getChannelSignature(fileInfo);
      } else {
        uriParams.claimId = fileInfo.claim_id;
        uriParams.claimName = fileInfo.claim_name || fileInfo.name;
      }
      const uri = buildURI(uriParams);

      content.push(
        <FileTile
          key={fileInfo.outpoint || fileInfo.claim_id}
          uri={uri}
          showPrice={false}
          showLocal={false}
          showActions
          showEmpty={this.props.fileTileShowEmpty}
        />
      );
    });
    return (
      <section className="file-list__header">
        {fetching && <BusyMessage />}
        <span className="sort-section">
          {__('Sort by')}{' '}
          <FormField type="select" onChange={this.handleSortChanged.bind(this)}>
            <option value="dateNew">{__('Newest First')}</option>
            <option value="dateOld">{__('Oldest First')}</option>
            <option value="title">{__('Title')}</option>
          </FormField>
        </span>
        {content}
      </section>
    );
  }
}

export default FileList;
