// @flow
import * as React from 'react';
import { normalizeURI } from 'lbry-redux';
import ToolTip from 'component/common/tooltip';
import FileCard from 'component/fileCard';
import Button from 'component/button';
import * as icons from 'constants/icons';
import type { Claim } from 'types/claim';

type Props = {
  category: string,
  names: Array<string>,
  categoryLink: ?string,
  fetching: boolean,
  channelClaims: Array<Claim>,
  fetchChannel: string => void,
  obscureNsfw: boolean,
};

type State = {
  canScrollNext: boolean,
  canScrollPrevious: boolean,
};

class CategoryList extends React.PureComponent<Props, State> {
  static defaultProps = {
    names: [],
    categoryLink: '',
  };

  constructor() {
    super();

    this.state = {
      canScrollPrevious: false,
      canScrollNext: false,
    };

    (this: any).handleScrollNext = this.handleScrollNext.bind(this);
    (this: any).handleScrollPrevious = this.handleScrollPrevious.bind(this);
    this.rowItems = undefined;
  }

  componentDidMount() {
    const { fetching, categoryLink, fetchChannel } = this.props;
    if (!fetching && categoryLink) {
      fetchChannel(categoryLink);
    }

    const cardRow = this.rowItems;
    if (cardRow) {
      const cards = cardRow.getElementsByTagName('section');
      const lastCard = cards[cards.length - 1];
      const isCompletelyVisible = this.isCardVisible(lastCard);

      if (!isCompletelyVisible) {
        // not sure how we can avoid doing this
        /* eslint-disable react/no-did-mount-set-state */
        this.setState({
          canScrollNext: true,
        });
        /* eslint-enable react/no-did-mount-set-state */
      }
    }
  }

  rowItems: ?HTMLDivElement;

  handleScroll(cardRow: HTMLDivElement, scrollTarget: number) {
    const cards = cardRow.getElementsByTagName('section');
    const animationCallback = () => {
      const firstCard = cards[0];
      const lastCard = cards[cards.length - 1];
      const firstCardVisible = this.isCardVisible(firstCard);
      const lastCardVisible = this.isCardVisible(lastCard);
      this.setState({
        canScrollNext: !lastCardVisible,
        canScrollPrevious: !firstCardVisible,
      });
    };

    const currentScrollLeft = cardRow.scrollLeft;
    const direction = currentScrollLeft > scrollTarget ? 'left' : 'right';
    this.scrollCardsAnimated(cardRow, scrollTarget, direction, animationCallback);
  }

  scrollCardsAnimated = (
    cardRow: HTMLDivElement,
    scrollTarget: number,
    direction: string,
    callback: () => any
  ) => {
    let start;
    const step = timestamp => {
      if (!start) start = timestamp;

      const currentLeftVal = cardRow.scrollLeft;

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

      cardRow.scrollLeft = newTarget; // eslint-disable-line no-param-reassign

      if (shouldContinue) {
        window.requestAnimationFrame(step);
      } else {
        callback();
      }
    };

    window.requestAnimationFrame(step);
  };

  // check if a card is fully visible horizontally
  isCardVisible = (section: HTMLElement) => {
    if (!section) {
      return false;
    }
    const rect = section.getBoundingClientRect();
    const isVisible = rect.left >= 0 && rect.right <= window.innerWidth;
    return isVisible;
  };

  handleScrollNext() {
    const cardRow = this.rowItems;
    if (cardRow) {
      const cards = cardRow.getElementsByTagName('section');

      // loop over items until we find one that is on the screen
      // continue searching until a card isn't fully visible, this is the new target
      let firstFullVisibleCard;
      let firstSemiVisibleCard;

      for (let i = 0; i < cards.length; i += 1) {
        const currentCardVisible = this.isCardVisible(cards[i]);

        if (firstFullVisibleCard && !currentCardVisible) {
          firstSemiVisibleCard = cards[i];
          break;
        } else if (currentCardVisible) {
          [firstFullVisibleCard] = cards;
        }
      }

      if (firstFullVisibleCard && firstSemiVisibleCard) {
        const scrollTarget = firstSemiVisibleCard.offsetLeft - firstFullVisibleCard.offsetLeft;
        this.handleScroll(cardRow, scrollTarget);
      }
    }
  }

  handleScrollPrevious() {
    const cardRow = this.rowItems;
    if (cardRow) {
      const cards = cardRow.getElementsByTagName('section');

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

          this.handleScroll(cardRow, scrollTarget);
          break;
        }
      }
    }
  }

  render() {
    const { category, categoryLink, names, channelClaims, obscureNsfw } = this.props;
    const { canScrollNext, canScrollPrevious } = this.state;

    const isCommunityTopBids = category.match(/^community/i);
    const showScrollButtons = isCommunityTopBids ? !obscureNsfw : true;

    return (
      <div className="card-row">
        <div className="card-row__header">
          <div className="card-row__title">
            {categoryLink ? (
              <Button label={category} navigate="/show" navigateParams={{ uri: categoryLink }} />
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
            <div className="card-row__scroll-btns">
              <Button
                className="btn--arrow"
                disabled={!canScrollPrevious}
                onClick={this.handleScrollPrevious}
                icon={icons.ARROW_LEFT}
              />
              <Button
                className="btn--arrow"
                disabled={!canScrollNext}
                onClick={this.handleScrollNext}
                icon={icons.ARROW_RIGHT}
              />
            </div>
          )}
        </div>
        {obscureNsfw && isCommunityTopBids ? (
          <div className="card-row__message help">
            {__(
              'The community top bids section is only visible if you allow mature content in the app. You can change your content viewing preferences'
            )}{' '}
            <Button button="link" navigate="/settings" label={__('here')} />.
          </div>
        ) : (
          <div
            className="card-row__scrollhouse"
            ref={ref => {
              this.rowItems = ref;
            }}
          >
            {names && names.map(name => <FileCard key={name} uri={normalizeURI(name)} />)}

            {channelClaims &&
              channelClaims.length &&
              channelClaims.map(claim => (
                <FileCard key={claim.claim_id} uri={`lbry://${claim.name}#${claim.claim_id}`} />
              ))}
          </div>
        )}
      </div>
    );
  }
}

export default CategoryList;
