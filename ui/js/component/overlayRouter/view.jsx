import React from "react";
import ShowPage from "page/show";

class OverlayRouter extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { currentPage, params, playingUri, keepPlaying } = this.props;

    const uri = params.uri || playingUri;
    const isPage = currentPage === "show";

    const page = uri && (keepPlaying || isPage)
      ? <ShowPage expanded={isPage} uri={uri} />
      : null;

    return page;
  }
}

export default OverlayRouter;
