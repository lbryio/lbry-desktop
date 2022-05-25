// @flow
import React from 'react';
import './style.scss';
import Card from 'component/common/card';
import Icon from 'component/common/icon';
import Tooltip from 'component/common/tooltip';
import * as ICONS from 'constants/icons';
import * as MODALS from 'constants/modal_types';
import { parseURI } from 'util/lbryURI';

type Props = {
  uri: string,
  geoRestriction: ?GeoRestriction,
  doOpenModal: (string, {}) => void,
};

export default function GeoRestrictionInfo(props: Props) {
  const { uri, geoRestriction, doOpenModal } = props;

  if (!geoRestriction) {
    return null;
  }

  const { isChannel } = parseURI(uri);
  const title = __(isChannel ? 'Channel unavailable' : 'Content unavailable');
  const msg = <Card title={title} subtitle={__(geoRestriction.message || '')} />;

  function showMsg() {
    doOpenModal(MODALS.CONFIRM, {
      title: title,
      subtitle: __(geoRestriction.message || ''),
      onConfirm: (closeModal) => closeModal(),
      hideCancel: true,
    });
  }

  return (
    <Tooltip title={msg} followCursor>
      <div className="geo-restriction-info" onClick={showMsg}>
        <div className="geo-restriction-info__container">
          <Icon icon={ICONS.EYE_OFF} size={24} />
          <span className="geo-restriction-info__title">{title}</span>
        </div>
      </div>
    </Tooltip>
  );
}
