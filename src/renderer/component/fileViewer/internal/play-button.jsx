// @flow
import classnames from 'classnames';
import React from 'react';
import Button from 'component/button';

type Props = {
  play: () => void,
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
        label={label}
        className={classnames('btn--icon', {
          'play': doesPlayback,
          'view': !doesPlayback,
        })}
        onClick={play}
      />
    );
  }
}

export default VideoPlayButton;
