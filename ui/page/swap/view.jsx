// @flow
import React from 'react';
import Page from 'component/page';
import LbcSymbol from 'component/common/lbc-symbol';

type Props = {};

export default function SwapPage(props: Props) {
  return (
    <Page
      noSideNavigation
      className="main--buy"
      backout={{
        backoutLabel: __('Done'),
        title: (
          <>
            <LbcSymbol prefix={__('Swap')} size={28} />
          </>
        ),
      }}
    />
  );
}
