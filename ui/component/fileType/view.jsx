// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Icon from 'component/common/icon';
import * as COL from 'constants/collections';

type Props = {
  uri: string,
  mediaType: string,
  isLivestream: boolean,
  small: boolean,
};

function FileType(props: Props) {
  const { mediaType, isLivestream, small } = props;
  const size = small ? COL.ICON_SIZE : undefined;

  if (mediaType === 'image') {
    return <Icon size={size} icon={ICONS.IMAGE} />;
  } else if (mediaType === 'audio') {
    return <Icon size={size} icon={ICONS.AUDIO} />;
  } else if (mediaType === 'video' || isLivestream) {
    return <Icon size={size} icon={ICONS.VIDEO} />;
  } else if (mediaType === 'text') {
    return <Icon size={size} icon={ICONS.TEXT} />;
  }

  return <Icon icon={ICONS.DOWNLOADABLE} />;
}

export default FileType;
