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

/*
  [ https://myserver.com x ]
  [ https://myserver.com x (selected)]

  [ https://myserver.com:50001 x (selected)]
 */

const ItemPanel = (props: Props) => {
  const { onClick, active, serverDetails, onRemove } = props;

  return (
    <div onClick={() => onClick(serverDetails)} className={classnames('itemPanel', { 'itemPanel--active': active })}>
      <div className={'itemPanel__details'}>
        <div className={'itemPanel__name'}>{`${serverDetails.name}`}</div>
        <div className={'itemPanel__url'}>{`${serverDetails.url}`}</div>
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

export default ItemPanel;
