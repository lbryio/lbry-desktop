// @flow
import React from 'react';
import Button from 'component/button';
import { formatLbryUrlForWeb } from 'util/url';
import { withRouter } from 'react-router';
import { URL } from 'config';
import * as ICONS from 'constants/icons';

type Props = {
  uri: string,
  title: ?string,
  isInApp: boolean,
};

function FileViewerEmbeddedTitle(props: Props) {
  const { uri, title, isInApp } = props;

  let contentLink = `${formatLbryUrlForWeb(uri)}`;

  if (!isInApp) {
    contentLink = `${contentLink}?src=embed`;
  }

  const contentLinkProps = isInApp ? { navigate: contentLink } : { href: contentLink };
  const lbryLinkProps = isInApp ? { navigate: '/' } : { href: URL };

  return (
    <div className="file-viewer__embedded-title">
      <Button label={title} button="link" {...contentLinkProps} />
      <Button
        className="file-viewer__overlay-logo file-viewer__embedded-title-logo"
        icon={ICONS.LBRY}
        {...lbryLinkProps}
      />
    </div>
  );
}

export default withRouter(FileViewerEmbeddedTitle);
