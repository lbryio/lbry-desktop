// @flow
import React from 'react';
import { withRouter } from 'react-router';
import * as MODALS from 'constants/modal_types';

import ModalAffirmPurchase from 'modal/modalAffirmPurchase';

import ModalAutoGenerateThumbnail from 'modal/modalAutoGenerateThumbnail';

import ModalAutoUpdateDownloaded from 'modal/modalAutoUpdateDownloaded';

import ModalBlockChannel from 'modal/modalBlockChannel';

import ModalClaimCollectionAdd from 'modal/modalClaimCollectionAdd';

import ModalCommentAcknowledgement from 'modal/modalCommentAcknowledgement';

import ModalConfirmAge from 'modal/modalConfirmAge';
import ModalConfirmThumbnailUpload from 'modal/modalConfirmThumbnailUpload';

import ModalConfirmTransaction from 'modal/modalConfirmTransaction';

import ModalDeleteCollection from 'modal/modalRemoveCollection';

import ModalDownloading from 'modal/modalDownloading';
import ModalError from 'modal/modalError';
import ModalFileSelection from 'modal/modalFileSelection';

import ModalFileTimeout from 'modal/modalFileTimeout';
import ModalFirstReward from 'modal/modalFirstReward';
import ModalFirstSubscription from 'modal/modalFirstSubscription';

import ModalImageUpload from 'modal/modalImageUpload';
import ModalMassTipsUnlock from 'modal/modalMassTipUnlock';

import ModalMobileSearch from 'modal/modalMobileSearch';

import ModalOpenExternalResource from 'modal/modalOpenExternalResource';

import ModalPasswordUnsave from 'modal/modalPasswordUnsave';

import ModalPhoneCollection from 'modal/modalPhoneCollection';

import ModalPublish from 'modal/modalPublish';
import ModalPublishPreview from 'modal/modalPublishPreview';

import ModalRemoveBtcSwapAddress from 'modal/modalRemoveBtcSwapAddress';

import ModalRemoveCard from 'modal/modalRemoveCard';
import ModalRemoveComment from 'modal/modalRemoveComment';

import ModalRemoveFile from 'modal/modalRemoveFile';
import ModalRevokeClaim from 'modal/modalRevokeClaim';
import ModalRewardCode from 'modal/modalRewardCode';
import ModalSendTip from 'modal/modalSendTip';
import ModalRepost from 'modal/modalRepost';
import ModalSetReferrer from 'modal/modalSetReferrer';
import ModalSignOut from 'modal/modalSignOut';
import ModalSocialShare from 'modal/modalSocialShare';
import ModalSupportsLiquidate from 'modal/modalSupportsLiquidate';

import ModalSyncEnable from 'modal/modalSyncEnable';
import ModalTransactionFailed from 'modal/modalTransactionFailed';

import ModalUpgrade from 'modal/modalUpgrade';
import ModalViewImage from 'modal/modalViewImage';
import ModalWalletDecrypt from 'modal/modalWalletDecrypt';

import ModalWalletEncrypt from 'modal/modalWalletEncrypt';

import ModalWalletUnlock from 'modal/modalWalletUnlock';

import ModalYoutubeWelcome from 'modal/modalYoutubeWelcome';

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
      case MODALS.REPOST:
        return ModalRepost;
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
      case MODALS.BLOCK_CHANNEL:
        return ModalBlockChannel;
      case MODALS.COLLECTION_ADD:
        return ModalClaimCollectionAdd;
      case MODALS.COLLECTION_DELETE:
        return ModalDeleteCollection;
      case MODALS.CONFIRM_REMOVE_CARD:
        return ModalRemoveCard;
      case MODALS.CONFIRM_REMOVE_COMMENT:
        return ModalRemoveComment;
      default:
        return null;
    }
  }

  const { id, modalProps } = modal;
  const SelectedModal = getModal(id);

  if (SelectedModal === null) {
    return null;
  }

  return <SelectedModal {...modalProps} />;
}

export default withRouter(ModalRouter);
