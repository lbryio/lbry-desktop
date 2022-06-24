// @flow
import React from 'react';
import { withRouter } from 'react-router';
import LoadingBarOneOff from 'component/loadingBarOneOff';
import * as MODALS from 'constants/modal_types';
import { lazyImport } from 'util/lazyImport';

// prettier-ignore
const MAP = Object.freeze({
  [MODALS.ANNOUNCEMENTS]: lazyImport(() => import('modal/modalAnnouncements' /* webpackChunkName: "modalAnnouncements" */)),
  [MODALS.AFFIRM_PURCHASE]: lazyImport(() => import('modal/modalAffirmPurchase' /* webpackChunkName: "modalAffirmPurchase" */)),
  [MODALS.AUTO_GENERATE_THUMBNAIL]: lazyImport(() => import('modal/modalAutoGenerateThumbnail' /* webpackChunkName: "modalAutoGenerateThumbnail" */)),
  [MODALS.AUTO_UPDATE_DOWNLOADED]: lazyImport(() => import('modal/modalAutoUpdateDownloaded' /* webpackChunkName: "modalAutoUpdateDownloaded" */)),
  [MODALS.BLOCK_CHANNEL]: lazyImport(() => import('modal/modalBlockChannel' /* webpackChunkName: "modalBlockChannel" */)),
  [MODALS.COLLECTION_ADD]: lazyImport(() => import('modal/modalClaimCollectionAdd' /* webpackChunkName: "modalClaimCollectionAdd" */)),
  [MODALS.COLLECTION_DELETE]: lazyImport(() => import('modal/modalRemoveCollection' /* webpackChunkName: "modalRemoveCollection" */)),
  [MODALS.CONFIRM]: lazyImport(() => import('modal/modalConfirm' /* webpackChunkName: "modalConfirm" */)),
  [MODALS.CONFIRM_AGE]: lazyImport(() => import('modal/modalConfirmAge' /* webpackChunkName: "modalConfirmAge" */)),
  [MODALS.CONFIRM_CLAIM_REVOKE]: lazyImport(() => import('modal/modalRevokeClaim' /* webpackChunkName: "modalRevokeClaim" */)),
  [MODALS.CONFIRM_EXTERNAL_RESOURCE]: lazyImport(() => import('modal/modalOpenExternalResource' /* webpackChunkName: "modalOpenExternalResource" */)),
  [MODALS.CONFIRM_FILE_REMOVE]: lazyImport(() => import('modal/modalRemoveFile' /* webpackChunkName: "modalRemoveFile" */)),
  [MODALS.CONFIRM_ODYSEE_MEMBERSHIP]: lazyImport(() => import('modal/modalConfirmOdyseeMembership' /* webpackChunkName: "modalConfirmOdyseeMembership" */)),
  [MODALS.CONFIRM_REMOVE_CARD]: lazyImport(() => import('modal/modalRemoveCard' /* webpackChunkName: "modalRemoveCard" */)),
  [MODALS.CONFIRM_REMOVE_COMMENT]: lazyImport(() => import('modal/modalRemoveComment' /* webpackChunkName: "modalRemoveComment" */)),
  [MODALS.CONFIRM_THUMBNAIL_UPLOAD]: lazyImport(() => import('modal/modalConfirmThumbnailUpload' /* webpackChunkName: "modalConfirmThumbnailUpload" */)),
  [MODALS.CONFIRM_TRANSACTION]: lazyImport(() => import('modal/modalConfirmTransaction' /* webpackChunkName: "modalConfirmTransaction" */)),
  [MODALS.CUSTOMIZE_HOMEPAGE]: lazyImport(() => import('modal/modalCustomizeHomepage' /* webpackChunkName: "modalCustomizeHomepage" */)),
  [MODALS.DOWNLOADING]: lazyImport(() => import('modal/modalDownloading' /* webpackChunkName: "modalDownloading" */)),
  [MODALS.ERROR]: lazyImport(() => import('modal/modalError' /* webpackChunkName: "modalError" */)),
  [MODALS.FILE_SELECTION]: lazyImport(() => import('modal/modalFileSelection' /* webpackChunkName: "modalFileSelection" */)),
  [MODALS.FILE_TIMEOUT]: lazyImport(() => import('modal/modalFileTimeout' /* webpackChunkName: "modalFileTimeout" */)),
  [MODALS.FIRST_REWARD]: lazyImport(() => import('modal/modalFirstReward' /* webpackChunkName: "modalFirstReward" */)),
  [MODALS.HIDE_RECOMMENDATION]: lazyImport(() => import('modal/modalHideRecommendation' /* webpackChunkName: "modalHideRecommendation" */)),
  [MODALS.IMAGE_UPLOAD]: lazyImport(() => import('modal/modalImageUpload' /* webpackChunkName: "modalImageUpload" */)),
  [MODALS.LIQUIDATE_SUPPORTS]: lazyImport(() => import('modal/modalSupportsLiquidate' /* webpackChunkName: "modalSupportsLiquidate" */)),
  [MODALS.MASS_TIP_UNLOCK]: lazyImport(() => import('modal/modalMassTipUnlock' /* webpackChunkName: "modalMassTipUnlock" */)),
  [MODALS.MEMBERSHIP_SPLASH]: lazyImport(() => import('modal/modalMembershipSplash' /* webpackChunkName: "modalMembershipSplash" */)),
  [MODALS.MIN_CHANNEL_AGE]: lazyImport(() => import('modal/modalMinChannelAge' /* webpackChunkName: "modalMinChannelAge" */)),
  [MODALS.MOBILE_SEARCH]: lazyImport(() => import('modal/modalMobileSearch' /* webpackChunkName: "modalMobileSearch" */)),
  [MODALS.PHONE_COLLECTION]: lazyImport(() => import('modal/modalPhoneCollection' /* webpackChunkName: "modalPhoneCollection" */)),
  [MODALS.PREORDER_CONTENT]: lazyImport(() => import('modal/modalPreorderContent' /* webpackChunkName: "modalPreorderContent" */)),
  [MODALS.PUBLISH]: lazyImport(() => import('modal/modalPublish' /* webpackChunkName: "modalPublish" */)),
  [MODALS.PUBLISH_PREVIEW]: lazyImport(() => import('modal/modalPublishPreview' /* webpackChunkName: "modalPublishPreview" */)),
  [MODALS.REPOST]: lazyImport(() => import('modal/modalRepost' /* webpackChunkName: "modalRepost" */)),
  [MODALS.REWARD_GENERATED_CODE]: lazyImport(() => import('modal/modalRewardCode' /* webpackChunkName: "modalRewardCode" */)),
  [MODALS.SEND_TIP]: lazyImport(() => import('modal/modalSendTip' /* webpackChunkName: "modalSendTip" */)),
  [MODALS.SET_REFERRER]: lazyImport(() => import('modal/modalSetReferrer' /* webpackChunkName: "modalSetReferrer" */)),
  [MODALS.SOCIAL_SHARE]: lazyImport(() => import('modal/modalSocialShare' /* webpackChunkName: "modalSocialShare" */)),
  [MODALS.SYNC_ENABLE]: lazyImport(() => import('modal/modalSyncEnable' /* webpackChunkName: "modalSyncEnable" */)),
  [MODALS.TRANSACTION_FAILED]: lazyImport(() => import('modal/modalTransactionFailed' /* webpackChunkName: "modalTransactionFailed" */)),
  [MODALS.UPGRADE]: lazyImport(() => import('modal/modalUpgrade' /* webpackChunkName: "modalUpgrade" */)),
  [MODALS.VIEW_IMAGE]: lazyImport(() => import('modal/modalViewImage' /* webpackChunkName: "modalViewImage" */)),
  [MODALS.WALLET_DECRYPT]: lazyImport(() => import('modal/modalWalletDecrypt' /* webpackChunkName: "modalWalletDecrypt" */)),
  [MODALS.WALLET_ENCRYPT]: lazyImport(() => import('modal/modalWalletEncrypt' /* webpackChunkName: "modalWalletEncrypt" */)),
  [MODALS.WALLET_PASSWORD_UNSAVE]: lazyImport(() => import('modal/modalPasswordUnsave' /* webpackChunkName: "modalPasswordUnsave" */)),
  [MODALS.WALLET_UNLOCK]: lazyImport(() => import('modal/modalWalletUnlock' /* webpackChunkName: "modalWalletUnlock" */)),
  [MODALS.YOUTUBE_WELCOME]: lazyImport(() => import('modal/modalYoutubeWelcome' /* webpackChunkName: "modalYoutubeWelcome" */)),
});

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
    const ModalError = MAP[MODALS.ERROR];
    return (
      <React.Suspense fallback={<LoadingBarOneOff />}>
        <ModalError {...error} />
      </React.Suspense>
    );
  }

  if (!modal) {
    return null;
  }

  const { id, modalProps } = modal;
  const SelectedModal = MAP[id];

  if (!SelectedModal) {
    return null;
  }

  return (
    <React.Suspense fallback={<LoadingBarOneOff />}>
      <SelectedModal {...modalProps} />
    </React.Suspense>
  );
}

export default withRouter(ModalRouter);
