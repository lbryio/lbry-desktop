import * as ICONS from "constants/icons";
import React from "react";
import { Modal } from "modal/modal";
import I18nMessage from "component/i18nMessage";
import Button from "component/button";
import LbcSymbol from "component/common/lbc-symbol";
import Card from "component/common/card";
import { WALLET_CONSOLIDATE_UTXOS } from "component/walletBalance/view";

type Props = {
  doHideModal: () => void;
  tipsBalance: number;
  doTipClaimMass: () => void;
  massClaimingTips: boolean;
  utxoCounts: {
    [key: string]: number;
  };
};

export default function ModalSupportsLiquidate(props: Props) {
  const { doHideModal, doTipClaimMass, massClaimingTips, utxoCounts, tipsBalance } = props;
  const { support: supportCount = 0 } = utxoCounts || {};

  React.useEffect(() => {
    if (!tipsBalance) {
      doHideModal();
    }
  }, [tipsBalance, doHideModal]);

  return (
    // @ts-expect-error - TS2322 - Type '{ children: Element; isOpen: true; contentLabel: string; type: string; confirmButtonLabel: string; onAborted: () => void; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
    <Modal isOpen contentLabel={__("Unlock all tips")} type="card" confirmButtonLabel="done" onAborted={doHideModal}>
      <Card
        icon={ICONS.UNLOCK}
        title={__("Unlock all tips")}
        subtitle={
          <>
            <p>
              {/* @ts-expect-error - TS2745 (ts-migration) */}
              <I18nMessage
                // @ts-expect-error - TS2322 (ts-migration)
                tokens={{
                  lbc: <LbcSymbol />,
                }}
              >
                These %lbc% help your content in search rankings. You can unlock them but that's less fun.
              </I18nMessage>
            </p>
            <p>
              {/* @ts-expect-error - TS2745 (ts-migration) */}
              <I18nMessage
                // @ts-expect-error - TS2322 (ts-migration)
                tokens={{
                  // @ts-expect-error - TS2322 (ts-migration)
                  learn_more: <Button button="link" label={__("Learn More")} href="https://lbry.com/faq/tipping" />,
                }}
              >
                It's usually only worth unlocking what you intend to use immediately. %learn_more%
              </I18nMessage>
            </p>
          </>
        }
        actions={
          <>
            <div className="section__actions">
              <Button
                // @ts-expect-error - TS2322 (ts-migration)
                button="primary"
                onClick={() => doTipClaimMass()}
                disabled={massClaimingTips}
                label={massClaimingTips ? __("Working...") : __("Unlock All")}
              />
            </div>
            {supportCount > WALLET_CONSOLIDATE_UTXOS && (
              <span className="help">{__("You have a lot of tips. This could take some time.")}</span>
            )}
          </>
        }
      />
    </Modal>
  );
}
