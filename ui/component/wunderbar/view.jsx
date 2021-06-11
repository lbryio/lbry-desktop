// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import { useIsMobile } from 'effects/use-screensize';

const Button = React.lazy(() => import('component/button' /* webpackChunkName: "button" */));
const Icon = React.lazy(() => import('component/common/icon' /* webpackChunkName: "icon" */));
const WunderbarSuggestions = React.lazy(() => import('component/wunderbarSuggestions' /* webpackChunkName: "wunderbarSuggestions" */));

type Props = {
  doOpenMobileSearch: (any) => void,
  channelsOnly?: boolean,
  noTopSuggestion?: boolean,
  noBottomLinks?: boolean,
  customSelectAction?: (string) => void,
};

export default function WunderBar(props: Props) {
  const { doOpenMobileSearch, channelsOnly, noTopSuggestion, noBottomLinks, customSelectAction } = props;
  const isMobile = useIsMobile();

  return isMobile ? (
    <React.Suspense fallback={null}>
      <Button icon={ICONS.SEARCH} className="wunderbar__mobile-search" onClick={() => doOpenMobileSearch({ ...props })} />
    </React.Suspense>
  ) : (
    <React.Suspense
      fallback={
        <div className="wunderbar__wrapper wunderbar wunderbar__input" aria-disabled>
          <Icon icon={ICONS.SEARCH} aria-disabled />
        </div>
      }
    >
      <WunderbarSuggestions
        channelsOnly={channelsOnly}
        noTopSuggestion={noTopSuggestion}
        noBottomLinks={noBottomLinks}
        customSelectAction={customSelectAction}
      />
    </React.Suspense>
  );
}
