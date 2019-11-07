// @flow
import React from 'react';
import * as MODALS from 'constants/modal_types';
import ModalError from 'modal/modalError';
import ModalDownloading from 'modal/modalDownloading';
import ModalAutoGenerateThumbnail from 'modal/modalAutoGenerateThumbnail';
import ModalAutoUpdateDownloaded from 'modal/modalAutoUpdateDownloaded';
import ModalUpgrade from 'modal/modalUpgrade';
import ModalWelcome from 'modal/modalWelcome';
import ModalFirstReward from 'modal/modalFirstReward';
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
import ModalOpenExternalResource from 'modal/modalOpenExternalResource';
import ModalConfirmThumbnailUpload from 'modal/modalConfirmThumbnailUpload';
import ModalWalletEncrypt from 'modal/modalWalletEncrypt';
import ModalWalletDecrypt from 'modal/modalWalletDecrypt';
import ModalWalletUnlock from 'modal/modalWalletUnlock';
import ModalRewardCode from 'modal/modalRewardCode';
import ModalPasswordUnsave from 'modal/modalPasswordUnsave';

type Props = {
  modal: { id: string, modalProps: {} },
  error: { message: string },
};

function ModalRouter(props: Props) {
  const { modal, error } = props;

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
    case MODALS.AUTO_GENERATE_THUMBNAIL:
      return <ModalAutoGenerateThumbnail {...modalProps} />;
    case MODALS.AUTO_UPDATE_DOWNLOADED:
      return <ModalAutoUpdateDownloaded {...modalProps} />;
    case MODALS.ERROR:
      return <ModalError {...modalProps} />;
    case MODALS.FILE_TIMEOUT:
      return <ModalFileTimeout {...modalProps} />;
    case MODALS.WELCOME:
      return <ModalWelcome {...modalProps} />;
    case MODALS.FIRST_REWARD:
      return <ModalFirstReward {...modalProps} />;
    case MODALS.TRANSACTION_FAILED:
      return <ModalTransactionFailed {...modalProps} />;
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
    case MODALS.CONFIRM_EXTERNAL_RESOURCE:
      return <ModalOpenExternalResource {...modalProps} />;
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
    case MODALS.WALLET_PASSWORD_UNSAVE:
      return <ModalPasswordUnsave {...modalProps} />;
    case MODALS.REWARD_GENERATED_CODE:
      return <ModalRewardCode {...modalProps} />;
    default:
      return null;
  }
}

export default ModalRouter;
