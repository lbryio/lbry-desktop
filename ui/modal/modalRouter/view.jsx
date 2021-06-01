// @flow
import React from 'react';
import { withRouter } from 'react-router';
import * as MODALS from 'constants/modal_types';
import LoadingBarOneOff from 'component/loadingBarOneOff';

const ModalAffirmPurchase = React.lazy(() => import('modal/modalAffirmPurchase' /* webpackChunkName: "modalAffirmPurchase" */));
const ModalAutoGenerateThumbnail = React.lazy(() => import('modal/modalAutoGenerateThumbnail' /* webpackChunkName: "modalAutoGenerateThumbnail" */));
const ModalAutoUpdateDownloaded = React.lazy(() => import('modal/modalAutoUpdateDownloaded' /* webpackChunkName: "modalAutoUpdateDownloaded" */));
const ModalClaimCollectionAdd = React.lazy(() => import('modal/modalClaimCollectionAdd' /* webpackChunkName: "modalClaimCollectionAdd" */));
const ModalCommentAcknowledgement = React.lazy(() => import('modal/modalCommentAcknowledgement' /* webpackChunkName: "modalCommentAcknowledgement" */));
const ModalConfirmAge = React.lazy(() => import('modal/modalConfirmAge' /* webpackChunkName: "modalConfirmAge" */));
const ModalConfirmThumbnailUpload = React.lazy(() => import('modal/modalConfirmThumbnailUpload' /* webpackChunkName: "modalConfirmThumbnailUpload" */));
const ModalConfirmTransaction = React.lazy(() => import('modal/modalConfirmTransaction' /* webpackChunkName: "modalConfirmTransaction" */));
const ModalDeleteCollection = React.lazy(() => import('modal/modalRemoveCollection' /* webpackChunkName: "modalRemoveCollection" */));
const ModalDownloading = React.lazy(() => import('modal/modalDownloading' /* webpackChunkName: "modalDownloading" */));
const ModalError = React.lazy(() => import('modal/modalError' /* webpackChunkName: "modalError" */));
const ModalFileSelection = React.lazy(() => import('modal/modalFileSelection' /* webpackChunkName: "modalFileSelection" */));
const ModalFileTimeout = React.lazy(() => import('modal/modalFileTimeout' /* webpackChunkName: "modalFileTimeout" */));
const ModalFirstReward = React.lazy(() => import('modal/modalFirstReward' /* webpackChunkName: "modalFirstReward" */));
const ModalFirstSubscription = React.lazy(() => import('modal/modalFirstSubscription' /* webpackChunkName: "modalFirstSubscription" */));
const ModalImageUpload = React.lazy(() => import('modal/modalImageUpload' /* webpackChunkName: "modalImageUpload" */));
const ModalMassTipsUnlock = React.lazy(() => import('modal/modalMassTipUnlock' /* webpackChunkName: "modalMassTipUnlock" */));
const ModalMobileSearch = React.lazy(() => import('modal/modalMobileSearch' /* webpackChunkName: "modalMobileSearch" */));
const ModalOpenExternalResource = React.lazy(() => import('modal/modalOpenExternalResource' /* webpackChunkName: "modalOpenExternalResource" */));
const ModalPasswordUnsave = React.lazy(() => import('modal/modalPasswordUnsave' /* webpackChunkName: "modalPasswordUnsave" */));
const ModalPhoneCollection = React.lazy(() => import('modal/modalPhoneCollection' /* webpackChunkName: "modalPhoneCollection" */));
const ModalPublish = React.lazy(() => import('modal/modalPublish' /* webpackChunkName: "modalPublish" */));
const ModalPublishPreview = React.lazy(() => import('modal/modalPublishPreview' /* webpackChunkName: "modalPublishPreview" */));
const ModalRemoveBtcSwapAddress = React.lazy(() => import('modal/modalRemoveBtcSwapAddress' /* webpackChunkName: "modalRemoveBtcSwapAddress" */));
const ModalRemoveFile = React.lazy(() => import('modal/modalRemoveFile' /* webpackChunkName: "modalRemoveFile" */));
const ModalRevokeClaim = React.lazy(() => import('modal/modalRevokeClaim' /* webpackChunkName: "modalRevokeClaim" */));
const ModalRewardCode = React.lazy(() => import('modal/modalRewardCode' /* webpackChunkName: "modalRewardCode" */));
const ModalSendTip = React.lazy(() => import('modal/modalSendTip' /* webpackChunkName: "modalSendTip" */));
const ModalSetReferrer = React.lazy(() => import('modal/modalSetReferrer' /* webpackChunkName: "modalSetReferrer" */));
const ModalSignOut = React.lazy(() => import('modal/modalSignOut' /* webpackChunkName: "modalSignOut" */));
const ModalSocialShare = React.lazy(() => import('modal/modalSocialShare' /* webpackChunkName: "modalSocialShare" */));
const ModalSupportsLiquidate = React.lazy(() => import('modal/modalSupportsLiquidate' /* webpackChunkName: "modalSupportsLiquidate" */));
const ModalSyncEnable = React.lazy(() => import('modal/modalSyncEnable' /* webpackChunkName: "modalSyncEnable" */));
const ModalTransactionFailed = React.lazy(() => import('modal/modalTransactionFailed' /* webpackChunkName: "modalTransactionFailed" */));
const ModalUpgrade = React.lazy(() => import('modal/modalUpgrade' /* webpackChunkName: "modalUpgrade" */));
const ModalViewImage = React.lazy(() => import('modal/modalViewImage' /* webpackChunkName: "modalViewImage" */));
const ModalWalletDecrypt = React.lazy(() => import('modal/modalWalletDecrypt' /* webpackChunkName: "modalWalletDecrypt" */));
const ModalWalletEncrypt = React.lazy(() => import('modal/modalWalletEncrypt' /* webpackChunkName: "modalWalletEncrypt" */));
const ModalWalletUnlock = React.lazy(() => import('modal/modalWalletUnlock' /* webpackChunkName: "modalWalletUnlock" */));
const ModalYoutubeWelcome = React.lazy(() => import('modal/modalYoutubeWelcome' /* webpackChunkName: "modalYoutubeWelcome" */));

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
