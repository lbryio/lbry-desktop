// @flow
import React from 'react';
import { withRouter } from 'react-router';
import { lazyImport } from 'util/lazyImport';
import * as MODALS from 'constants/modal_types';
import LoadingBarOneOff from 'component/loadingBarOneOff';

const ModalAffirmPurchase = lazyImport(() => import('modal/modalAffirmPurchase' /* webpackChunkName: "modalAffirmPurchase" */));
const ModalAutoGenerateThumbnail = lazyImport(() => import('modal/modalAutoGenerateThumbnail' /* webpackChunkName: "modalAutoGenerateThumbnail" */));
const ModalAutoUpdateDownloaded = lazyImport(() => import('modal/modalAutoUpdateDownloaded' /* webpackChunkName: "modalAutoUpdateDownloaded" */));
const ModalClaimCollectionAdd = lazyImport(() => import('modal/modalClaimCollectionAdd' /* webpackChunkName: "modalClaimCollectionAdd" */));
const ModalCommentAcknowledgement = lazyImport(() => import('modal/modalCommentAcknowledgement' /* webpackChunkName: "modalCommentAcknowledgement" */));
const ModalConfirmAge = lazyImport(() => import('modal/modalConfirmAge' /* webpackChunkName: "modalConfirmAge" */));
const ModalConfirmThumbnailUpload = lazyImport(() => import('modal/modalConfirmThumbnailUpload' /* webpackChunkName: "modalConfirmThumbnailUpload" */));
const ModalConfirmTransaction = lazyImport(() => import('modal/modalConfirmTransaction' /* webpackChunkName: "modalConfirmTransaction" */));
const ModalDeleteCollection = lazyImport(() => import('modal/modalRemoveCollection' /* webpackChunkName: "modalRemoveCollection" */));
const ModalDownloading = lazyImport(() => import('modal/modalDownloading' /* webpackChunkName: "modalDownloading" */));
const ModalError = lazyImport(() => import('modal/modalError' /* webpackChunkName: "modalError" */));
const ModalFileSelection = lazyImport(() => import('modal/modalFileSelection' /* webpackChunkName: "modalFileSelection" */));
const ModalFileTimeout = lazyImport(() => import('modal/modalFileTimeout' /* webpackChunkName: "modalFileTimeout" */));
const ModalFirstReward = lazyImport(() => import('modal/modalFirstReward' /* webpackChunkName: "modalFirstReward" */));
const ModalFirstSubscription = lazyImport(() => import('modal/modalFirstSubscription' /* webpackChunkName: "modalFirstSubscription" */));
const ModalImageUpload = lazyImport(() => import('modal/modalImageUpload' /* webpackChunkName: "modalImageUpload" */));
const ModalMassTipsUnlock = lazyImport(() => import('modal/modalMassTipUnlock' /* webpackChunkName: "modalMassTipUnlock" */));
const ModalMobileSearch = lazyImport(() => import('modal/modalMobileSearch' /* webpackChunkName: "modalMobileSearch" */));
const ModalOpenExternalResource = lazyImport(() => import('modal/modalOpenExternalResource' /* webpackChunkName: "modalOpenExternalResource" */));
const ModalPasswordUnsave = lazyImport(() => import('modal/modalPasswordUnsave' /* webpackChunkName: "modalPasswordUnsave" */));
const ModalPhoneCollection = lazyImport(() => import('modal/modalPhoneCollection' /* webpackChunkName: "modalPhoneCollection" */));
const ModalPublish = lazyImport(() => import('modal/modalPublish' /* webpackChunkName: "modalPublish" */));
const ModalPublishPreview = lazyImport(() => import('modal/modalPublishPreview' /* webpackChunkName: "modalPublishPreview" */));
const ModalRemoveBtcSwapAddress = lazyImport(() => import('modal/modalRemoveBtcSwapAddress' /* webpackChunkName: "modalRemoveBtcSwapAddress" */));
const ModalRemoveCard = lazyImport(() => import('modal/modalRemoveCard' /* webpackChunkName: "modalRemoveCard" */));
const ModalRemoveFile = lazyImport(() => import('modal/modalRemoveFile' /* webpackChunkName: "modalRemoveFile" */));
const ModalRevokeClaim = lazyImport(() => import('modal/modalRevokeClaim' /* webpackChunkName: "modalRevokeClaim" */));
const ModalRewardCode = lazyImport(() => import('modal/modalRewardCode' /* webpackChunkName: "modalRewardCode" */));
const ModalSendTip = lazyImport(() => import('modal/modalSendTip' /* webpackChunkName: "modalSendTip" */));
const ModalSetReferrer = lazyImport(() => import('modal/modalSetReferrer' /* webpackChunkName: "modalSetReferrer" */));
const ModalSignOut = lazyImport(() => import('modal/modalSignOut' /* webpackChunkName: "modalSignOut" */));
const ModalSocialShare = lazyImport(() => import('modal/modalSocialShare' /* webpackChunkName: "modalSocialShare" */));
const ModalSupportsLiquidate = lazyImport(() => import('modal/modalSupportsLiquidate' /* webpackChunkName: "modalSupportsLiquidate" */));
const ModalSyncEnable = lazyImport(() => import('modal/modalSyncEnable' /* webpackChunkName: "modalSyncEnable" */));
const ModalTransactionFailed = lazyImport(() => import('modal/modalTransactionFailed' /* webpackChunkName: "modalTransactionFailed" */));
const ModalUpgrade = lazyImport(() => import('modal/modalUpgrade' /* webpackChunkName: "modalUpgrade" */));
const ModalViewImage = lazyImport(() => import('modal/modalViewImage' /* webpackChunkName: "modalViewImage" */));
const ModalWalletDecrypt = lazyImport(() => import('modal/modalWalletDecrypt' /* webpackChunkName: "modalWalletDecrypt" */));
const ModalWalletEncrypt = lazyImport(() => import('modal/modalWalletEncrypt' /* webpackChunkName: "modalWalletEncrypt" */));
const ModalWalletUnlock = lazyImport(() => import('modal/modalWalletUnlock' /* webpackChunkName: "modalWalletUnlock" */));
const ModalYoutubeWelcome = lazyImport(() => import('modal/modalYoutubeWelcome' /* webpackChunkName: "modalYoutubeWelcome" */));

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

  function getModal(id) {
    switch (id) {
      case MODALS.UPGRADE:
        return ModalUpgrade;
      case MODALS.DOWNLOADING:
        return ModalDownloading;
      case MODALS.AUTO_GENERATE_THUMBNAIL:
        return ModalAutoGenerateThumbnail;
      case MODALS.AUTO_UPDATE_DOWNLOADED:
        return ModalAutoUpdateDownloaded;
      case MODALS.ERROR:
        return ModalError;
      case MODALS.FILE_TIMEOUT:
        return ModalFileTimeout;
      case MODALS.FIRST_REWARD:
        return ModalFirstReward;
      case MODALS.TRANSACTION_FAILED:
        return ModalTransactionFailed;
      case MODALS.CONFIRM_FILE_REMOVE:
        return ModalRemoveFile;
      case MODALS.AFFIRM_PURCHASE:
        return ModalAffirmPurchase;
      case MODALS.CONFIRM_CLAIM_REVOKE:
        return ModalRevokeClaim;
      case MODALS.PHONE_COLLECTION:
        return ModalPhoneCollection;
      case MODALS.FIRST_SUBSCRIPTION:
        return ModalFirstSubscription;
      case MODALS.SEND_TIP:
        return ModalSendTip;
      case MODALS.SOCIAL_SHARE:
        return ModalSocialShare;
      case MODALS.PUBLISH:
        return ModalPublish;
      case MODALS.PUBLISH_PREVIEW:
        return ModalPublishPreview;
      case MODALS.CONFIRM_EXTERNAL_RESOURCE:
        return ModalOpenExternalResource;
      case MODALS.CONFIRM_TRANSACTION:
        return ModalConfirmTransaction;
      case MODALS.CONFIRM_THUMBNAIL_UPLOAD:
        return ModalConfirmThumbnailUpload;
      case MODALS.WALLET_ENCRYPT:
        return ModalWalletEncrypt;
      case MODALS.WALLET_DECRYPT:
        return ModalWalletDecrypt;
      case MODALS.WALLET_UNLOCK:
        return ModalWalletUnlock;
      case MODALS.WALLET_PASSWORD_UNSAVE:
        return ModalPasswordUnsave;
      case MODALS.REWARD_GENERATED_CODE:
        return ModalRewardCode;
      case MODALS.COMMENT_ACKNOWEDGEMENT:
        return ModalCommentAcknowledgement;
      case MODALS.YOUTUBE_WELCOME:
        return ModalYoutubeWelcome;
      case MODALS.SET_REFERRER:
        return ModalSetReferrer;
      case MODALS.SIGN_OUT:
        return ModalSignOut;
      case MODALS.CONFIRM_AGE:
        return ModalConfirmAge;
      case MODALS.FILE_SELECTION:
        return ModalFileSelection;
      case MODALS.LIQUIDATE_SUPPORTS:
        return ModalSupportsLiquidate;
      case MODALS.IMAGE_UPLOAD:
        return ModalImageUpload;
      case MODALS.SYNC_ENABLE:
        return ModalSyncEnable;
      case MODALS.MOBILE_SEARCH:
        return ModalMobileSearch;
      case MODALS.VIEW_IMAGE:
        return ModalViewImage;
      case MODALS.MASS_TIP_UNLOCK:
        return ModalMassTipsUnlock;
      case MODALS.CONFIRM_REMOVE_BTC_SWAP_ADDRESS:
        return ModalRemoveBtcSwapAddress;
      case MODALS.COLLECTION_ADD:
        return ModalClaimCollectionAdd;
      case MODALS.COLLECTION_DELETE:
        return ModalDeleteCollection;
      case MODALS.CONFIRM_REMOVE_CARD:
        return ModalRemoveCard;
      default:
        return null;
    }
  }

  const { id, modalProps } = modal;
  const SelectedModal = getModal(id);

  if (SelectedModal === null) {
    return null;
  }

  return (
    <React.Suspense fallback={<LoadingBarOneOff />}>
      <SelectedModal {...modalProps} />
    </React.Suspense>
  );
}

export default withRouter(ModalRouter);
