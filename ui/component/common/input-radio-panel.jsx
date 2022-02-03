// @flow
import React from 'react';
import * as ICONS from 'constants/icons';
import Button from 'component/button';
import classnames from 'classnames';

type Props = {
  onClick: (CommentServerDetails) => void,
  onRemove?: (CommentServerDetails) => void,
  active: boolean,
  serverDetails: CommentServerDetails,
};

const InputTogglePanel = (props: Props) => {
  const { onClick, active, serverDetails, onRemove } = props;

  return (
    <div
      onClick={() => onClick(serverDetails)}
      className={classnames('input-toggle-panel', { 'input-toggle-panel--active': active })}
    >
      <div className={'input-toggle-panel__details'}>
        <div className={'input-toggle-panel__name'}>{`${serverDetails.name}`}</div>
        <div className={'input-toggle-panel__url'}>{`${serverDetails.url}`}</div>
      </div>
      {onRemove && (
        <Button
          button="close"
          title={__('Remove custom comment server')}
          icon={ICONS.REMOVE}
          onClick={() => onRemove(serverDetails)}
        />
      )}
      {!onRemove && <div />}
    </div>
  );
};

export default InputTogglePanel;
