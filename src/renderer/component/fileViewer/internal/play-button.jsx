// @flow
import React from 'react';
import Button from 'component/button';
import * as icons from 'constants/icons';

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
    const icon = doesPlayback ? icons.PLAY : icons.EYE;
    const label = doesPlayback ? __('Play') : __('View');

    return <Button button="primary" disabled={disabled} label={label} icon={icon} onClick={play} />;
  }
}

export default VideoPlayButton;
