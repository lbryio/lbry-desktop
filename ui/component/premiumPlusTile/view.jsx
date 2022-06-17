// @flow
import React from 'react';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import Icon from 'component/common/icon';

type Props = {
  tileLayout?: boolean,
};

const PremiumPlusTile = (props: Props) => {
  const { tileLayout } = props;

  const title = __('No ads and access to exclusive features!');
  const channel = __('Get Odysee Premium+');
  const time = __('Now');

  return tileLayout ? (
    <li className="card claim-preview--tile claim-preview--premium-plus">
      <a href={`/$/${PAGES.ODYSEE_MEMBERSHIP}`}>
        <div className="media__thumb" />
        <div className="claim-tile__header">
          <h2 className="claim-tile__title">{title}</h2>
        </div>
        <div>
          <div className="claim-tile__info">
            <Icon icon={ICONS.UPGRADE} />
            <div className="claim-tile__about">
              <div className="channel-name">{channel}</div>
              <div className="claim-tile__about--counts">
                <span className="date_time">{time}</span>
              </div>
            </div>
          </div>
        </div>
      </a>
    </li>
  ) : (
    <li className="claim-preview__wrapper claim-preview--premium-plus">
      <a href={`/$/${PAGES.ODYSEE_MEMBERSHIP}`}>
        <div className="claim-preview">
          <div className="media__thumb" />
          <div className="claim-preview__text">
            <div className="claim-preview-metadata">
              <div className="claim-preview-info">
                <div className="claim-preview__title">{title}</div>
              </div>
              <div className="claim-tile__info">
                <div className="claim-preview__channel-staked">
                  <Icon icon={ICONS.UPGRADE} />
                </div>
                <div className="media__subtitle">
                  <div className="button__content">
                    <span className="channel-name">{channel}</span>
                    <br />
                  </div>
                  <span className="view_count">{time}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </li>
  );
};

export default PremiumPlusTile;
