// @flow
import React from 'react';
import Button from 'component/button';
import FileList from 'component/fileList';
import Page from 'component/page';

type Props = {
  pendingPublishes: Array<{}>,
  claims: Array<{}>,
  checkIfPublishesConfirmed: (Array<{}>) => void,
  navigate: (string, ?{}) => void,
};

class FileListPublished extends React.PureComponent<Props> {
  componentDidMount() {
    const { pendingPublishes, checkIfPublishesConfirmed } = this.props;
    if (pendingPublishes.length) {
      checkIfPublishesConfirmed(pendingPublishes);
    }
  }

  render() {
    const { claims, pendingPublishes, navigate } = this.props;
    const fileInfos = [...pendingPublishes, ...claims];

    return (
      <Page notContained>
        {fileInfos.length ? (
          <FileList checkPending fileInfos={fileInfos} sortByHeight />
        ) : (
          <div className="page__empty">
            {__("It looks like you haven't published anything to LBRY yet.")}
            <div className="card__actions card__actions--center">
              <Button
                button="primary"
                onClick={() => navigate('/publish')}
                label={__('Publish something new')}
              />
            </div>
          </div>
        )}
      </Page>
    );
  }
}

export default FileListPublished;
