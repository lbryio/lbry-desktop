import React from "react";
import ModalError from "modal/modalError";
import ModalAuthFailure from "modal/modalAuthFailure";
import ModalDownloading from "modal/modalDownloading";
import ModalInsufficientCredits from "modal/modalInsufficientCredits";
import ModalUpgrade from "modal/modalUpgrade";
import ModalWelcome from "modal/modalWelcome";
import ModalFirstReward from "modal/modalFirstReward";
import * as modals from "constants/modal_types";
import ModalCreditIntro from "modal/modalCreditIntro";

class ModalRouter extends React.PureComponent {
  componentWillMount() {
    this.showTransitionModals(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.showTransitionModals(nextProps);
  }

  showTransitionModals(props) {
    const { modal } = props;

    if (modal) {
      return;
    }

    [
      this.checkShowWelcome.bind(this),
      this.checkShowCreditIntro.bind(this),
    ].find(func => func(props));
  }

  checkShowWelcome(props) {
    const { isWelcomeAcknowledged, openModal, user } = props;
    if (
      !isWelcomeAcknowledged &&
      user &&
      !user.is_reward_approved &&
      !user.is_identity_verified
    ) {
      openModal(modals.WELCOME);
      return true;
    }
  }

  checkShowCreditIntro(props) {
    const {
      page,
      isCreditIntroAcknowledged,
      openModal,
      user,
      showPageCost,
    } = props;

    if (
      !isCreditIntroAcknowledged &&
      user &&
      !user.is_reward_approved &&
      !user.is_identity_verified &&
      ["rewards", "send", "address", "show", "publish", "wallet"].includes(
        page
      ) &&
      (page != "show" || showPageCost > 0)
    ) {
      openModal(modals.CREDIT_INTRO);
      return true;
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
      default:
        return null;
    }
  }
}

export default ModalRouter;
