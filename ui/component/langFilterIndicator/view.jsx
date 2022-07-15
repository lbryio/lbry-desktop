// @flow
import React from 'react';
import Button from 'component/button';
import * as ICONS from 'constants/icons';
import * as PAGES from 'constants/pages';
import { SEARCH_IN_LANGUAGE } from 'constants/hashes';

export default function LangFilterIndicator() {
  return (
    <Button
      className="icon--langFilter"
      icon={ICONS.FILTERED_BY_LANG}
      iconSize={20}
      description={__('Search results are being filtered by language. Click here to change the setting.')}
      navigate={`/$/${PAGES.SETTINGS}#${SEARCH_IN_LANGUAGE}`}
    />
  );
}
