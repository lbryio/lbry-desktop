import React from "react";
import ModalError from "modal/modalError";
import ModalAuthFailure from "modal/modalAuthFailure";
import ModalDownloading from "modal/modalDownloading";
import ModalInsufficientCredits from "modal/modalInsufficientCredits";
import ModalUpgrade from "modal/modalUpgrade";
import ModalWelcome from "modal/modalWelcome";
import ModalFirstReward from "modal/modalFirstReward";
import ModalRewardApprovalRequired from "modal/modalRewardApprovalRequired";
import ModalCreditIntro from "modal/modalCreditIntro";
import ModalRemoveFile from "modal/modalRemoveFile";
import ModalTransactionFailed from "modal/modalTransactionFailed";
import ModalInsufficientBalance from "modal/modalInsufficientBalance";
import ModalFileTimeout from "modal/modalFileTimeout";
import ModalAffirmPurchase from "modal/modalAffirmPurchase";
import * as modals from "constants/modal_types";

class ModalRouter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      lastTransitionModal: null,
      lastTransitionPage: null,
    };
  }

  componentWillMount() {
    this.showTransitionModals(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.showTransitionModals(nextProps);
  }

  showTransitionModals(props) {
    const { modal, modalProps, openModal, page } = props;

    if (modal) {
      return;
    }

    const transitionModal = [
      this.checkShowWelcome,
      this.checkShowCreditIntro,
      this.checkShowInsufficientCredits,
    ].reduce((acc, func) => {
      return !acc ? func.bind(this)(props) : acc;
    }, false);

    if (
      transitionModal &&
      (transitionModal != this.state.lastTransitionModal ||
        page != this.state.lastTransitionPage)
    ) {
      openModal(transitionModal);
      this.setState({
        lastTransitionModal: transitionModal,
        lastTransitionPage: page,
      });
    }
  }

  checkShowWelcome(props) {
    const { isWelcomeAcknowledged, user } = props;
    if (
      !isWelcomeAcknowledged &&
      user &&
      !user.is_reward_approved &&
      !user.is_identity_verified
    ) {
      return modals.WELCOME;
    }
  }

  checkShowCreditIntro(props) {
    const { page, isCreditIntroAcknowledged, user } = props;

    if (
      !isCreditIntroAcknowledged &&
      user &&
      !user.is_reward_approved &&
      (["rewards", "send", "receive", "publish", "wallet"].includes(page) ||
        this.isPaidShowPage(props))
    ) {
      return modals.CREDIT_INTRO;
    }
  }

  checkShowInsufficientCredits(props) {
    const { balance, page } = props;

    if (balance <= 0 && ["send", "publish"].includes(page)) {
      return modals.INSUFFICIENT_CREDITS;
    }
  }

  isPaidShowPage(props) {
    const { page, showPageCost } = props;
    return page === "show" && showPageCost > 0;
  }

  render() {
    const { modal, modalProps } = this.props;

    switch (modal) {
      case modals.UPGRADE:
        return <ModalUpgrade {...modalProps} />;
      case modals.DOWNLOADING:
        return <ModalDownloading {...modalProps} />;
      case modals.ERROR:
        return <ModalError {...modalProps} />;
      case modals.FILE_TIMEOUT:
        return <ModalFileTimeout {...modalProps} />;
      case modals.INSUFFICIENT_CREDITS:
        return <ModalInsufficientCredits {...modalProps} />;
      case modals.WELCOME:
        return <ModalWelcome {...modalProps} />;
      case modals.FIRST_REWARD:
        return <ModalFirstReward {...modalProps} />;
      case modals.AUTHENTICATION_FAILURE:
        return <ModalAuthFailure {...modalProps} />;
      case modals.CREDIT_INTRO:
        return <ModalCreditIntro {...modalProps} />;
      case modals.TRANSACTION_FAILED:
        return <ModalTransactionFailed {...modalProps} />;
      case modals.INSUFFICIENT_BALANCE:
        return <ModalInsufficientBalance {...modalProps} />;
      case modals.REWARD_APPROVAL_REQUIRED:
        return <ModalRewardApprovalRequired {...modalProps} />;
      case modals.CONFIRM_FILE_REMOVE:
        return <ModalRemoveFile {...modalProps} />;
      case modals.AFFIRM_PURCHASE:
        return <ModalAffirmPurchase {...modalProps} />;
      default:
        return null;
    }
  }
}

export default ModalRouter;
