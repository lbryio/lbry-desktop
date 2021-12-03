// @flow
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import { SHOW_ADS, SITE_NAME, SIMPLE_SITE, ENABLE_NO_SOURCE_CLAIMS } from 'config';
import Ads from 'web/component/ads';
import React from 'react';
import Page from 'component/page';
import Button from 'component/button';
import ClaimTilesDiscover from 'component/claimTilesDiscover';
import ClaimPreviewTile from 'component/claimPreviewTile';
import Icon from 'component/common/icon';
import WaitUntilOnPage from 'component/common/wait-until-on-page';
import { GetLinksData } from 'util/buildHomepage';
import { getLivestreamUris } from 'util/livestream';

// @if TARGET='web'
import Pixel from 'web/component/pixel';
import Meme from 'web/component/meme';
// @endif

type Props = {
  authenticated: boolean,
  followedTags: Array<Tag>,
  subscribedChannels: Array<Subscription>,
  showNsfw: boolean,
  homepageData: any,
  activeLivestreams: any,
  doFetchActiveLivestreams: () => void,
};

function HomePage(props: Props) {
  const {
    followedTags,
    subscribedChannels,
    authenticated,
    showNsfw,
    homepageData,
    activeLivestreams,
    doFetchActiveLivestreams,
  } = props;
  const showPersonalizedChannels = (authenticated || !IS_WEB) && subscribedChannels && subscribedChannels.length > 0;
  const showPersonalizedTags = (authenticated || !IS_WEB) && followedTags && followedTags.length > 0;
  const showIndividualTags = showPersonalizedTags && followedTags.length < 5;

  const rowData: Array<RowDataItem> = GetLinksData(
    homepageData,
    true,
    authenticated,
    showPersonalizedChannels,
    showPersonalizedTags,
    subscribedChannels,
    followedTags,
    showIndividualTags,
    showNsfw
  );

  function getRowElements(title, route, link, icon, help, options, index, pinUrls) {
    const tilePlaceholder = (
      <ul className="claim-grid">
        {new Array(options.pageSize || 8).fill(1).map((x, i) => (
          <ClaimPreviewTile showNoSourceClaims={ENABLE_NO_SOURCE_CLAIMS} key={i} placeholder />
        ))}
      </ul>
    );

    const claimTiles = (
      <ClaimTilesDiscover
        {...options}
        showNoSourceClaims={ENABLE_NO_SOURCE_CLAIMS}
        hasSource
        prefixUris={getLivestreamUris(activeLivestreams, options.channelIds)}
        pinUrls={pinUrls}
      />
    );

    return (
      <div key={title} className="claim-grid__wrapper">
        {/* category header */}
        {index !== 0 && title && typeof title === 'string' && (
          <h1 className="claim-grid__header">
            <Button navigate={route || link} button="link">
              {icon && <Icon className="claim-grid__header-icon" sectionIcon icon={icon} size={20} />}
              <span className="claim-grid__title">{__(title)}</span>
              {help}
            </Button>
          </h1>
        )}

        {index === 0 && <>{claimTiles}</>}
        {index !== 0 && (
          <WaitUntilOnPage name={title} placeholder={tilePlaceholder} yOffset={800}>
            {claimTiles}
          </WaitUntilOnPage>
        )}

        {/* view more button */}
        {(route || link) && (
          <Button
            className="claim-grid__title--secondary"
            button="link"
            navigate={route || link}
            iconRight={ICONS.ARROW_RIGHT}
            label={__('View More')}
          />
        )}
      </div>
    );
  }

  React.useEffect(() => {
    doFetchActiveLivestreams();
  }, []);

  // returns true if passed element is fully visible on screen
  function isScrolledIntoView(el) {
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;

    // Only completely visible elements return true:
    const isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;
    return isVisible;
  }

  React.useEffect(() => {
    if (authenticated || !SHOW_ADS) {
      return;
    }

    (async function () {
      // test if adblock is enabled
      let adBlockEnabled = false;
      const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      try {
        await fetch(new Request(googleAdUrl)).catch((_) => {
          adBlockEnabled = true;
        });
      } catch (e) {
        adBlockEnabled = true;
      } finally {
        if (!adBlockEnabled) {
          // select the cards on page
          let cards = document.getElementsByClassName('card claim-preview--tile');

          // eslint-disable-next-line no-inner-declarations
          function checkFlag() {
            if (cards.length === 0) {
              window.setTimeout(checkFlag, 100);
            } else {
              // find the last fully visible card
              let lastCard;

              // width of browser window
              const windowWidth = window.innerWidth;

              // on small screens, grab the second item
              if (windowWidth <= 900) {
                lastCard = cards[1];
              } else {
                // otherwise, get the last fully visible card
                for (const card of cards) {
                  const isFullyVisible = isScrolledIntoView(card);
                  if (!isFullyVisible) break;
                  lastCard = card;
                }
              }

              // clone the last card
              // $FlowFixMe
              const clonedCard = lastCard.cloneNode(true);

              // insert cloned card
              // $FlowFixMe
              lastCard.parentNode.insertBefore(clonedCard, lastCard);

              // delete last card so that it doesn't mess up formatting
              // $FlowFixMe
              // lastCard.remove();

              // change the appearance of the cloned card
              // $FlowFixMe
              clonedCard.querySelector('.claim__menu-button').remove();

              // $FlowFixMe
              clonedCard.querySelector('.truncated-text').innerHTML = __(
                'Hate these? Login to Odysee for an ad free experience'
              );

              // $FlowFixMe
              clonedCard.querySelector('.claim-tile__info').remove();

              // $FlowFixMe
              clonedCard.querySelector('[role="none"]').removeAttribute('href');

              // $FlowFixMe
              clonedCard.querySelector('.claim-tile__header').firstChild.href = '/$/signin';

              // $FlowFixMe
              clonedCard.querySelector('.claim-tile__title').firstChild.removeAttribute('aria-label');

              // $FlowFixMe
              clonedCard.querySelector('.claim-tile__title').firstChild.removeAttribute('title');

              // $FlowFixMe
              clonedCard.querySelector('.claim-tile__header').firstChild.removeAttribute('aria-label');

              // $FlowFixMe
              clonedCard
                .querySelector('.media__thumb')
                .replaceWith(document.getElementsByClassName('homepageAdContainer')[0]);

              // show the homepage ad which is not displayed at first
              document.getElementsByClassName('homepageAdContainer')[0].style.display = 'block';

              // $FlowFixMe
              const imageHeight = window.getComputedStyle(lastCard.querySelector('.media__thumb')).height;
              // $FlowFixMe
              const imageWidth = window.getComputedStyle(lastCard.querySelector('.media__thumb')).width;

              const styles = `#av-container, #AVcontent, #aniBox {
                height: ${imageHeight} !important;
                width: ${imageWidth} !important;
              }`;

              const styleSheet = document.createElement('style');
              styleSheet.type = 'text/css';
              styleSheet.id = 'customAniviewStyling';
              styleSheet.innerText = styles;
              // $FlowFixMe
              document.head.appendChild(styleSheet);
            }
          }
          checkFlag();
        }
      }
    })();
  }, []);

  return (
    <Page fullWidthPage>
      {!SIMPLE_SITE && (authenticated || !IS_WEB) && !subscribedChannels.length && (
        <div className="notice-message">
          <h1 className="section__title">
            {__("%SITE_NAME% is more fun if you're following channels", { SITE_NAME })}
          </h1>
          <p className="section__actions">
            <Button
              button="primary"
              navigate={`/$/${PAGES.CHANNELS_FOLLOWING_DISCOVER}`}
              label={__('Find new channels to follow')}
            />
          </p>
        </div>
      )}
      {/* @if TARGET='web' */}
      {SIMPLE_SITE && <Meme />}
      <Ads type="homepage" />
      {/* @endif */}
      {rowData.map(({ title, route, link, icon, help, pinnedUrls: pinUrls, options = {} }, index) => {
        // add pins here
        return getRowElements(title, route, link, icon, help, options, index, pinUrls);
      })}
      {/* @if TARGET='web' */}
      <Pixel type={'retargeting'} />
      {/* @endif */}
    </Page>
  );
}

export default HomePage;
