// @flow
import React from 'react';
import Button from 'component/button';
import { ENABLE_NO_SOURCE_CLAIMS } from 'config';
import * as CS from 'constants/claim_search';
import * as ICONS from 'constants/icons';
import ClaimListDiscover from 'component/claimListDiscover';
import { useIsMobile, useIsLargeScreen } from 'effects/use-screensize';
import usePersistedState from 'effects/use-persisted-state';
import { getLivestreamUris } from 'util/livestream';
import { resolveLangForClaimSearch } from '../../util/default-languages';

const DEFAULT_LIVESTREAM_TILE_LIMIT = 8;
const SECTION = Object.freeze({ COLLAPSED: 1, EXPANDED: 2 });

function getTileLimit(isLargeScreen, originalSize) {
  return isLargeScreen ? originalSize * (3 / 2) : originalSize;
}

// ****************************************************************************
// ****************************************************************************

type Props = {
  tileLayout: boolean,
  channelIds?: Array<string>,
  activeLivestreams: ?LivestreamInfo,
  doFetchActiveLivestreams: (orderBy: ?Array<string>, lang: ?Array<string>) => void,
  languageSetting?: string,
  searchInLanguage?: boolean,
  langParam?: string | null,
};

export default function LivestreamSection(props: Props) {
  const {
    tileLayout,
    channelIds,
    activeLivestreams,
    doFetchActiveLivestreams,
    languageSetting,
    searchInLanguage,
    langParam,
  } = props;

  const [liveSectionStore, setLiveSectionStore] = usePersistedState('discover:lsSection', SECTION.COLLAPSED);
  const [expandedYPos, setExpandedYPos] = React.useState(null);

  const isMobile = useIsMobile();
  const isLargeScreen = useIsLargeScreen();

  const initialLiveTileLimit = getTileLimit(isLargeScreen, DEFAULT_LIVESTREAM_TILE_LIMIT);
  const [liveSection, setLiveSection] = React.useState(liveSectionStore || SECTION.COLLAPSED);
  const livestreamUris = getLivestreamUris(activeLivestreams, channelIds);
  const liveTilesOverLimit = livestreamUris && livestreamUris.length > initialLiveTileLimit;

  function collapseSection() {
    window.scrollTo(0, 0);
    setLiveSection(SECTION.COLLAPSED);
  }

  React.useEffect(() => {
    // Sync liveSection --> liveSectionStore
    if (liveSection !== liveSectionStore) {
      setLiveSectionStore(liveSection);
    }
  }, [liveSection, setLiveSectionStore, liveSectionStore]);

  React.useEffect(() => {
    // Fetch active livestreams on mount
    const langCsv = resolveLangForClaimSearch(languageSetting, searchInLanguage, langParam);
    const lang = langCsv ? langCsv.split(',') : null;
    doFetchActiveLivestreams(CS.ORDER_BY_NEW_VALUE, lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps, (on mount only)
  }, []);

  React.useEffect(() => {
    // Maintain y-position when expanding livestreams section:
    if (liveSection === SECTION.EXPANDED && expandedYPos !== null) {
      window.scrollTo(0, expandedYPos);
      setExpandedYPos(null);
    }
  }, [liveSection, expandedYPos]);

  if (!livestreamUris || livestreamUris.length === 0) {
    return null;
  }

  if (isMobile) {
    return (
      <div className="livestream-list">
        <ClaimListDiscover
          uris={livestreamUris}
          tileLayout={livestreamUris.length > 1 ? true : tileLayout}
          swipeLayout={livestreamUris.length > 1}
          headerLabel={<div className="section__title">{__('Livestreams')}</div>}
          useSkeletonScreen={false}
          showHeader={false}
          hideFilters
          infiniteScroll={false}
          loading={false}
          showNoSourceClaims={ENABLE_NO_SOURCE_CLAIMS}
        />
      </div>
    );
  }

  return (
    <div className="livestream-list">
      {liveTilesOverLimit && liveSection === SECTION.EXPANDED && (
        <div className="livestream-list--view-more">
          <Button
            label={__('Show less livestreams')}
            button="link"
            iconRight={ICONS.UP}
            className="claim-grid__title--secondary"
            onClick={collapseSection}
          />
        </div>
      )}

      <ClaimListDiscover
        uris={liveSection === SECTION.COLLAPSED ? livestreamUris.slice(0, initialLiveTileLimit) : livestreamUris}
        tileLayout={tileLayout}
        showHeader={false}
        hideFilters
        infiniteScroll={false}
        loading={false}
        showNoSourceClaims={ENABLE_NO_SOURCE_CLAIMS}
      />

      {liveTilesOverLimit && liveSection === SECTION.COLLAPSED && (
        <div className="livestream-list--view-more">
          <Button
            label={__('Show more livestreams')}
            button="link"
            iconRight={ICONS.DOWN}
            className="claim-grid__title--secondary"
            onClick={() => {
              doFetchActiveLivestreams();
              setExpandedYPos(window.scrollY);
              setLiveSection(SECTION.EXPANDED);
            }}
          />
        </div>
      )}

      {liveTilesOverLimit && liveSection === SECTION.EXPANDED && (
        <div className="livestream-list--view-more">
          <Button
            label={__('Show less livestreams')}
            button="link"
            iconRight={ICONS.UP}
            className="claim-grid__title--secondary"
            onClick={collapseSection}
          />
        </div>
      )}
    </div>
  );
}
