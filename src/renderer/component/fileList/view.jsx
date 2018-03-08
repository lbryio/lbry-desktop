// @flow
import * as React from 'react';
import { buildURI } from 'lbryURI';
import { FormField } from 'component/common/form';
import FileCard from 'component/fileCard';
import { BusyMessage } from 'component/common.js';

const sortFunctions = {
  date: (fileInfos: Array<FileInfo>) => {
    return fileInfos.slice();
  },
  title: (fileInfos) => {
    return fileInfos.slice().sort((fileInfo1, fileInfo2) => {
      const title1 = fileInfo1.value
        ? fileInfo1.value.stream.metadata.title.toLowerCase()
        : fileInfo1.name;
      const title2 = fileInfo2.value
        ? fileInfo2.value.stream.metadata.title.toLowerCase()
        : fileInfo2.name;
      if (title1 < title2) {
        return -1;
      } else if (title1 > title2) {
        return 1;
      }
      return 0;
    });
  },
};

type FileInfo = {
  name: string,
  channelName: ?string,
  pending?: boolean,
  value?: {
    publisherSignature: {
      certificateId: string,
    }
  },
  metadata: {
    publisherSignature: {
      certificateId: string
    }
  }
}

type Props = {
  hideFilter: boolean,
  fileInfos: Array<FileInfo>
}

type State = {
  sortBy: string
}

class FileList extends React.PureComponent<Props, State> {
  static defaultProps = {
    hideFilter: false
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      sortBy: 'date',
    };

    (this: any).handleSortChanged = this.handleSortChanged.bind(this);
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

    return fileInfo.metadata.publisherSignature.certificateId;
  }

  render() {
    const { fileInfos, hideFilter } = this.props;
    const { sortBy } = this.state;
    const content = [];

    sortFunctions[sortBy](fileInfos).forEach(fileInfo => {
      const {
        channel_name,
        name,
        claim_id,
        outpoint,
        pending,
      } = fileInfo;
      const uriParams = {};

      if (fileInfo.channel_name) {
        uriParams.channelName = channel_name;
        uriParams.contentName = name;
        uriParams.claimId = this.getChannelSignature(fileInfo);
      } else {
        uriParams.claimId = claim_id;
        uriParams.name = name;
      }

      const uri = buildURI(uriParams);

      content.push(
        <FileCard
          pending={pending}
          key={outpoint || claim_id || name}
          uri={uri}
          showPrice={false}
        />
      );
    });

    return (
      <section>
        <div className="file-list__sort">
          {!hideFilter && (
            <FormField prefix={__('Sort by')} type="select" value={sortBy} onChange={this.handleSortChanged}>
              <option value="date">{__('Date')}</option>
              <option value="title">{__('Title')}</option>
            </FormField>
          )}
        </div>
        <div className="file-list">
          {content}
        </div>
      </section>
    );
  }
}

export default FileList;
