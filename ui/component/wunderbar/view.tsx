import * as ICONS from 'constants/icons';
import React from 'react';
import { useIsMobile } from 'effects/use-screensize';

import Button from 'component/button';
import WunderbarSuggestions from 'component/wunderbarSuggestions';

type Props = {
  doOpenMobileSearch: (arg1?: any) => void,
  channelsOnly?: boolean,
  noTopSuggestion?: boolean,
  noBottomLinks?: boolean,
  customSelectAction?: (arg1: string) => void
};

export default function WunderBar(props: Props) {
  const { doOpenMobileSearch, channelsOnly, noTopSuggestion, noBottomLinks, customSelectAction } = props;
  const isMobile = useIsMobile();

  return isMobile ? (
    <Button icon={ICONS.SEARCH} className="wunderbar__mobile-search" onClick={() => doOpenMobileSearch({ ...props })} />
  ) : (
    <WunderbarSuggestions
      channelsOnly={channelsOnly}
      noTopSuggestion={noTopSuggestion}
      noBottomLinks={noBottomLinks}
      customSelectAction={customSelectAction}
    />
  );
}
