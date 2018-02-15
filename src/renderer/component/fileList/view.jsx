// @flow
import * as React from 'react';
import { buildURI } from 'lbryURI';
import { FormField } from 'component/common/form';
import FileCard from 'component/fileCard';
import { BusyMessage } from 'component/common.js';

const sortFunctions = {
  date: (fileInfos: Array<FileInfo>) => {
    return fileInfos.slice().reverse();
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
  fileInfos: Array<FileInfo>
}

type State = {
  sortBy: string
}

class FileList extends React.PureComponent<Props, State> {
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
    if (fileInfo.value) {
      return fileInfo.value.publisherSignature.certificateId;
    }
    return fileInfo.metadata.publisherSignature.certificateId;
  }

  render() {
    const { fileInfos } = this.props;
    const { sortBy } = this.state;
    const content = [];

    sortFunctions[sortBy](fileInfos).forEach(fileInfo => {
      const uriParams = {};

      if (fileInfo.channel_name) {
        uriParams.channelName = fileInfo.channel_name;
        uriParams.contentName = fileInfo.name;
        uriParams.claimId = this.getChannelSignature(fileInfo);
      } else {
        uriParams.claimId = fileInfo.claim_id;
        uriParams.name = fileInfo.name;
      }
      const uri = buildURI(uriParams);

      content.push(
        <FileCard
          key={fileInfo.outpoint || fileInfo.claim_id}
          uri={uri}
          showPrice={false}
        />
      );
    });

    return (
      <section>
        <div className="file-list__sort">
          <FormField prefix={__('Sort by')} type="select" value={sortBy} onChange={this.handleSortChanged}>
            <option value="date">{__('Date')}</option>
            <option value="title">{__('Title')}</option>
          </FormField>
        </div>
        <div className="file-list">
          {content}
        </div>
      </section>
    );
  }
}

export default FileList;
