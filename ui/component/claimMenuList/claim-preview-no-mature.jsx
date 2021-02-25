// @flow
import classnames from 'classnames';
import React from 'react';
import Empty from 'component/common/empty';

type Props = {
  isChannel: boolean,
  type: string,
  message: string,
};

function ClaimPreviewHidden(props: Props) {
  const { isChannel, type, message } = props;
  return (
    <li
      className={classnames('claim-preview__wrapper', {
        'claim-preview__wrapper--channel': isChannel && type !== 'inline',
        'claim-preview__wrapper--inline': type === 'inline',
      })}
    >
      <div
        className={classnames('claim-preview  claim-preview--inactive claim-preview--empty', {
          'claim-preview--large': type === 'large',
        })}
      >
        <div className="media__thumb" />
        <Empty text={message} />
      </div>
    </li>
  );
}

export default ClaimPreviewHidden;
