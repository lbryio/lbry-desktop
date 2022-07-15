// @flow
import classnames from 'classnames';
import React from 'react';

type Props = {
  isChannel?: boolean,
  type?: string,
  WrapperElement?: string,
  xsmall?: boolean,
};

function ClaimPreviewLoading(props: Props) {
  const { isChannel, type, WrapperElement = 'li', xsmall } = props;

  return (
    // Uses the same WrapperElement as claimPreview so it's consistent with the rest of the list components
    <WrapperElement
      className={classnames('placeholder claim-preview__wrapper', {
        'claim-preview__wrapper--channel': isChannel && type !== 'inline',
        'claim-preview__wrapper--inline': type === 'inline',
        'claim-preview__wrapper--small': type === 'small',
      })}
    >
      <div className={classnames('claim-preview', { 'claim-preview--large': type === 'large' })}>
        <div className={classnames('media__thumb', { 'media__thumb--small': xsmall })} />
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
    </WrapperElement>
  );
}

export default ClaimPreviewLoading;
