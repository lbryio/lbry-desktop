// @flow
import classnames from 'classnames';
import React from 'react';
import Button from 'component/button';
import * as ICONS from 'constants/icons';

type Props = {
  play: (SyntheticInputEvent<*>) => void,
  isLoading: boolean,
  mediaType: string,
  fileInfo: ?{},
};

class VideoPlayButton extends React.PureComponent<Props> {
  render() {
    const { fileInfo, mediaType, isLoading, play } = this.props;
    const disabled = isLoading || fileInfo === undefined;
    const doesPlayback = ['audio', 'video'].indexOf(mediaType) !== -1;
    const label = doesPlayback ? __('Play') : __('View');
    const icon = doesPlayback ? ICONS.PLAY : ICONS.VIEW;
    return (
      <Button
        disabled={disabled}
        label={label}
        icon={icon}
        iconSize={30}
        className={classnames('btn--icon', {
          'btn--play': doesPlayback,
          'btn--view': !doesPlayback,
        })}
        onClick={play}
      />
    );
  }
}

export default VideoPlayButton;
