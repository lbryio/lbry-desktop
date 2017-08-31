import React from "react";
import ModalError from "modal/modalError";
import ModalAuthFailure from "modal/modalAuthFailure";
import ModalDownloading from "modal/modalDownloading";
import ModalInsufficientCredits from "modal/modalInsufficientCredits";
import ModalUpgrade from "modal/modalUpgrade";
import ModalWelcome from "modal/modalWelcome";
import ModalFirstReward from "modal/modalFirstReward";
import ModalCreditIntro from "modal/modalCreditIntro";
import ModalTransactionFailed from "modal/modalTransactionFailed";
import ModalInsufficientBalance from "modal/modalInsufficientBalance";
import * as modals from "constants/modal_types";

class ModalRouter extends React.PureComponent {
  componentWillMount() {
    this.showWelcome(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.showWelcome(nextProps);
  }

  showWelcome(props) {
    const { isWelcomeAcknowledged, openWelcomeModal, user } = props;

    if (
      !isWelcomeAcknowledged &&
      user &&
      !user.is_reward_approved &&
      !user.is_identity_verified
    ) {
      openWelcomeModal();
    }
  }

  render() {
    const { modal } = this.props;

    switch (modal) {
      case modals.UPGRADE:
        return <ModalUpgrade />;
      case modals.DOWNLOADING:
        return <ModalDownloading />;
      case modals.ERROR:
        return <ModalError />;
      case modals.INSUFFICIENT_CREDITS:
        return <ModalInsufficientCredits />;
      case modals.WELCOME:
        return <ModalWelcome />;
      case modals.FIRST_REWARD:
        return <ModalFirstReward />;
      case modals.AUTHENTICATION_FAILURE:
        return <ModalAuthFailure />;
      case modals.CREDIT_INTRO:
        return <ModalCreditIntro />;
      case modals.TRANSACTION_FAILED:
        return <ModalTransactionFailed />;
      case modals.INSUFFICIENT_BALANCE:
        return <ModalInsufficientBalance />;
      default:
        return null;
    }
  }
}

export default ModalRouter;
