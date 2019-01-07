// @flow
import type { Claim } from 'types/claim';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import { normalizeURI } from 'lbry-redux';
import ToolTip from 'component/common/tooltip';
import FileCard from 'component/fileCard';
import Button from 'component/button';
import SubscribeButton from 'component/subscribeButton';
import throttle from 'util/throttle';

type Props = {
  category: string,
  names: ?Array<string>,
  categoryLink: ?string,
  fetching: boolean,
  channelClaims: ?Array<Claim>,
  fetchChannel: string => void,
  obscureNsfw: boolean,
};

type State = {
  canScrollNext: boolean,
  canScrollPrevious: boolean,
};

class CategoryList extends React.PureComponent<Props, State> {
  static defaultProps = {
    categoryLink: '',
  };

  constructor() {
    super();

    this.state = {
      canScrollPrevious: false,
      canScrollNext: true,
    };

    (this: any).handleScrollNext = this.handleScrollNext.bind(this);
    (this: any).handleScrollPrevious = this.handleScrollPrevious.bind(this);
    (this: any).handleArrowButtonsOnScroll = this.handleArrowButtonsOnScroll.bind(this);

    this.scrollWrapper = React.createRef();
  }

  componentDidMount() {
    const { fetching, categoryLink, fetchChannel } = this.props;
    if (!fetching && categoryLink) {
      fetchChannel(categoryLink);
    }

    const scrollWrapper = this.scrollWrapper.current;
    if (scrollWrapper) {
      scrollWrapper.addEventListener('scroll', throttle(this.handleArrowButtonsOnScroll, 500));
    }
  }

  scrollWrapper: { current: null | HTMLUListElement };

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

      scrollWrapper.scrollLeft = newTarget; // eslint-disable-line no-param-reassign

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
        this.handleScroll(scrollTarget);
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
    const { category, categoryLink, names, channelClaims, obscureNsfw } = this.props;
    const { canScrollNext, canScrollPrevious } = this.state;
    const isCommunityTopBids = category.match(/^community/i);
    const showScrollButtons = isCommunityTopBids ? !obscureNsfw : true;

    return (
      <section className="media-group--row">
        <header className="media-group__header">
          <div className="media-group__header-title">
            {categoryLink ? (
              <div className="channel-info__actions">
                <div className="channel-info__actions__group">
                  <Button
                    label={category}
                    navigate="/show"
                    navigateParams={{ uri: categoryLink }}
                  />
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
          <p className="media__message media__message--help">
            {__(
              'The community top bids section is only visible if you allow mature content in the app. You can change your content viewing preferences'
            )}{' '}
            <Button button="link" navigate="/settings" label={__('here')} />.
          </p>
        ) : (
          <ul className="media-scrollhouse" ref={this.scrollWrapper}>
            {names &&
              names.length &&
              names.map(name => (
                <FileCard showSubscribedLogo key={name} uri={normalizeURI(name)} />
              ))}

            {channelClaims &&
              channelClaims.length &&
              channelClaims
                // Only show the first 10 claims, regardless of the amount we have on a channel page
                .slice(0, 10)
                .map(claim => (
                  <FileCard
                    showSubcribedLogo
                    key={claim.claim_id}
                    uri={`lbry://${claim.name}#${claim.claim_id}`}
                  />
                ))}
            {/*
                If there aren't any uris passed in, create an empty array and render placeholder cards
                channelClaims or names are being fetched
              */}
            {!channelClaims &&
              !names &&
              /* eslint-disable react/no-array-index-key */
              new Array(10).fill(1).map((x, i) => <FileCard placeholder key={i} />)
            /* eslint-enable react/no-array-index-key */
            }
          </ul>
        )}
      </section>
    );
  }
}

export default CategoryList;
