import React from "react";
import ShowPage from "page/show";

class OverlayRouter extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { currentPage } = this.props;

    const isPage = currentPage === "show";

    if (isPage) {
    }
  }

  render() {
    const {
      currentPage,
      params,
      mediaExpand,
      minimizeMedia,
      expandMedia,
      playingUri,
      keepPlaying,
    } = this.props;

    const pageUri = params.uri;

    const isPage = currentPage === "show";

    const uri = pageUri || playingUri;

    const page = uri && (keepPlaying || isPage || playingUri)
      ? <ShowPage
          expanded={playingUri && !isPage ? false : mediaExpand}
          uri={uri}
          expand={expandMedia}
          minimize={minimizeMedia}
        />
      : null;

    return page;
  }
}

export default OverlayRouter;
