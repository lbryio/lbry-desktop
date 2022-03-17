// @flow
import React from 'react';
import Button from 'component/button';
import HelpLink from 'component/common/help-link';
import Icon from 'component/common/icon';
import ClaimList from 'component/claimList';
import { URL, SHARE_DOMAIN_URL } from 'config';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import * as SETTINGS from 'constants/settings';
import { useIsLargeScreen, useIsMediumScreen } from 'effects/use-screensize';

// TODO: recsysFyp will be moved into 'RecSys', so the redux import in a jsx
// violation is just temporary.
import { recsysFyp } from 'redux/actions/search';

// ****************************************************************************
// SectionHeader (TODO: DRY)
// ****************************************************************************

type SectionHeaderProps = {
  title: string,
  navigate?: string,
  icon?: string,
  help?: string,
  onHide?: () => void,
};

const SectionHeader = ({ title, icon = '', help, onHide }: SectionHeaderProps) => {
  const SHARE_DOMAIN = SHARE_DOMAIN_URL || URL;
  return (
    <h1 className="claim-grid__header">
      <Icon className="claim-grid__header-icon" sectionIcon icon={icon} size={20} />
      <span className="claim-grid__title">{title}</span>
      {help}
      <HelpLink href={`${SHARE_DOMAIN}/$/${PAGES.FYP}`} iconSize={24} description={__('Learn more')} />
      <Button button="link" label={__('Hide')} onClick={onHide} className={'ml-m text-s'} />
    </h1>
  );
};

// ****************************************************************************
// RecommendedPersonal
// ****************************************************************************

const VIEW = { ALL_VISIBLE: 0, COLLAPSED: 1, EXPANDED: 2 };

function getSuitablePageSizeForScreen(defaultSize, isLargeScreen, isMediumScreen) {
  return isMediumScreen ? 6 : isLargeScreen ? Math.ceil(defaultSize * (3 / 2)) : defaultSize;
}

type Props = {
  onLoad: (displayed: boolean) => void,
  // --- redux ---
  userId: ?string,
  personalRecommendations: { gid: string, uris: Array<string> },
  hasMembership: boolean,
  hideFyp: boolean,
  doFetchPersonalRecommendations: () => void,
  doSetClientSetting: (key: string, value: any, pushPreferences: boolean) => void,
  doToast: ({ isError?: boolean, message: string }) => void,
};

export default function RecommendedPersonal(props: Props) {
  const {
    onLoad,
    userId,
    personalRecommendations,
    hasMembership,
    hideFyp,
    doFetchPersonalRecommendations,
    doSetClientSetting,
    doToast,
  } = props;
  const [markedGid, setMarkedGid] = React.useState('');
  const [view, setView] = React.useState(VIEW.ALL_VISIBLE);
  const isLargeScreen = useIsLargeScreen();
  const isMediumScreen = useIsMediumScreen();

  const count = personalRecommendations.uris.length;
  const countCollapsed = getSuitablePageSizeForScreen(8, isLargeScreen, isMediumScreen);
  const finalCount = view === VIEW.ALL_VISIBLE ? count : view === VIEW.COLLAPSED ? countCollapsed : count;

  function doHideFyp() {
    doSetClientSetting(SETTINGS.HIDE_FYP, true, true);
    doToast({ message: __('Recommendations hidden; you can re-enable them in Settings.') });
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

  if (hideFyp || !hasMembership || count < 1) {
    return null;
  }

  return (
    <>
      <SectionHeader title={__('Recommended For You')} icon={ICONS.WEB} onHide={doHideFyp} />

      <ClaimList
        tileLayout
        uris={personalRecommendations.uris.slice(0, finalCount)}
        fypId={personalRecommendations.gid}
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
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          />
        </div>
      )}
    </>
  );
}
