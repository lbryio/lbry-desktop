import React from "react";
import Video from "component/video";
import { Icon } from "component/common";

const CloseButton = props =>
  <div className="button-close" onClick={() => props.action()}>
    <Icon icon="icon-times" />
  </div>;

class OverlayMedia extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hide: false,
    };
  }

  onClose() {
    this.setState({ hide: true });
  }

  render() {
    // Test
    // const uri = "lbry://@CasuallyExplained#1f30267438257020f08abf452746a48e53a71ad5/thespectrumofintelligence";

    const Styles = "floating " + (this.state.hide ? "hide" : null);

    return (
      <div className={Styles}>
        {this.props.uri &&
          <Video uri={this.props.uri} autoPlay={true} controls={false} />}
        <CloseButton action={this.onClose.bind(this)} />
      </div>
    );
  }
}

export default OverlayMedia;
