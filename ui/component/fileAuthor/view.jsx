// @flow
import * as React from 'react';
import ClaimPreview from 'component/claimPreview';

type Props = {
  channelUri: string,
};

function FileAuthor(props: Props) {
  const { channelUri } = props;

  return channelUri ? (
    <ClaimPreview uri={channelUri} type="inline" properties={false} hideBlock />
  ) : (
    <div className="claim-preview--inline claim-preview__title">{__('Anonymous')}</div>
  );
}

export default FileAuthor;
