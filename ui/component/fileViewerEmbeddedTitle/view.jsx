// @flow
import React from 'react';
import Button from 'component/button';
import FilePrice from 'component/filePrice';
import { formatLbryUrlForWeb } from 'util/url';
import { withRouter } from 'react-router';
import { URL } from 'config';
import OdyseeLogo from 'component/header/odysee_logo.png';
import OdyseeLogoWithText from 'component/header/odysee_white.png';

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
    <div className="file-viewer__embedded-header">
      <div className="file-viewer__embedded-gradient" />
      <Button
        label={title}
        aria-label={title}
        button="link"
        className="file-viewer__embedded-title"
        {...contentLinkProps}
      />
      <div className="file-viewer__embedded-info">
        <Button className="file-viewer__overlay-logo" aria-label={__('Home')} {...lbryLinkProps}>
          <img src={OdyseeLogo} className=" mobile-only" />
          <img src={OdyseeLogoWithText} className=" mobile-hidden" />
        </Button>
        {isInApp && <FilePrice uri={uri} />}
      </div>
    </div>
  );
}

export default withRouter(FileViewerEmbeddedTitle);
