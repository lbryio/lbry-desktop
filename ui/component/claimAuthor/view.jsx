// @flow
import * as React from 'react';
import ClaimPreview from 'component/claimPreview';

type Props = {
  channelUri: string,
  hideActions?: boolean,
  channelSubCount?: number,
};

function ClaimAuthor(props: Props) {
  const { channelUri, hideActions, channelSubCount } = props;

  return channelUri ? (
    <ClaimPreview
      uri={channelUri}
      type="inline"
      properties={false}
      hideMenu
      hideActions={hideActions}
      channelSubCount={channelSubCount}
    />
  ) : (
    <div className="claim-preview--inline claim-preview__title">{__('Anonymous')}</div>
  );
}

export default ClaimAuthor;
