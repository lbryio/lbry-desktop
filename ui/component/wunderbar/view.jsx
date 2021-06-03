// @flow
import * as ICONS from 'constants/icons';
import React from 'react';
import Button from 'component/button';
import { useIsMobile } from 'effects/use-screensize';
import WunderbarSuggestions from 'component/wunderbarSuggestions';

type Props = {
  doOpenMobileSearch: () => void,
  channelsOnly?: boolean,
  noTopSuggestion?: boolean,
  noBottomLinks?: boolean,
  customSelectAction?: (string) => void,
};

export default function WunderBar(props: Props) {
  const { doOpenMobileSearch, channelsOnly, noTopSuggestion, noBottomLinks, customSelectAction } = props;
  const isMobile = useIsMobile();

  return isMobile ? (
    <Button icon={ICONS.SEARCH} className="wunderbar__mobile-search" onClick={() => doOpenMobileSearch()} />
  ) : (
    <WunderbarSuggestions
      channelsOnly={channelsOnly}
      noTopSuggestion={noTopSuggestion}
      noBottomLinks={noBottomLinks}
      customSelectAction={customSelectAction}
    />
  );
}
