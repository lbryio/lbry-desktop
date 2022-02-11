// @flow
import classnames from 'classnames';
import React from 'react';

type Props = {
  isChannel: boolean,
  type: string,
};

function ClaimPreviewLoading(props: Props) {
  const { isChannel, type } = props;
  return (
    <li
      className={classnames('placeholder claim-preview__wrapper', {
        'claim-preview__wrapper--channel': isChannel && type !== 'inline',
        'claim-preview__wrapper--inline': type === 'inline',
        'claim-preview__wrapper--small': type === 'small',
      })}
    >
      <div className={classnames('claim-preview', { 'claim-preview--large': type === 'large' })}>
        <div className="media__thumb" />
        <div className="placeholder__wrapper">
          <div className="claim-preview__title" />
          <div className="claim-preview__title_b" />
          <div className="claim-tile__info">
            <div className="channel-thumbnail" />
            <div className="claim-tile__about">
              <div className="media__subtitle" />
              <div className="media__subtitle_b" />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default ClaimPreviewLoading;
