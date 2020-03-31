// @flow
import * as React from 'react';
import { normalizeURI } from 'lbry-redux';
import FilePrice from 'component/filePrice';
import ClaimInsufficientCredits from 'component/claimInsufficientCredits';
import FileSubtitle from 'component/fileSubtitle';
import FileAuthor from 'component/fileAuthor';
import FileActions from 'component/fileActions';
import Card from 'component/common/card';

type Props = {
  uri: string,
  title: string,
  nsfw: boolean,
};

function FileTitle(props: Props) {
  const { title, uri, nsfw } = props;

  return (
    <Card
      isPageTitle
      title={
        <React.Fragment>
          {title}
          <FilePrice badge uri={normalizeURI(uri)} />
          {nsfw && (
            <span className="media__title-badge">
              <span className="badge badge--tag-mature">{__('Mature')}</span>
            </span>
          )}
        </React.Fragment>
      }
      body={
        <React.Fragment>
          {/* @if TARGET='app' */}
          <ClaimInsufficientCredits uri={uri} />
          {/* @endif */}
          <FileSubtitle uri={uri} />
          <FileAuthor uri={uri} />
        </React.Fragment>
      }
      actions={<FileActions uri={uri} />}
    />
  );
}

export default FileTitle;
