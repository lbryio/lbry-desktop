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
      // check the visible cards
      const cards = cardRow.getElementsByTagName("section");
      var firstVisibleCard = null;
      var firstVisibleIdx = -1;
      for (var i = 0; i < cards.length; i++) {
        if (this.isCardVisible(cards[i], cardRow, false)) {
          firstVisibleCard = cards[i];
          firstVisibleIdx = i;
          break;
        }
      }

      const numDisplayed = this.numDisplayedCards(cardRow);
      const scrollToIdx = firstVisibleIdx - numDisplayed;
      cardRow.scrollLeft = scrollToIdx < 0 ? 0 : cards[scrollToIdx].offsetLeft;
      this.setState({
        canScrollPrevious: cardRow.scrollLeft !== 0,
        canScrollNext: true,
      });
    }
  }

  handleScrollNext() {
    const cardRow = ReactDOM.findDOMNode(this.refs.rowitems);

    // check the visible cards
    const cards = cardRow.getElementsByTagName("section");
    var lastVisibleCard = null;
    var lastVisibleIdx = -1;
    for (var i = 0; i < cards.length; i++) {
      if (this.isCardVisible(cards[i], cardRow, true)) {
        lastVisibleCard = cards[i];
        lastVisibleIdx = i;
      }
    }

    if (lastVisibleCard) {
      const numDisplayed = this.numDisplayedCards(cardRow);
      cardRow.scrollLeft = Math.min(
        lastVisibleCard.offsetLeft,
        cardRow.scrollWidth - cardRow.clientWidth
      );

      // update last visible index after scroll
      lastVisibleIdx += numDisplayed;
      if (lastVisibleIdx > cards.length - 1) {
        lastVisibleIdx = cards.length - 1;
      }

      this.setState({ canScrollPrevious: true });
    }

    if (lastVisibleIdx === cards.length - 1) {
      this.setState({ canScrollNext: false });
    }
  }

  isCardVisible(section, cardRow, partialVisibility) {
    // check if a card is fully or partialy visible in its parent
    const cardRowWidth = cardRow.offsetWidth;
    const cardRowLeft = cardRow.scrollLeft;
    const cardRowEnd = cardRowLeft + cardRow.offsetWidth;
    const sectionLeft = section.offsetLeft - cardRowLeft;
    const sectionEnd = sectionLeft + section.offsetWidth;

    return (
      (sectionLeft >= 0 && sectionEnd <= cardRowWidth) ||
      (((sectionLeft < 0 && sectionEnd > 0) ||
        (sectionLeft > 0 && sectionLeft <= cardRowWidth)) &&
        partialVisibility)
    );
  }

  numDisplayedCards(cardRow) {
    const cards = cardRow.getElementsByTagName("section");
    const cardRowWidth = cardRow.offsetWidth;
    // get the width of the first card and then calculate
    const cardWidth = cards.length > 0 ? cards[0].offsetWidth : 0;

    if (cardWidth > 0) {
      return Math.ceil(cardRowWidth / cardWidth);
    }

    // return a default value of 1 card displayed if the card width couldn't be determined
    return 1;
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
