// @flow
import * as React from 'react';
import { buildURI, SORT_OPTIONS } from 'lbry-redux';
import { FormField, Form } from 'component/common/form';
import FileCard from 'component/fileCard';

type Props = {
  hideFilter: boolean,
  sortByHeight?: boolean,
  claimsById: Array<StreamClaim>,
  fileInfos: Array<FileListItem>,
  sortBy: string,
  page?: string,
  setFileListSort: (?string, string) => void,
};

class FileList extends React.PureComponent<Props> {
  static defaultProps = {
    hideFilter: false,
    sortBy: SORT_OPTIONS.DATE_NEW,
  };

  constructor(props: Props) {
    super(props);
    (this: any).handleSortChanged = this.handleSortChanged.bind(this);

    this.sortFunctions = {
      [SORT_OPTIONS.DATE_NEW]: fileInfos =>
        this.props.sortByHeight
          ? fileInfos.sort((fileInfo1, fileInfo2) => {
              if (fileInfo1.confirmations < 1) {
                return -1;
              } else if (fileInfo2.confirmations < 1) {
                return 1;
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
      [SORT_OPTIONS.DATE_OLD]: fileInfos =>
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
      [SORT_OPTIONS.TITLE]: fileInfos =>
        fileInfos.slice().sort((fileInfo1, fileInfo2) => {
          const getFileTitle = fileInfo => {
            const { value, name, claim_name: claimName } = fileInfo;
            if (value) {
              return value.title || claimName;
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
      [SORT_OPTIONS.FILENAME]: fileInfos =>
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

  getChannelSignature = (fileInfo: { pending: boolean } & FileListItem) => {
    if (fileInfo.pending) {
      return undefined;
    }

    return fileInfo.channel_claim_id;
  };

  handleSortChanged(event: SyntheticInputEvent<*>) {
    this.props.setFileListSort(this.props.page, event.target.value);
  }

  sortFunctions: {};

  render() {
    const { fileInfos, hideFilter, sortBy } = this.props;

    const content = [];
    if (!fileInfos) {
      return null;
    }

    this.sortFunctions[sortBy](fileInfos).forEach(fileInfo => {
      const { name: claimName, claim_name: claimNameDownloaded, claim_id: claimId, txid, nout, isNew } = fileInfo;
      const uriParams = {};

      // This is unfortunate
      // https://github.com/lbryio/lbry/issues/1159
      const name = claimName || claimNameDownloaded;
      uriParams.contentName = name;
      uriParams.claimId = claimId;
      const uri = buildURI(uriParams);
      const outpoint = `${txid}:${nout}`;

      // See https://github.com/lbryio/lbry-desktop/issues/1327 for discussion around using outpoint as the key
      content.push(<FileCard key={outpoint} uri={uri} isNew={isNew} />);
    });

    return (
      <section>
        {!hideFilter && (
          <Form>
            <FormField label={__('Sort by')} type="select" value={sortBy} onChange={this.handleSortChanged}>
              <option value={SORT_OPTIONS.DATE_NEW}>{__('Newest First')}</option>
              <option value={SORT_OPTIONS.DATE_OLD}>{__('Oldest First')}</option>
              <option value={SORT_OPTIONS.TITLE}>{__('Title')}</option>
            </FormField>
          </Form>
        )}

        <section className="media-group--list">
          <div className="card__list">{content}</div>
        </section>
      </section>
    );
  }
}

export default FileList;
