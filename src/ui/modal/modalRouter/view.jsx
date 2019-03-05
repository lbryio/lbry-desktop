// @flow
import React from 'react';
import * as MODALS from 'constants/modal_types';
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
import ModalRewardCode from 'modal/modalRewardCode';

type Props = {
  modal: { id: string, modalProps: {} },
  error: { message: string },
  openModal: string => void,
  page: string,
  isWelcomeAcknowledged: boolean,
  isEmailCollectionAcknowledged: boolean,
  isVerificationCandidate: boolean,
  isCreditIntroAcknowledged: boolean,
  balance: number,
  showPageCost: number,
  user: {
    is_reward_approved: boolean,
    is_identity_verified: boolean,
    has_verified_email: boolean,
  },
};

type State = {
  lastTransitionModal: ?string,
  lastTransitionPage: ?string,
};

class ModalRouter extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      lastTransitionModal: null,
      lastTransitionPage: null,
    };
  }

  componentWillMount() {
    this.showTransitionModals(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.showTransitionModals(nextProps);
  }

  showTransitionModals(props: Props) {
    const { modal, openModal, page } = props;

    if (modal) {
      return;
    }

    const transitionModal = [this.checkShowCreditIntro].reduce(
      (acc, func) => (!acc ? func.bind(this)(props) : acc),
      false
    );

    if (
      transitionModal &&
      (transitionModal !== this.state.lastTransitionModal || page !== this.state.lastTransitionPage)
    ) {
      openModal(transitionModal);
      this.setState({
        lastTransitionModal: transitionModal,
        lastTransitionPage: page,
      });
    }
  }

  checkShowCreditIntro(props: Props) {
    const { balance, page, isCreditIntroAcknowledged } = props;

    if (
      balance === 0 &&
      !isCreditIntroAcknowledged &&
      (['send', 'publish'].includes(page) || this.isPaidShowPage(props))
    ) {
      return MODALS.INSUFFICIENT_CREDITS;
    }

    return undefined;
  }

  isPaidShowPage(props: Props) {
    const { page, showPageCost } = props;
    return page === 'show' && showPageCost > 0;
  }

  render() {
    const { modal, error } = this.props;

    if (error) {
      return <ModalError {...error} />;
    }

    if (!modal) {
      return null;
    }

    const { id, modalProps } = modal;

    switch (id) {
      case MODALS.UPGRADE:
        return <ModalUpgrade {...modalProps} />;
      case MODALS.DOWNLOADING:
        return <ModalDownloading {...modalProps} />;
      case MODALS.AUTO_UPDATE_DOWNLOADED:
        return <ModalAutoUpdateDownloaded {...modalProps} />;
      case MODALS.AUTO_UPDATE_CONFIRM:
        return <ModalAutoUpdateConfirm {...modalProps} />;
      case MODALS.ERROR:
        return <ModalError {...modalProps} />;
      case MODALS.FILE_TIMEOUT:
        return <ModalFileTimeout {...modalProps} />;
      case MODALS.INSUFFICIENT_CREDITS:
        return <ModalCreditIntro {...modalProps} />;
      case MODALS.WELCOME:
        return <ModalWelcome {...modalProps} />;
      case MODALS.FIRST_REWARD:
        return <ModalFirstReward {...modalProps} />;
      case MODALS.AUTHENTICATION_FAILURE:
        return <ModalAuthFailure {...modalProps} />;
      case MODALS.TRANSACTION_FAILED:
        return <ModalTransactionFailed {...modalProps} />;
      case MODALS.REWARD_APPROVAL_REQUIRED:
        return <ModalRewardApprovalRequired {...modalProps} />;
      case MODALS.CONFIRM_FILE_REMOVE:
        return <ModalRemoveFile {...modalProps} />;
      case MODALS.AFFIRM_PURCHASE:
        return <ModalAffirmPurchase {...modalProps} />;
      case MODALS.CONFIRM_CLAIM_REVOKE:
        return <ModalRevokeClaim {...modalProps} />;
      case MODALS.PHONE_COLLECTION:
        return <ModalPhoneCollection {...modalProps} />;
      case MODALS.FIRST_SUBSCRIPTION:
        return <ModalFirstSubscription {...modalProps} />;
      case MODALS.SEND_TIP:
        return <ModalSendTip {...modalProps} />;
      case MODALS.SOCIAL_SHARE:
        return <ModalSocialShare {...modalProps} />;
      case MODALS.PUBLISH:
        return <ModalPublish {...modalProps} />;
      case MODALS.CONFIRM_EXTERNAL_LINK:
        return <ModalOpenExternalLink {...modalProps} />;
      case MODALS.CONFIRM_TRANSACTION:
        return <ModalConfirmTransaction {...modalProps} />;
      case MODALS.CONFIRM_THUMBNAIL_UPLOAD:
        return <ModalConfirmThumbnailUpload {...modalProps} />;
      case MODALS.WALLET_ENCRYPT:
        return <ModalWalletEncrypt {...modalProps} />;
      case MODALS.WALLET_DECRYPT:
        return <ModalWalletDecrypt {...modalProps} />;
      case MODALS.WALLET_UNLOCK:
        return <ModalWalletUnlock {...modalProps} />;
      case MODALS.REWARD_GENERATED_CODE:
        return <ModalRewardCode {...modalProps} />;
      default:
        return null;
    }
  }
}

export default ModalRouter;
