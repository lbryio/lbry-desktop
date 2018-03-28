// @flow
import React from 'react';
import Button from 'component/button';

type Props = {
  play: string => void,
  isLoading: boolean,
  uri: string,
  mediaType: string,
  fileInfo: ?{},
};

class VideoPlayButton extends React.PureComponent<Props> {
  watch: () => void;

  constructor() {
    super();
    this.watch = this.watch.bind(this);
  }

  watch() {
    this.props.play(this.props.uri);
  }

  render() {
    const { fileInfo, mediaType, isLoading } = this.props;
    const disabled = isLoading || fileInfo === undefined;
    const doesPlayback = ['audio', 'video'].indexOf(mediaType) !== -1;
    const icon = doesPlayback ? 'Play' : 'Folder';
    const label = doesPlayback ? 'Play' : 'View';

    return (
      <Button
        button="secondary"
        disabled={disabled}
        label={label}
        icon={icon}
        onClick={this.watch}
      />
    );
  }
}

export default VideoPlayButton;
