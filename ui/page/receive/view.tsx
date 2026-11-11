import React from "react";
import Page from "component/page";
import LbcSymbol from "component/common/lbc-symbol";
import WalletAddress from "component/walletAddress";

type Props = Record<any, any>;

export default function ReceivePage(props: Props) {
  return (
    <Page
      noSideNavigation
      className="main--buy"
      backout={{
        backoutLabel: __("Done"),
        // @ts-expect-error - TS2322 (ts-migration)
        title: (
          <>
            <LbcSymbol prefix={__("Receive")} size={28} />
          </>
        ),
      }}
    >
      <WalletAddress />
    </Page>
  );
}
