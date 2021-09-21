// @flow
import React from 'react';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import { formatLbryUrlForWeb } from 'util/url';
import { withRouter } from 'react-router';
import { URL, SITE_NAME } from 'config';
import Logo from 'component/logo';

type Props = {
  uri: string,
  isAuthenticated: boolean,
  preferEmbed: boolean,
};

function FileViewerEmbeddedEnded(props: Props) {
  const { uri, isAuthenticated, preferEmbed } = props;

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
  const showReplay = Boolean(window.player);

  return (
    <div className="file-viewer__overlay">
      <div className="file-viewer__overlay-secondary">
        <Button className="file-viewer__overlay-logo" href={URL} disabled={preferEmbed}>
          <Logo type={'embed'} />
        </Button>
      </div>

      <div className="file-viewer__overlay-title file-viewer_embed-ended-title">
        <p>{prompt}</p>
      </div>
      <div className="file-viewer__overlay-actions">
        <>
          {showReplay && (
            <Button
              title={__('Replay')}
              button="link"
              label={preferEmbed ? __('Replay') : undefined}
              iconRight={ICONS.REPLAY}
              onClick={() => {
                if (window.player) window.player.play();
              }}
            />
          )}
          {!preferEmbed && (
            <>
              <Button label={__('Discuss')} iconRight={ICONS.EXTERNAL} button="primary" href={lbrytvLink} />
              {!isAuthenticated && (
                <Button
                  label={__('Join %SITE_NAME%', { SITE_NAME })}
                  button="secondary"
                  href={`${URL}/$/signup?src=embed_signup`}
                />
              )}
            </>
          )}
        </>
      </div>
    </div>
  );
}

export default withRouter(FileViewerEmbeddedEnded);
