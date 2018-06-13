// @flow
import React from 'react';
import FileDownloadLink from 'component/fileDownloadLink';

type Props = {
  src: string,
  uri: string,
  shouldObscure: boolean,
};

class Thumbnail extends React.Component<Props> {
  render() {
    const { uri, src, shouldObscure } = this.props;
    const layoverStyle = !shouldObscure && src ? { backgroundImage: `url("${src}")` } : {};
    return (
      <div className="content__embedded thumbnail">
        <div style={layoverStyle}>
          <FileDownloadLink uri={uri} />
        </div>
      </div>
    );
  }
}

export default Thumbnail;
