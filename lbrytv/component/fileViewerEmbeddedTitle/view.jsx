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
};

function fileViewerEmbeddedTitle(props: Props) {
  const { uri, title } = props;

  const lbrytvLink = `${URL}${formatLbryUrlForWeb(uri)}?src=embed`;

  return (
    <div className="file-viewer__embedded-title">
      <Button className="file-viewer__overlay-logo file-viewer__embedded-title-logo" icon={ICONS.LBRY} href={URL} />
      <Button label={title} button="link" href={lbrytvLink} />
    </div>
  );
}

export default withRouter(fileViewerEmbeddedTitle);
