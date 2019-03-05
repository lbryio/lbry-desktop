// @flow
import classnames from 'classnames';
import React from 'react';
import Button from 'component/button';

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
    return (
      <Button
        disabled={disabled}
        iconSize={30}
        title={label}
        className={classnames('button--icon', {
          'button--play': doesPlayback,
          'button--view': !doesPlayback,
        })}
        onClick={play}
      />
    );
  }
}

export default VideoPlayButton;
