import React from 'react';
import { MODALS } from 'lbry-redux';
import ModalError from 'modal/modalError';
import ModalAuthFailure from 'modal/modalAuthFailure';
import ModalDownloading from 'modal/modalDownloading';
import ModalAutoUpdateDownloaded from 'modal/modalAutoUpdateDownloaded';
import ModalAutoUpdateConfirm from 'modal/modalAutoUpdateConfirm';
import ModalUpgrade from 'modal/modalUpgrade';
import ModalWelcome from 'modal/modalWelcome';
import ModalFirstReward from 'modal/modalFirstReward';
import ModalRewardApprovalRequired from 'modal/modalRewardApprovalRequired';
import ModalCreditIntro from 'modal/modalCreditIntro';
import ModalRemoveFile from 'modal/modalRemoveFile';
import ModalTransactionFailed from 'modal/modalTransactionFailed';
import ModalFileTimeout from 'modal/modalFileTimeout';
import ModalAffirmPurchase from 'modal/modalAffirmPurchase';
import ModalRevokeClaim from 'modal/modalRevokeClaim';
import ModalEmailCollection from 'modal/modalEmailCollection';
import ModalPhoneCollection from 'modal/modalPhoneCollection';
import ModalFirstSubscription from 'modal/modalFirstSubscription';
import ModalConfirmTransaction from 'modal/modalConfirmTransaction';
import ModalSocialShare from 'modal/modalSocialShare';
import ModalSendTip from 'modal/modalSendTip';
import ModalPublish from 'modal/modalPublish';
import ModalOpenExternalLink from 'modal/modalOpenExternalLink';
import ModalConfirmThumbnailUpload from 'modal/modalConfirmThumbnailUpload';
import ModalWalletEncrypt from 'modal/modalWalletEncrypt';
import ModalWalletDecrypt from 'modal/modalWalletDecrypt';
import ModalWalletUnlock from 'modal/modalWalletUnlock';

type Props = {
  modal: string,
};

class ModalRouter extends React.PureComponent<Props> {
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
      this.checkShowEmail,
      this.checkShowCreditIntro,
    ].reduce((acc, func) => (!acc ? func.bind(this)(props) : acc), false);

    if (
      transitionModal &&
      (transitionModal !== this.state.lastTransitionModal || page !== this.state.lastTransitionPage)
    ) {
      openModal({ id: transitionModal });
      this.setState({
        lastTransitionModal: transitionModal,
        lastTransitionPage: page,
      });
    }
  }

  checkShowWelcome(props) {
    const { isWelcomeAcknowledged, user } = props;
    if (!isWelcomeAcknowledged && user && !user.is_reward_approved && !user.is_identity_verified) {
      return MODALS.WELCOME;
    }
  }

  checkShowEmail(props) {
    const { isEmailCollectionAcknowledged, isVerificationCandidate, user } = props;
    if (
      !isEmailCollectionAcknowledged &&
      isVerificationCandidate &&
      user &&
      !user.has_verified_email
    ) {
      return MODALS.EMAIL_COLLECTION;
    }
  }

  checkShowCreditIntro(props) {
    const { balance, page, isCreditIntroAcknowledged } = props;

    if (
      balance === 0 &&
      !isCreditIntroAcknowledged &&
      (['send', 'publish'].includes(page) || this.isPaidShowPage(props))
    ) {
      return MODALS.INSUFFICIENT_CREDITS;
    }
  }

  isPaidShowPage(props) {
    const { page, showPageCost } = props;
    return page === 'show' && showPageCost > 0;
  }

  render() {
    const { notification, notificationProps } = this.props;

    if (!notification) {
      return null;
    }

    if (notification.error) {
      return <ModalError {...notification} {...notificationProps} />;
    }

    switch (notification.id) {
      case MODALS.UPGRADE:
        return <ModalUpgrade {...notificationProps} />;
      case MODALS.DOWNLOADING:
        return <ModalDownloading {...notificationProps} />;
      case MODALS.AUTO_UPDATE_DOWNLOADED:
        return <ModalAutoUpdateDownloaded {...notificationProps} />;
      case MODALS.AUTO_UPDATE_CONFIRM:
        return <ModalAutoUpdateConfirm {...notificationProps} />;
      case MODALS.ERROR:
        return <ModalError {...notificationProps} />;
      case MODALS.FILE_TIMEOUT:
        return <ModalFileTimeout {...notificationProps} />;
      case MODALS.INSUFFICIENT_CREDITS:
        return <ModalCreditIntro {...notificationProps} />;
      case MODALS.WELCOME:
        return <ModalWelcome {...notificationProps} />;
      case MODALS.FIRST_REWARD:
        return <ModalFirstReward {...notificationProps} />;
      case MODALS.AUTHENTICATION_FAILURE:
        return <ModalAuthFailure {...notificationProps} />;
      case MODALS.TRANSACTION_FAILED:
        return <ModalTransactionFailed {...notificationProps} />;
      case MODALS.REWARD_APPROVAL_REQUIRED:
        return <ModalRewardApprovalRequired {...notificationProps} />;
      case MODALS.CONFIRM_FILE_REMOVE:
        return <ModalRemoveFile {...notificationProps} />;
      case MODALS.AFFIRM_PURCHASE:
        return <ModalAffirmPurchase {...notificationProps} />;
      case MODALS.CONFIRM_CLAIM_REVOKE:
        return <ModalRevokeClaim {...notificationProps} />;
      case MODALS.PHONE_COLLECTION:
        return <ModalPhoneCollection {...notificationProps} />;
      case MODALS.EMAIL_COLLECTION:
        return <ModalEmailCollection {...notificationProps} />;
      case MODALS.FIRST_SUBSCRIPTION:
        return <ModalFirstSubscription {...notificationProps} />;
      case MODALS.SEND_TIP:
        return <ModalSendTip {...notificationProps} />;
      case MODALS.SOCIAL_SHARE:
        return <ModalSocialShare {...notificationProps} />;
      case MODALS.PUBLISH:
        return <ModalPublish {...notificationProps} />;
      case MODALS.CONFIRM_EXTERNAL_LINK:
        return <ModalOpenExternalLink {...notificationProps} />;
      case MODALS.CONFIRM_TRANSACTION:
        return <ModalConfirmTransaction {...notificationProps} />;
      case MODALS.CONFIRM_THUMBNAIL_UPLOAD:
        return <ModalConfirmThumbnailUpload {...notificationProps} />;
      case MODALS.WALLET_ENCRYPT:
        return <ModalWalletEncrypt {...notificationProps} />;
      case MODALS.WALLET_DECRYPT:
        return <ModalWalletDecrypt {...notificationProps} />;
      case MODALS.WALLET_UNLOCK:
        return <ModalWalletUnlock {...notificationProps} />;
      default:
        return null;
    }
  }
}

export default ModalRouter;
