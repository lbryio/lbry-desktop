// @flow
import React from 'react';
import Button from 'component/button';
import { formatLbryUrlForWeb } from 'util/url';
import { withRouter } from 'react-router';
import { URL, SITE_NAME } from 'config';
import OdyseeLogoWithText from 'component/header/odysee_white.png';

type Props = {
  uri: string,
  isAuthenticated: boolean,
};

function FileViewerEmbeddedEnded(props: Props) {
  const { uri, isAuthenticated } = props;

  const prompts = isAuthenticated
    ? {
        discuss_auth: `Continue the discussion on ${SITE_NAME}`,
        tip_auth: 'Always tip your creators',
      }
    : {
        bigtech_unauth: 'Together, we can take back control from big tech',
        discuss_unauth: `Continue the discussion on ${SITE_NAME}`,
        find_unauth: `Find more great content on ${SITE_NAME}`,
        a_b_unauth: "We test a lot of messages here. Wouldn't it be funny if the one telling you that did the best?",
        earn_unauth: `Join ${SITE_NAME} and earn to watch.`,
        blockchain_unauth: "Now if anyone asks, you can say you've used a blockchain.",
      };

  const promptKeys = Object.keys(prompts);
  const promptKey = promptKeys[Math.floor(Math.random() * promptKeys.length)];
  // $FlowFixMe
  const prompt = prompts[promptKey];
  const lbrytvLink = `${URL}${formatLbryUrlForWeb(uri)}?src=${promptKey}`;

  return (
    <div className="file-viewer__overlay">
      <div className="file-viewer__overlay-secondary">
        <Button className="file-viewer__overlay-logo--videoend" href={URL}>
          <img src={OdyseeLogoWithText} />
        </Button>
      </div>
      <div className="file-viewer__overlay-title">{prompt}</div>
      <div className="file-viewer__overlay-actions">
        <Button label={__('Rewatch or Discuss')} button="primary" href={lbrytvLink} />
        {!isAuthenticated && (
          <Button
            label={__('Join %SITE_NAME%', { SITE_NAME })}
            button="secondary"
            href={`${URL}/$/signup?src=embed_signup`}
          />
        )}
      </div>
    </div>
  );
}

export default withRouter(FileViewerEmbeddedEnded);
