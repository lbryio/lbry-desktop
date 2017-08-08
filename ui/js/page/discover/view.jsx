import React from "react";
import ReactDOM from "react-dom";
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

  handleScrollPrevious() {
    const cardRow = ReactDOM.findDOMNode(this.refs.rowitems);
    if (cardRow.scrollLeft > 0) {
      // check the visible cards
      const cards = cardRow.getElementsByTagName("section");
      let firstVisibleCard = null;
      let firstVisibleIdx = -1;
      for (var i = 0; i < cards.length; i++) {
        if (this.isCardVisible(cards[i], cardRow, false)) {
          firstVisibleCard = cards[i];
          firstVisibleIdx = i;
          break;
        }
      }

      const numDisplayed = this.numDisplayedCards(cardRow);
      const scrollToIdx = firstVisibleIdx - numDisplayed;
      const animationCallback = () => {
        this.setState({
          canScrollPrevious: cardRow.scrollLeft !== 0,
          canScrollNext: true,
        });
      };
      this.scrollCardItemsLeftAnimated(
        cardRow,
        scrollToIdx < 0 ? 0 : cards[scrollToIdx].offsetLeft,
        100,
        animationCallback
      );
    }
  }

  handleScrollNext() {
    const cardRow = ReactDOM.findDOMNode(this.refs.rowitems);

    // check the visible cards
    const cards = cardRow.getElementsByTagName("section");
    let lastVisibleCard = null;
    let lastVisibleIdx = -1;
    for (var i = 0; i < cards.length; i++) {
      if (this.isCardVisible(cards[i], cardRow, true)) {
        lastVisibleCard = cards[i];
        lastVisibleIdx = i;
      }
    }

    if (lastVisibleCard) {
      const numDisplayed = this.numDisplayedCards(cardRow);
      const animationCallback = () => {
        // update last visible index after scroll
        for (var i = 0; i < cards.length; i++) {
          if (this.isCardVisible(cards[i], cardRow, true)) {
            lastVisibleIdx = i;
          }
        }

        this.setState({ canScrollPrevious: true });
        if (lastVisibleIdx === cards.length - 1) {
          this.setState({ canScrollNext: false });
        }
      };

      this.scrollCardItemsLeftAnimated(
        cardRow,
        Math.min(
          lastVisibleCard.offsetLeft,
          cardRow.scrollWidth - cardRow.clientWidth
        ),
        100,
        animationCallback
      );
    }
  }

  scrollCardItemsLeftAnimated(cardRow, target, duration, callback) {
    if (!duration || duration <= diff) {
      cardRow.scrollLeft = target;
      if (callback) {
        callback();
      }
      return;
    }

    const component = this;
    const diff = target - cardRow.scrollLeft;
    const tick = diff / duration * 10;
    setTimeout(() => {
      cardRow.scrollLeft = cardRow.scrollLeft + tick;
      if (cardRow.scrollLeft === target) {
        if (callback) {
          callback();
        }
        return;
      }
      component.scrollCardItemsLeftAnimated(
        cardRow,
        target,
        duration - 10,
        callback
      );
    }, 10);
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

  render() {
    const { category, names } = this.props;

    return (
      <div className="card-row card-row--small">
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
        <div className="card-row__scrollhouse">
          {this.state.canScrollPrevious &&
            <div className="card-row__nav card-row__nav--left">
              <a
                className="card-row__scroll-button"
                onClick={this.handleScrollPrevious.bind(this)}
              >
                <Icon icon="icon-chevron-left" />
              </a>
            </div>}
          {this.state.canScrollNext &&
            <div className="card-row__nav card-row__nav--right">
              <a
                className="card-row__scroll-button"
                onClick={this.handleScrollNext.bind(this)}
              >
                <Icon icon="icon-chevron-right" />
              </a>
            </div>}
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
