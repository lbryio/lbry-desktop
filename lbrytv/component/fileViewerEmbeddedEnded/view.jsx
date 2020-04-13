// @flow
import React from 'react';
import Button from 'component/button';
import { formatLbryUrlForWeb } from 'util/url';
import { withRouter } from 'react-router';
import { URL } from 'config';
import * as ICONS from 'constants/icons';

type Props = {
  uri: string,
  isAuthenticated: boolean,
};

function fileViewerEmbeddedEnded(props: Props) {
  const { uri, isAuthenticated } = props;

  const prompts = isAuthenticated
    ? {
        discuss_auth: 'Continue the discussion on lbry.tv',
        tip_auth: 'Always tip your creators',
      }
    : {
        bigtech_unauth: 'Together, we can take back control from big tech',
        discuss_unauth: 'Continue the discussion on lbry.tv',
        find_unauth: 'Find more great content on lbry.tv',
        a_b_unauth: "We test a lot of messages here. Wouldn't it be funny if the one telling you that did the best?",
        earn_unauth: 'Join lbry.tv and earn to watch.',
        blockchain_unauth: "Now if anyone asks, you can say you've used a blockchain.",
      };

  const promptKeys = Object.keys(prompts);
  const promptKey = promptKeys[Math.floor(Math.random() * promptKeys.length)];
  const prompt = prompts[promptKey];
  const lbrytvLink = `${URL}${formatLbryUrlForWeb(uri)}?src=${promptKey}`;

  return (
    <div className="file-viewer__overlay">
      <div className="file-viewer__overlay-secondary">
        <Button
          className="file-viewer__overlay-logo file-viewer__embedded-title-logo"
          label="LBRY"
          icon={ICONS.LBRY}
          href={URL}
        />
      </div>
      <div className="file-viewer__overlay-title">{prompt}</div>
      <div className="file-viewer__overlay-actions">
        <Button label={__('Rewatch or Discuss')} button="primary" href={lbrytvLink} />
        {!isAuthenticated && <Button label={__('Join lbry.tv')} button="secondary" href={`${URL}/$/signup`} />}
      </div>
    </div>
  );
}

export default withRouter(fileViewerEmbeddedEnded);
