import React from "react";
import ReactDOM from "react-dom";
import lbryio from "lbryio.js";
import lbryuri from "lbryuri";
import FileCard from "component/fileCard";
import { Icon, BusyMessage } from "component/common.js";
import ToolTip from "component/tooltip.js";

class FeaturedCategory extends React.PureComponent {
  componentWillMount() {
    this.setState({
      numItems: this.props.names.length,
      canScrollPrevious: false,
      canScrollNext: true,
    });
  }

  componentDidMount() {
    const prevIcon = ReactDOM.findDOMNode(this.refs.scrollPrevious);
    const nextIcon = ReactDOM.findDOMNode(this.refs.scrollNext);
    this.scrollPreviousHandler = this.handleScrollPrevious.bind(this);
    this.scrollNextHandler = this.handleScrollNext.bind(this);
    prevIcon.addEventListener("click", this.scrollPreviousHandler);
    nextIcon.addEventListener("click", this.scrollNextHandler);
  }

  handleScrollPrevious() {
    const cardRow = ReactDOM.findDOMNode(this.refs.rowitems);
    if (cardRow.scrollLeft > 0) {
      cardRow.scrollLeft = 0;
      this.setState({ canScrollPrevious: false, canScrollNext: true });
    }
  }

  handleScrollNext() {
    const cardRow = ReactDOM.findDOMNode(this.refs.rowitems);

    // check the visible cards
    const cards = cardRow.getElementsByTagName("section");
    var lastVisibleCard = null;
    var lastVisibleIdx = -1;
    for (var i = 0; i < cards.length; i++) {
      if (this.isCardVisible(cards[i], cardRow)) {
        lastVisibleCard = cards[i];
        lastVisibleIdx = i;
      }
    }

    if (lastVisibleCard) {
      cardRow.scrollLeft = Math.min(
        lastVisibleCard.offsetLeft + 16,
        cardRow.scrollWidth - cardRow.clientWidth
      );
      this.setState({ canScrollPrevious: true });
    }
    if (lastVisibleIdx === cards.length - 1) {
      this.setState({ canScrollNext: false });
    }
  }

  isCardVisible(section, cardRow) {
    var cardRowLeft = cardRow.scrollLeft;
    var cardRowEnd = cardRow.offsetWidth;
    var sectionLeft = section.offsetLeft;
    var sectionEnd = sectionLeft + section.offsetWidth;

    return sectionEnd <= cardRowEnd && sectionLeft >= cardRowLeft;
  }

  componentWillUnmount() {
    const prevIcon = ReactDOM.findDOMNode(this.refs.scrollPrevious);
    const nextIcon = ReactDOM.findDOMNode(this.refs.scrollNext);
    prevIcon.removeEventListener("click", this.scrollPreviousHandler);
    nextIcon.removeEventListener("click", this.scrollNextHandler);
  }

  render() {
    const { category, names } = this.props;
    const leftNavClassName =
      "card-row__nav left-nav" +
      (this.state.canScrollPrevious ? " can-scroll" : "");
    const rightNavClassName =
      "card-row__nav right-nav" +
      (this.state.canScrollNext ? " can-scroll" : "");

    return (
      <div className="card-row card-row--small">
        <div className={leftNavClassName}>
          <Icon ref="scrollPrevious" icon="icon-chevron-left" />
        </div>
        <div className={rightNavClassName}>
          <Icon ref="scrollNext" icon="icon-chevron-right" />
        </div>
        <h3 className="card-row__header">
          {category}
          {category &&
            category.match(/^community/i) &&
            <ToolTip
              label={__("What's this?")}
              body={__(
                'Community Content is a public space where anyone can share content with the rest of the LBRY community. Bid on the names "one," "two," "three," "four" and "five" to put your content here!'
              )}
              className="tooltip--header"
            />}
        </h3>
        <div ref="rowitems" className="card-row__items">
          {names &&
            names.map(name =>
              <FileCard
                key={name}
                displayStyle="card"
                uri={lbryuri.normalize(name)}
              />
            )}
        </div>
      </div>
    );
  }
}

class DiscoverPage extends React.PureComponent {
  componentWillMount() {
    this.props.fetchFeaturedUris();
  }

  componentWillUnmount() {
    this.props.cancelResolvingUris();
  }

  render() {
    const { featuredUris, fetchingFeaturedUris } = this.props;
    const hasContent =
      typeof featuredUris === "object" && Object.keys(featuredUris).length,
      failedToLoad = !fetchingFeaturedUris && !hasContent;

    return (
      <main
        className={
          hasContent && fetchingFeaturedUris ? "main--refreshing" : null
        }
      >
        {!hasContent &&
          fetchingFeaturedUris &&
          <BusyMessage message={__("Fetching content")} />}
        {hasContent &&
          Object.keys(featuredUris).map(
            category =>
              featuredUris[category].length
                ? <FeaturedCategory
                    key={category}
                    category={category}
                    names={featuredUris[category]}
                  />
                : ""
          )}
        {failedToLoad &&
          <div className="empty">
            {__("Failed to load landing content.")}
          </div>}
      </main>
    );
  }
}

export default DiscoverPage;
