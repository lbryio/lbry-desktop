// @flow
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
    const icon = doesPlayback ? 'Play' : 'Folder';
    const label = doesPlayback ? 'Play' : 'View';

    return (
      <Button button="secondary" disabled={disabled} label={label} icon={icon} onClick={play} />
    );
  }
}

export default VideoPlayButton;
