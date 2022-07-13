// @flow
import classnames from 'classnames';
import React from 'react';
import Empty from 'component/common/empty';

type Props = {
  isChannel: boolean,
  type: string,
};

function ClaimPreviewNoContent(props: Props) {
  const { isChannel, type } = props;
  return (
    <li
      className={classnames('claim-preview__wrapper', {
        'claim-preview__wrapper--channel': isChannel && type !== 'inline',
        'claim-preview__wrapper--inline': type === 'inline',
      })}
    >
      <div
        className={classnames('claim-preview claim-preview--inactive', {
          'claim-preview--large': type === 'large',
          'claim-preview__empty': true,
        })}
      >
        <Empty text={__('Nothing found here. Like big tech ethics.')} />
      </div>
    </li>
  );
}

export default ClaimPreviewNoContent;
