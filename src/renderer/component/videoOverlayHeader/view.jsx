// @flow
import React from 'react';
import Button from 'component/button';
import * as icons from 'constants/icons';
import TruncatedText from 'component/common/truncated-text';

type Props = {
  onClose: () => void,
  title: string,
};

class VideoOverlayHeader extends React.Component<Props> {
  render() {
    const { onClose, title } = this.props;
    return (
      <header className="video_overlay__header">
        <h4 className="overlay__title--small">
          <TruncatedText lines={2}>{title}</TruncatedText>
        </h4>
        <Button
          icon={icons.CLOSE}
          onClick={() => {
            onClose();
          }}
        />
      </header>
    );
  }
}

export default VideoOverlayHeader;
