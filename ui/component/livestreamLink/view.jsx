// @flow

import React from 'react';
import Card from 'component/common/card';
import ClaimPreview from 'component/claimPreview';
import { useHistory } from 'react-router';
import { formatLbryUrlForWeb } from 'util/url';

type Props = {
  title?: string,
  claimUri: string,
};

export default function LivestreamLink(props: Props) {
  const { claimUri, title = null } = props;
  const { push } = useHistory();

  const element = (props: { children: any }) => (
    <Card
      className="livestream__channel-link claim-preview__live"
      title={title || __('Live stream in progress')}
      onClick={() => {
        push(formatLbryUrlForWeb(claimUri));
      }}
    >
      {props.children}
    </Card>
  );

  return claimUri ? <ClaimPreview uri={claimUri} wrapperElement={element} type="inline" /> : null;
}
