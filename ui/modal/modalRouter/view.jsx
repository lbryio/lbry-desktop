// @flow
import React from 'react';
import { withRouter } from 'react-router';
import * as MODALS from 'constants/modal_types';
import ModalError from 'modal/modalError';
import ModalDownloading from 'modal/modalDownloading';
import ModalAutoGenerateThumbnail from 'modal/modalAutoGenerateThumbnail';
import ModalAutoUpdateDownloaded from 'modal/modalAutoUpdateDownloaded';
import ModalUpgrade from 'modal/modalUpgrade';
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
import ModalPublishPreview from 'modal/modalPublishPreview';
import ModalOpenExternalResource from 'modal/modalOpenExternalResource';
import ModalConfirmThumbnailUpload from 'modal/modalConfirmThumbnailUpload';
import ModalWalletEncrypt from 'modal/modalWalletEncrypt';
import ModalWalletDecrypt from 'modal/modalWalletDecrypt';
import ModalWalletUnlock from 'modal/modalWalletUnlock';
import ModalRewardCode from 'modal/modalRewardCode';
import ModalPasswordUnsave from 'modal/modalPasswordUnsave';
import ModalCommentAcknowledgement from 'modal/modalCommentAcknowledgement';
import ModalYoutubeWelcome from 'modal/modalYoutubeWelcome';
import ModalSetReferrer from 'modal/modalSetReferrer';
import ModalSignOut from 'modal/modalSignOut';
import ModalSupportsLiquidate from 'modal/modalSupportsLiquidate';
import ModalConfirmAge from 'modal/modalConfirmAge';
import ModalFileSelection from 'modal/modalFileSelection';
import ModalSyncEnable from 'modal/modalSyncEnable';
import ModalImageUpload from 'modal/modalImageUpload';
import ModalMobileSearch from 'modal/modalMobileSearch';
import ModalViewImage from 'modal/modalViewImage';
import ModalMassTipsUnlock from 'modal/modalMassTipUnlock';
import ModalRemoveBtcSwapAddress from 'modal/modalRemoveBtcSwapAddress';
import ModalClaimCollectionAdd from 'modal/modalClaimCollectionAdd';
import ModalDeleteCollection from 'modal/modalRemoveCollection';

type Props = {
  modal: { id: string, modalProps: {} },
  error: { message: string },
  location: { pathname: string },
  hideModal: () => void,
};

function ModalRouter(props: Props) {
  const { modal, error, location, hideModal } = props;
  const { pathname } = location;

  React.useEffect(() => {
    hideModal();
  }, [pathname, hideModal]);

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
    case MODALS.PUBLISH_PREVIEW:
      return <ModalPublishPreview {...modalProps} />;
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
    case MODALS.COMMENT_ACKNOWEDGEMENT:
      return <ModalCommentAcknowledgement {...modalProps} />;
    case MODALS.YOUTUBE_WELCOME:
      return <ModalYoutubeWelcome />;
    case MODALS.SET_REFERRER:
      return <ModalSetReferrer {...modalProps} />;
    case MODALS.SIGN_OUT:
      return <ModalSignOut {...modalProps} />;
    case MODALS.CONFIRM_AGE:
      return <ModalConfirmAge {...modalProps} />;
    case MODALS.FILE_SELECTION:
      return <ModalFileSelection {...modalProps} />;
    case MODALS.LIQUIDATE_SUPPORTS:
      return <ModalSupportsLiquidate {...modalProps} />;
    case MODALS.IMAGE_UPLOAD:
      return <ModalImageUpload {...modalProps} />;
    case MODALS.SYNC_ENABLE:
      return <ModalSyncEnable {...modalProps} />;
    case MODALS.MOBILE_SEARCH:
      return <ModalMobileSearch {...modalProps} />;
    case MODALS.VIEW_IMAGE:
      return <ModalViewImage {...modalProps} />;
    case MODALS.MASS_TIP_UNLOCK:
      return <ModalMassTipsUnlock {...modalProps} />;
    case MODALS.CONFIRM_REMOVE_BTC_SWAP_ADDRESS:
      return <ModalRemoveBtcSwapAddress {...modalProps} />;
    case MODALS.COLLECTION_ADD:
      return <ModalClaimCollectionAdd {...modalProps} />;
    case MODALS.COLLECTION_DELETE:
      return <ModalDeleteCollection {...modalProps} />;
    default:
      return null;
  }
}

export default withRouter(ModalRouter);
