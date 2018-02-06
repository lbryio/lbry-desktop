// @flow
import React from 'react';
import Button from 'component/link';

type Props = {
  play: string => void,
  isLoading: boolean,
  uri: string,
  mediaType: string,
  fileInfo: ?{},
};

class VideoPlayButton extends React.PureComponent<Props> {
  watch() {
    this.props.play(this.props.uri);
  }

  render() {
    const { fileInfo, mediaType, isLoading } = this.props;

    /*
      TODO: Add title back to button
       title={
       isLoading ? "Video is Loading" :
       !costInfo ? "Waiting on cost info..." :
       fileInfo === undefined ? "Waiting on file info..." : ""
       }
     */

    const disabled = isLoading || fileInfo === undefined;
    const doesPlayback = ['audio', 'video'].indexOf(mediaType) !== -1;
    const icon = doesPlayback ? 'Play' : 'Folder';
    const label = doesPlayback ? 'Play' : 'View';

    return (
      <Button
        secondary
        disabled={disabled}
        label={label}
        icon={icon}
        onClick={() => this.watch()}
      />
    );
  }
}

export default VideoPlayButton;
