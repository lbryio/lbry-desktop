// @flow
import * as React from 'react';
import ClaimPreview from 'component/claimPreview';

type Props = {
  hideActions?: boolean,
  channelSubCount?: number,
  // redux
  channelUri: string,
};

export default function ClaimAuthor(props: Props) {
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
    <span className="claim-preview--inline claim-preview__title">{__('Anonymous')}</span>
  );
}
