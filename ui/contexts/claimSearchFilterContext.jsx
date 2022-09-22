import React from 'react';
import * as CS from 'constants/claim_search';

export const ClaimSearchFilterContext = React.createContext({
  contentTypes: CS.CONTENT_TYPES,
  liftUpTagSearch: false,
  // --Future expansion:
  // durationTypes: CS.DURATION_TYPES,
  // ...
});
