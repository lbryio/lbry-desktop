// @flow
import React from 'react';
import Button from 'component/button';
import FilePrice from 'component/filePrice';
import { formatLbryUrlForWeb } from 'util/url';
import { withRouter } from 'react-router';
import Logo from 'component/logo';

type Props = {
  uri: string,
  title: ?string,
  isInApp: boolean,
  preferEmbed: boolean,
};

function FileViewerEmbeddedTitle(props: Props) {
  const { uri, title, isInApp, preferEmbed } = props;

  let contentLink = `${formatLbryUrlForWeb(uri)}`;

  if (!isInApp) {
    contentLink = `${contentLink}?src=embed`;
  }

  const contentLinkProps = isInApp ? { navigate: contentLink } : { href: contentLink };
  const odyseeLinkProps = isInApp ? { navigate: '/' } : { href: '/' };

  return (
    <div className="file-viewer__embedded-header">
      <div className="file-viewer__embedded-gradient" />
      {preferEmbed ? (
        <div className="file-viewer__embedded-title ">
          <span dir="auto">{title}</span>
        </div>
      ) : (
        <Button
          label={title}
          aria-label={title}
          button="link"
          className="file-viewer__embedded-title"
          {...contentLinkProps}
        />
      )}

      <div className="file-viewer__embedded-info">
        <Button
          className="file-viewer__overlay-logo"
          disabled={preferEmbed}
          aria-label={__('Home')}
          {...odyseeLinkProps}
        >
          <Logo type={'embed'} />
        </Button>
        {isInApp && <FilePrice uri={uri} />}
      </div>
    </div>
  );
}

export default withRouter(FileViewerEmbeddedTitle);
