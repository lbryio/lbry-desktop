// @flow
import * as React from 'react';
import ClaimPreview from 'component/claimPreview';

type Props = {
  channelUri: string,
  hideActions?: boolean,
};

function ClaimAuthor(props: Props) {
  const { channelUri, hideActions } = props;

  return channelUri ? (
    <ClaimPreview uri={channelUri} type="inline" properties={false} hideMenu hideActions={hideActions} />
  ) : (
    <div className="claim-preview--inline claim-preview__title">{__('Anonymous')}</div>
  );
}

export default ClaimAuthor;
