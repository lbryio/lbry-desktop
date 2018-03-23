// @flow
import * as React from 'react';
import { buildURI } from 'lbryURI';
import { FormField } from 'component/common/form';
import FileCard from 'component/fileCard';
import BusyIndicator from 'component/common/busy-indicator';

type FileInfo = {
  name: string,
  channelName: ?string,
  pending?: boolean,
  value?: {
    publisherSignature: {
      certificateId: string,
    },
  },
  metadata: {
    publisherSignature: {
      certificateId: string,
    },
  },
};

type Props = {
  hideFilter: boolean,
  fileInfos: Array<FileInfo>,
};

type State = {
  sortBy: string,
};

class FileList extends React.PureComponent<Props, State> {
  static defaultProps = {
    hideFilter: false,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      sortBy: 'dateNew',
    };

    this.sortFunctions = {
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
          const title1 = fileInfo1.value
            ? fileInfo1.value.stream.metadata.title.toLowerCase()
            : fileInfo1.claim_name;
          const title2 = fileInfo2.value
            ? fileInfo2.value.stream.metadata.title.toLowerCase()
            : fileInfo2.claim_name;
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

  handleSortChanged(event: SyntheticInputEvent<*>) {
    this.setState({
      sortBy: event.target.value,
    });
  }

  getChannelSignature = (fileInfo: FileInfo) => {
    if (fileInfo.pending) {
      return undefined;
    }

    if (fileInfo.value) {
      return fileInfo.value.publisherSignature.certificateId;
    }
    return fileInfo.channel_claim_id;
  };

  render() {
    const { fileInfos, hideFilter } = this.props;
    const { sortBy } = this.state;
    const content = [];

    this.sortFunctions[sortBy](fileInfos).forEach(fileInfo => {
      const {
        channel_name: channelName,
        name,
        claim_name: claimName,
        claim_id: claimId,
        outpoint
      } = fileInfo;
      const uriParams = {};

      if (fileInfo.channel_name) {
        uriParams.channelName = channelName;
        uriParams.contentName = claimName || name;
        uriParams.claimId = this.getChannelSignature(fileInfo);
      } else {
        uriParams.claimId = claimId;
        uriParams.claimName = claimName || name;
      }

      const uri = buildURI(uriParams);

      content.push(
        <FileCard
          key={outpoint || claimId || name}
          uri={uri}
          showPrice={false} />
      );
    });

    return (
      <section>
        <div className="file-list__sort">
          {!hideFilter && (
            <FormField
              prefix={__('Sort by')}
              type="select"
              value={sortBy}
              onChange={this.handleSortChanged}
            >
              <option value="date">{__('Date')}</option>
              <option value="title">{__('Title')}</option>
            </FormField>
          )}
        </div>
        <div className="card__list">{content}</div>
      </section>
    );
  }
}

export default FileList;
