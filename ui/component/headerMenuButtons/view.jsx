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
  doOpenModal: (string, {}) => void,
};

export default function HeaderMenuButtons(props: HeaderMenuButtonProps) {
  const { authenticated, user } = props;

  const livestreamEnabled = Boolean(ENABLE_NO_SOURCE_CLAIMS && user && !user.odysee_live_disabled);

  const uploadProps = { requiresAuth: !authenticated };
  const { push } = useHistory();

  return authenticated ? (
    <div className="header__buttons">
      <Tooltip title={__('Upload a file')}>
        <Button className="header__navigationItem--icon" navigate={`/$/${PAGES.UPLOAD}`}>
          <Icon size={18} icon={ICONS.PUBLISH} aria-hidden />
        </Button>
      </Tooltip>
      {livestreamEnabled && (
        <Tooltip title={__('Go live')}>
          <Button className="header__navigationItem--icon" {...uploadProps} navigate={`/$/${PAGES.LIVESTREAM}`}>
            <Icon size={18} icon={ICONS.VIDEO} aria-hidden />
          </Button>
        </Tooltip>
      )}
      <Tooltip title={__('Post an article')}>
        <Button className="header__navigationItem--icon" navigate={`/$/${PAGES.POST}`}>
          <Icon size={18} icon={ICONS.POST} aria-hidden />
        </Button>
      </Tooltip>
    </div>
  ) : (
    <Tooltip title={__('Settings')}>
      <Button className="header__navigationItem--icon" onClick={() => push(`/$/${PAGES.SETTINGS}`)}>
        <Icon size={18} icon={ICONS.SETTINGS} aria-hidden />
      </Button>
    </Tooltip>
  );
}
