import React from "react";
import { Modal } from "modal/modal";
import LastReleaseChanges from "component/lastReleaseChanges";

const IS_MAC = navigator.userAgent.indexOf("Mac OS X") !== -1;

type Props = {
  downloadUpgrade: () => void;
  skipUpgrade: () => void;
  releaseVersion: string;
};

class ModalUpgrade extends React.PureComponent<Props> {
  render() {
    const { downloadUpgrade, skipUpgrade, releaseVersion } = this.props;

    return (
      <Modal
        className={IS_MAC ? "" : "main-wrapper--scrollbar"}
        // @ts-expect-error - TS2322 - Type '{ children: (string | Element)[]; className: string; isOpen: true; contentLabel: string; title: string; type: string; confirmButtonLabel: string; abortButtonLabel: string; onConfirmed: () => void; onAborted: () => void; }' is not assignable to type 'IntrinsicAttributes & ModalProps'.
        isOpen
        contentLabel={__("Upgrade available")}
        title={__("LBRY leveled up")}
        type="confirm"
        confirmButtonLabel={__("Upgrade")}
        abortButtonLabel={__("Skip")}
        onConfirmed={downloadUpgrade}
        onAborted={skipUpgrade}
      >
        {__("A new version %release_tag% of LBRY is ready for you.", { release_tag: releaseVersion })}
        {/* @ts-expect-error - TS2741 (ts-migration) */}
        <LastReleaseChanges hideReleaseVersion />
      </Modal>
    );
  }
}

export default ModalUpgrade;
