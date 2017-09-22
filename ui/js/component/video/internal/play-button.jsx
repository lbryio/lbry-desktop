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
      this.watch();
    }
  }

  watch() {
    this.props.play(this.props.uri);
  }

  render() {
    const { button, label, isLoading, fileInfo, mediaType } = this.props;

    /*
     title={
     isLoading ? "Video is Loading" :
     !costInfo ? "Waiting on cost info..." :
     fileInfo === undefined ? "Waiting on file info..." : ""
     }
     */

    const disabled = isLoading || fileInfo === undefined;
    const icon = ["audio", "video"].indexOf(mediaType) !== -1
      ? "icon-play"
      : "icon-folder-o";

    return (
      <Link
        button={button ? button : null}
        disabled={disabled}
        label={label ? label : ""}
        className="video__play-button"
        icon={icon}
        onClick={() => this.watch()}
      />
    );
  }
}

export default VideoPlayButton;
