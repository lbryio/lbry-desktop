// @flow
import classnames from 'classnames';
import React from 'react';
import Empty from 'component/common/empty';
import ButtonRemoveFromCollection from './buttonRemoveFromCollection';

type Props = {
  uri?: string,
  collectionId?: ?string,
  isChannel: boolean,
  type: string,
  message: string,
};

function ClaimPreviewHidden(props: Props) {
  const { uri, collectionId, isChannel, type, message } = props;

  return (
    <li
      className={classnames('claim-preview__wrapper', {
        'claim-preview__wrapper--channel': isChannel && type !== 'inline',
        'claim-preview__wrapper--inline': type === 'inline',
        'claim-preview__wrapper--small': type === 'small',
      })}
    >
      <div
        className={classnames('claim-preview  claim-preview--inactive claim-preview--empty', {
          'claim-preview--large': type === 'large',
        })}
      >
        <div className={classnames('media__thumb', { 'media__thumb--small': type === 'small' })}>
          {collectionId && (
            <div className="claim-preview__hover-actions-grid">
              <ButtonRemoveFromCollection uri={uri} collectionId={collectionId} />
            </div>
          )}
        </div>

        <Empty text={message} />
      </div>
    </li>
  );
}

export default ClaimPreviewHidden;
