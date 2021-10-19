// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Icon from 'component/common/icon';
import * as COL from 'constants/collections';

type Props = {
  uri: string,
  mediaType: string,
  small: boolean,
};

function FileType(props: Props) {
  const { mediaType, small } = props;
  const size = small ? COL.ICON_SIZE : undefined;

  if (mediaType === 'image') {
    return <Icon size={size} icon={ICONS.IMAGE} />;
  } else if (mediaType === 'audio') {
    return <Icon size={size} icon={ICONS.AUDIO} />;
  } else if (mediaType === 'video') {
    return <Icon size={size} icon={ICONS.VIDEO} />;
  } else if (mediaType === 'text') {
    return <Icon size={size} icon={ICONS.TEXT} />;
  }

  return <Icon icon={ICONS.DOWNLOADABLE} />;
}

export default FileType;
