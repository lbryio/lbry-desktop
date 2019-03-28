// @flow
import * as ICONS from 'constants/icons';
import React, { PureComponent, createRef } from 'react';
import { normalizeURI, parseURI } from 'lbry-redux';
import ToolTip from 'component/common/tooltip';
import FileCard from 'component/fileCard';
import Button from 'component/button';
import SubscribeButton from 'component/subscribeButton';
import throttle from 'util/throttle';
import { formatLbryUriForWeb } from 'util/uri';

type Props = {
  category: string,
  categoryLink: ?string,
  fetching: boolean,
  obscureNsfw: boolean,
  currentPageAttributes: { scrollY: number },
  fetchChannel: string => void,
  urisInList: ?Array<string>,
  resolveUris: (Array<string>) => void,
  lazyLoad: boolean, // only fetch rows if they are on the screen
};

type State = {
  canScrollNext: boolean,
  canScrollPrevious: boolean,
};

class CategoryList extends PureComponent<Props, State> {
  static defaultProps = {
    categoryLink: undefined,
    lazyLoad: false,
  };

  scrollWrapper: { current: null | HTMLUListElement };

  constructor() {
    super();

    this.state = {
      canScrollPrevious: false,
      canScrollNext: true,
    };

    (this: any).handleScrollNext = this.handleScrollNext.bind(this);
    (this: any).handleScrollPrevious = this.handleScrollPrevious.bind(this);
    (this: any).handleArrowButtonsOnScroll = this.handleArrowButtonsOnScroll.bind(this);
    // (this: any).handleResolveOnScroll = this.handleResolveOnScroll.bind(this);

    this.scrollWrapper = createRef();
  }

  componentDidMount() {
    const { fetching, categoryLink, fetchChannel, resolveUris, urisInList, lazyLoad } = this.props;
    if (!fetching && categoryLink && (!urisInList || !urisInList.length)) {
      // Only fetch the channels claims if no urisInList are specifically passed in
      // This allows setting a channel link and and passing in a custom list of urisInList (featured content usually works this way)
      fetchChannel(categoryLink);
    }

    const scrollWrapper = this.scrollWrapper.current;
    if (scrollWrapper) {
      scrollWrapper.addEventListener('scroll', throttle(this.handleArrowButtonsOnScroll, 500));

      if (!urisInList) {
        return;
      }

      if (lazyLoad) {
        if (window.innerHeight > scrollWrapper.offsetTop) {
          resolveUris(urisInList);
        }
      } else {
        resolveUris(urisInList);
      }
    }
  }

  // The old lazy loading for home page relied on the navigation reducers copy of the scroll height
  // Keeping it commented out for now to try and find a better way for better TTI on the homepage
  // componentDidUpdate(prevProps: Props) {
  //   const {scrollY: previousScrollY} = prevProps.currentPageAttributes;
  //   const {scrollY} = this.props.currentPageAttributes;

  //   if(scrollY > previousScrollY) {
  //     this.handleResolveOnScroll();
  //   }
  // }

  // handleResolveOnScroll() {
  //   const {
  //     urisInList,
  //     resolveUris,
  //     currentPageAttributes: {scrollY},
  //   } = this.props;

  //   const scrollWrapper = this.scrollWrapper.current;
  //   if(!scrollWrapper) {
  //     return;
  //   }

  //   const shouldResolve = window.innerHeight > scrollWrapper.offsetTop - scrollY;
  //   if(shouldResolve && urisInList) {
  //     resolveUris(urisInList);
  //   }
  // }

  handleArrowButtonsOnScroll() {
    // Determine if the arrow buttons should be disabled
    const scrollWrapper = this.scrollWrapper.current;
    if (scrollWrapper) {
      // firstElementChild and lastElementChild will always exist
      // $FlowFixMe
      const hasHiddenCardToLeft = !this.isCardVisible(scrollWrapper.firstElementChild);
      // $FlowFixMe
      const hasHiddenCardToRight = !this.isCardVisible(scrollWrapper.lastElementChild);

      this.setState({
        canScrollPrevious: hasHiddenCardToLeft,
        canScrollNext: hasHiddenCardToRight,
      });
    }
  }

  handleScroll(scrollTarget: number) {
    const scrollWrapper = this.scrollWrapper.current;
    if (scrollWrapper) {
      const currentScrollLeft = scrollWrapper.scrollLeft;
      const direction = currentScrollLeft > scrollTarget ? 'left' : 'right';
      this.scrollCardsAnimated(scrollWrapper, scrollTarget, direction);
    }
  }

  scrollCardsAnimated = (
    scrollWrapper: HTMLUListElement,
    scrollTarget: number,
    direction: string
  ) => {
    let start;
    const step = timestamp => {
      if (!start) start = timestamp;

      const currentLeftVal = scrollWrapper.scrollLeft;

      let newTarget;
      let shouldContinue;
      let progress = currentLeftVal;

      if (direction === 'right') {
        progress += timestamp - start;
        newTarget = Math.min(progress, scrollTarget);
        shouldContinue = newTarget < scrollTarget;
      } else {
        progress -= timestamp - start;
        newTarget = Math.max(progress, scrollTarget);
        shouldContinue = newTarget > scrollTarget;
      }

      scrollWrapper.scrollLeft = newTarget;

      if (shouldContinue) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  // check if a card is fully visible horizontally
  isCardVisible = (card: HTMLLIElement): boolean => {
    if (!card) {
      return false;
    }
    const scrollWrapper = this.scrollWrapper.current;
    if (scrollWrapper) {
      const rect = card.getBoundingClientRect();
      const isVisible =
        scrollWrapper.scrollLeft < card.offsetLeft &&
        rect.left >= 0 &&
        rect.right <= window.innerWidth;
      return isVisible;
    }

    return false;
  };

  handleScrollNext() {
    const scrollWrapper = this.scrollWrapper.current;
    if (!scrollWrapper) {
      return;
    }

    const cards = scrollWrapper.getElementsByTagName('li');

    // Loop over items until we find one that is visible
    // The card before that (starting from the end) is the new "first" card on the screen

    let previousCard: ?HTMLLIElement;
    for (let i = cards.length - 1; i > 0; i -= 1) {
      const currentCard: HTMLLIElement = cards[i];
      const currentCardVisible = this.isCardVisible(currentCard);

      if (currentCardVisible && previousCard) {
        const scrollTarget = previousCard.offsetLeft;
        this.handleScroll(scrollTarget - cards[0].offsetLeft);
        break;
      }

      previousCard = currentCard;
    }
  }

  handleScrollPrevious() {
    const scrollWrapper = this.scrollWrapper.current;
    if (!scrollWrapper) {
      return;
    }

    const cards = scrollWrapper.getElementsByTagName('li');

    let hasFoundCard;
    let numberOfCardsThatCanFit = 0;

    // loop starting at the end until we find a visible card
    // then count to find how many cards can fit on the screen
    for (let i = cards.length - 1; i >= 0; i -= 1) {
      const currentCard = cards[i];
      const isCurrentCardVisible = this.isCardVisible(currentCard);

      if (isCurrentCardVisible) {
        if (!hasFoundCard) {
          hasFoundCard = true;
        }

        numberOfCardsThatCanFit += 1;
      } else if (hasFoundCard) {
        // this card is off the screen to the left
        // we know how many cards can fit on a screen
        // find the new target and scroll
        const firstCardOffsetLeft = cards[0].offsetLeft;
        const cardIndexToScrollTo = i + 1 - numberOfCardsThatCanFit;
        const newFirstCard = cards[cardIndexToScrollTo];

        let scrollTarget;
        if (newFirstCard) {
          scrollTarget = newFirstCard.offsetLeft;
        } else {
          // more cards can fit on the screen than are currently hidden
          // just scroll to the first card
          scrollTarget = cards[0].offsetLeft;
        }

        scrollTarget -= firstCardOffsetLeft; // to play nice with the margins

        this.handleScroll(scrollTarget);
        break;
      }
    }
  }

  render() {
    const { category, categoryLink, urisInList, obscureNsfw, lazyLoad } = this.props;
    const { canScrollNext, canScrollPrevious } = this.state;
    const isCommunityTopBids = category.match(/^community/i);
    const showScrollButtons = isCommunityTopBids ? !obscureNsfw : true;

    let channelLink;
    if (categoryLink) {
      channelLink = formatLbryUriForWeb(categoryLink);
    }

    return (
      <section className="media-group--row">
        <header className="media-group__header">
          <div className="media-group__header-title">
            {categoryLink ? (
              <div className="channel-info__actions">
                <div className="channel-info__actions__group">
                  <Button label={category} navigate={channelLink} />
                  <SubscribeButton
                    button="alt"
                    showSnackBarOnSubscribe
                    uri={`lbry://${categoryLink}`}
                  />
                </div>
              </div>
            ) : (
              category
            )}
            {isCommunityTopBids && (
              <ToolTip
                direction="top"
                label={__("What's this?")}
                body={__(
                  'Community Content is a public space where anyone can share content with the rest of the LBRY community. Bid on the names from "one" to "ten" to put your content here!'
                )}
              />
            )}
          </div>
          {showScrollButtons && (
            <nav className="media-group__header-navigation">
              <Button
                disabled={!canScrollPrevious}
                onClick={this.handleScrollPrevious}
                icon={ICONS.ARROW_LEFT}
              />
              <Button
                disabled={!canScrollNext}
                onClick={this.handleScrollNext}
                icon={ICONS.ARROW_RIGHT}
              />
            </nav>
          )}
        </header>
        {obscureNsfw && isCommunityTopBids ? (
          <p className="media__message help--warning">
            {__(
              'The community top bids section is only visible if you allow mature content in the app. You can change your content viewing preferences'
            )}{' '}
            <Button button="link" navigate="/$/settings" label={__('here')} />.
          </p>
        ) : (
          <ul className="media-scrollhouse" ref={this.scrollWrapper}>
            {urisInList &&
              urisInList.map(uri => (
                <FileCard
                  placeholder
                  preventResolve={lazyLoad}
                  showSubscribedLogo
                  key={uri}
                  uri={normalizeURI(uri)}
                />
              ))}

            {!urisInList && new Array(10).fill(1).map((x, i) => <FileCard placeholder key={i} />)}
          </ul>
        )}
      </section>
    );
  }
}

export default CategoryList;
