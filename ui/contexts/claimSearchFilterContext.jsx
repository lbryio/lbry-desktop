import React from 'react';
import * as CS from 'constants/claim_search';

export const ClaimSearchFilterContext = React.createContext({
  contentTypes: CS.CONTENT_TYPES,
  // --Future expansion:
  // durationTypes: CS.DURATION_TYPES,
  // ...
});
