// @flow
import React, { useState } from 'react';
import Button from 'component/button';
import ClaimList from 'component/claimList';
import ClaimPreviewTile from 'component/claimPreviewTile';
import I18nMessage from 'component/i18nMessage';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import { useIsLargeScreen, useIsMediumScreen } from 'effects/use-screensize';

// TODO: recsysFyp will be moved into 'RecSys', so the redux import in a jsx
// violation is just temporary.
import { recsysFyp } from 'redux/actions/search';

// ****************************************************************************
// RecommendedPersonal
// ****************************************************************************

const VIEW = { ALL_VISIBLE: 0, COLLAPSED: 1, EXPANDED: 2 };

function getSuitablePageSizeForScreen(defaultSize, isLargeScreen, isMediumScreen) {
  // return isMediumScreen ? 6 : isLargeScreen ? Math.ceil(defaultSize * (3 / 2)) : defaultSize;
  return isMediumScreen ? 12 : isLargeScreen ? Math.ceil(24) : 12;
}

type Props = {
  header: React$Node,
  onLoad: (displayed: boolean) => void,
  // --- redux ---
  userId: ?string,
  personalRecommendations: { gid: string, uris: Array<string>, fetched: boolean },
  hasMembership: ?boolean,
  doFetchPersonalRecommendations: () => void,
};

export default function RecommendedPersonal(props: Props) {
  const { header, onLoad, userId, personalRecommendations, hasMembership, doFetchPersonalRecommendations } = props;

  const ref = React.useRef();
  const [markedGid, setMarkedGid] = React.useState('');
  const [view, setView] = React.useState(VIEW.ALL_VISIBLE);
  const isLargeScreen = useIsLargeScreen();
  const isMediumScreen = useIsMediumScreen();

  const count = personalRecommendations.uris.length;
  const countCollapsed = getSuitablePageSizeForScreen(12, isLargeScreen, isMediumScreen);
  const finalCount = view === VIEW.ALL_VISIBLE ? count : view === VIEW.COLLAPSED ? countCollapsed : 36;
  const [hiddenArray, setHiddenArray] = useState([]);

  function onClaimHidden(hiddenUri) {
    let newArray = hiddenArray;
    if (newArray.indexOf(hiddenUri) === -1) {
      newArray.push(hiddenUri);
      setHiddenArray(newArray);
    }
  }
  function getHidden() {
    let hidden = hiddenArray.length;
    for (let uri of hiddenArray) {
      if (personalRecommendations.uris.indexOf(uri) > finalCount) hidden--;
    }
    return hidden;
  }

  // **************************************************************************
  // Effects
  // **************************************************************************

  React.useEffect(() => {
    // -- Update parent's callback request
    if (typeof onLoad === 'function') {
      onLoad(count > 0);
    }
  }, [count, onLoad]);

  React.useEffect(() => {
    // -- Resolve the view state:
    let newView;
    if (count <= countCollapsed) {
      newView = VIEW.ALL_VISIBLE;
    } else {
      if (view === VIEW.ALL_VISIBLE) {
        newView = VIEW.COLLAPSED;
      }
    }

    if (newView && newView !== view) {
      setView(newView);
    }
  }, [count, countCollapsed, view, setView]);

  React.useEffect(() => {
    // -- Mark recommendations when rendered:
    if (userId && markedGid !== personalRecommendations.gid) {
      setMarkedGid(personalRecommendations.gid);
      recsysFyp.markPersonalRecommendations(userId, personalRecommendations.gid);
    }
  }, [userId, markedGid, personalRecommendations.gid]);

  React.useEffect(() => {
    // -- Fetch FYP
    if (hasMembership) {
      doFetchPersonalRecommendations();
    }
  }, [hasMembership, doFetchPersonalRecommendations]);

  // **************************************************************************
  // **************************************************************************

  if (hasMembership === undefined || !personalRecommendations.fetched) {
    return (
      <>
        {header}
        <ul className="claim-grid">
          {new Array(countCollapsed).fill(1).map((x, i) => (
            <ClaimPreviewTile key={i} placeholder />
          ))}
        </ul>
        <div className="livestream-list--view-more" style={{ visibility: 'hidden' }}>
          <Button
            label='"View More" dummy to reduce layout shift'
            button="link"
            className="claim-grid__title--secondary"
          />
        </div>
      </>
    );
  }

  if (!hasMembership) {
    return (
      <div>
        {header}
        <div className="empty empty--centered-tight">
          <I18nMessage
            tokens={{ learn_more: <Button button="link" navigate={`/$/${PAGES.FYP}`} label={__('learn more')} /> }}
          >
            Premium membership required. Become a member, or %learn_more%.
          </I18nMessage>
        </div>
      </div>
    );
  }

  if (count < 1) {
    return (
      <div>
        {header}
        <div className="empty empty--centered-tight">
          <I18nMessage
            tokens={{ learn_more: <Button button="link" navigate={`/$/${PAGES.FYP}`} label={__('Learn More')} /> }}
          >
            No recommendations available at the moment. %learn_more%
          </I18nMessage>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref}>
      {header}

      <ClaimList
        tileLayout
        uris={personalRecommendations.uris.slice(0, finalCount + getHidden())}
        fypId={personalRecommendations.gid}
        onHidden={onClaimHidden}
      />

      {view !== VIEW.ALL_VISIBLE && (
        <div className="livestream-list--view-more">
          <Button
            label={view === VIEW.COLLAPSED ? __('Show more') : __('Show less')}
            button="link"
            iconRight={view === VIEW.COLLAPSED ? ICONS.DOWN : ICONS.UP}
            className="claim-grid__title--secondary"
            onClick={() => {
              if (view === VIEW.COLLAPSED) {
                setView(VIEW.EXPANDED);
              } else {
                setView(VIEW.COLLAPSED);
                if (ref.current) {
                  ref.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' }); // fallback, unlikely.
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
