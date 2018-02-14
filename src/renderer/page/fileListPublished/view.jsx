import React from 'react';
import Link from 'component/link';
import FileList from 'component/fileList';
import Page from 'component/page';

class FileListPublished extends React.PureComponent {
  render() {
    const { claims, navigate } = this.props;
    const hasClaims = claims && claims.length > 0;

    return (
      <Page>
        {hasClaims ? (
          <FileList
            fileInfos={claims}
          />
        ) : (
          <div className="page__empty">
            {__("It looks like you haven't published anything to LBRY yet.")}
            <div className="card__actions card__actions--center">
              <Link
                onClick={() => navigate('/publish')}
                label={__('Publish something new')}
              />
            </div>
          </div>
        )}
      </Page>
    )
  }
}

export default FileListPublished;
