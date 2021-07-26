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
      className={classnames('claim-preview__wrapper', {
        'claim-preview__wrapper--channel': isChannel && type !== 'inline',
        'claim-preview__wrapper--inline': type === 'inline',
        'claim-preview__wrapper--small': type === 'small',
      })}
    >
      <div className={classnames('claim-preview', { 'claim-preview--large': type === 'large' })}>
        <div className="placeholder media__thumb" />
        <div className="placeholder__wrapper">
          <div className="placeholder claim-preview__title" />
          <div className="placeholder media__subtitle" />
        </div>
      </div>
    </li>
  );
}

export default ClaimPreviewLoading;
