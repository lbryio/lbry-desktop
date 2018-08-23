// @flow
import * as React from 'react';
import { buildURI } from 'lbry-redux';
import { FormField } from 'component/common/form';
import FileCard from 'component/fileCard';
import type { FileInfo } from 'types/file_info';

type Props = {
  hideFilter: boolean,
  sortByHeight?: boolean,
  claimsById: Array<{}>,
  fileInfos: Array<FileInfo>,
  checkPending?: boolean,
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

    (this: any).handleSortChanged = this.handleSortChanged.bind(this);

    this.sortFunctions = {
      dateNew: fileInfos =>
        this.props.sortByHeight
          ? fileInfos.sort((fileInfo1, fileInfo2) => {
              if (fileInfo1.pending) {
                return -1;
              }
              const height1 = this.props.claimsById[fileInfo1.claim_id]
                ? this.props.claimsById[fileInfo1.claim_id].height
                : 0;
              const height2 = this.props.claimsById[fileInfo2.claim_id]
                ? this.props.claimsById[fileInfo2.claim_id].height
                : 0;

              if (height1 !== height2) {
                // flipped because heigher block height is newer
                return height2 - height1;
              }

              if (fileInfo1.absolute_channel_position && fileInfo2.absolute_channel_position) {
                return fileInfo1.absolute_channel_position - fileInfo2.absolute_channel_position;
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

  getChannelSignature = (fileInfo: FileInfo) => {
    if (fileInfo.pending) {
      return undefined;
    }

    if (fileInfo.value) {
      return fileInfo.value.publisherSignature.certificateId;
    }
    return fileInfo.channel_claim_id;
  };

  handleSortChanged(event: SyntheticInputEvent<*>) {
    this.setState({
      sortBy: event.target.value,
    });
  }

  sortFunctions: {};

  render() {
    const { fileInfos, hideFilter, checkPending } = this.props;
    const { sortBy } = this.state;
    const content = [];

    if (!fileInfos) {
      return null;
    }

    this.sortFunctions[sortBy](fileInfos).forEach(fileInfo => {
      const {
        name: claimName,
        claim_name: claimNameDownloaded,
        claim_id: claimId,
        outpoint,
      } = fileInfo;
      const uriParams = {};

      // This is unfortunate
      // https://github.com/lbryio/lbry/issues/1159
      const name = claimName || claimNameDownloaded;
      uriParams.contentName = name;
      uriParams.claimId = claimId;
      const uri = buildURI(uriParams);

      // See https://github.com/lbryio/lbry-desktop/issues/1327 for discussion around using outpoint as the key
      content.push(<FileCard key={outpoint} uri={uri} checkPending={checkPending} />);
    });

    return (
      <section>
        <div className="file-list__sort">
          {!hideFilter && (
            <FormField
              prefix={__('Sort by')}
              affixClass="form-field--align-center"
              type="select"
              value={sortBy}
              onChange={this.handleSortChanged}
            >
              <option value="dateNew">{__('Newest First')}</option>
              <option value="dateOld">{__('Oldest First')}</option>
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
