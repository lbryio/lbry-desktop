import React from "react";
import Link from "component/link";

class VideoPlayButton extends React.PureComponent {
  componentDidMount() {
    this.keyDownListener = this.onKeyDown.bind(this);
    document.addEventListener("keydown", this.keyDownListener);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyDownListener);
  }

  onKeyDown(event) {
    if (
      "input" !== event.target.tagName.toLowerCase() &&
      "Space" === event.code
    ) {
      event.preventDefault();
      this.renderMedia();
    }
  }

  renderMedia() {
    this.props.play(this.props.uri);
  }

  render() {
    const { isLoading, fileInfo, mediaType } = this.props;

    const disabled = isLoading || fileInfo === undefined;
    const icon =
      ["audio", "video"].indexOf(mediaType) !== -1
        ? "icon-play"
        : "icon-folder-o";

    return (
      <Link
        disabled={disabled}
        className="video__play-button"
        icon={icon}
        onClick={() => this.renderMedia()}
      />
    );
  }
}

export default VideoPlayButton;
