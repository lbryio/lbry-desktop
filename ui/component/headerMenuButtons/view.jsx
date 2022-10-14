// @flow
import 'scss/component/_header.scss';

import { ENABLE_NO_SOURCE_CLAIMS } from 'config';
import { useHistory } from 'react-router';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import Button from 'component/button';
import Icon from 'component/common/icon';
import React from 'react';
import Tooltip from 'component/common/tooltip';

type HeaderMenuButtonProps = {
  activeChannelStakedLevel: number,
  authenticated: boolean,
  user: ?User,
  authRedirect?: string,
  clearPublish: () => void,
};

export default function HeaderMenuButtons(props: HeaderMenuButtonProps) {
  const { authenticated, user, authRedirect, clearPublish } = props;

  const livestreamEnabled = Boolean(ENABLE_NO_SOURCE_CLAIMS && user && !user.odysee_live_disabled);
  const authRedirectParam = authRedirect ? `?redirect=${authRedirect}` : '';

  const uploadProps = { requiresAuth: !authenticated };
  const { push } = useHistory();

  return authenticated ? (
    <div className="header__buttons">
      <Tooltip title={__('Upload')}>
        <Button className="header__navigationItem--icon" onClick={() => clearPublish()} navigate={`/$/${PAGES.UPLOAD}`}>
          <Icon size={18} icon={ICONS.PUBLISH} aria-hidden />
        </Button>
      </Tooltip>
      {livestreamEnabled && (
        <Tooltip title={__('Go live')}>
          <Button
            className="header__navigationItem--icon"
            {...uploadProps}
            onClick={() => clearPublish()}
            navigate={`/$/${PAGES.LIVESTREAM}`}
          >
            <Icon size={18} icon={ICONS.GOLIVE} aria-hidden />
          </Button>
        </Tooltip>
      )}
      <Tooltip title={__('Post an article')}>
        <Button className="header__navigationItem--icon" onClick={() => clearPublish()} navigate={`/$/${PAGES.POST}`}>
          <Icon size={18} icon={ICONS.POST} aria-hidden />
        </Button>
      </Tooltip>
    </div>
  ) : (
    <>
      <Tooltip title={__('Upload')}>
        <Button className="header__navigationItem--icon" onClick={() => push(`/$/${PAGES.AUTH}${authRedirectParam}`)}>
          <Icon size={18} icon={ICONS.PUBLISH} aria-hidden />
        </Button>
      </Tooltip>
      <Tooltip title={__('Settings')}>
        <Button className="header__navigationItem--icon" onClick={() => push(`/$/${PAGES.SETTINGS}`)}>
          <Icon size={18} icon={ICONS.SETTINGS} aria-hidden />
        </Button>
      </Tooltip>
      <Tooltip title={__('Help')}>
        <Button className="header__navigationItem--icon" onClick={() => push(`/$/${PAGES.HELP}`)}>
          <Icon size={18} icon={ICONS.HELP} aria-hidden />
        </Button>
      </Tooltip>
    </>
  );
}
