import { connect } from 'react-redux';
import { doFetchInviteStatus } from 'redux/actions/user';
import {
  selectClaimForUri,
  selectTitleForUri,
  makeSelectTagInClaimOrChannelForUri,
  selectClaimIsNsfwForUri,
} from 'redux/selectors/claims';
import SocialShare from './view';
import { selectUserInviteReferralCode, selectUser, selectUserInviteStatusFetched } from 'redux/selectors/user';
import { selectContentPositionForUri } from 'redux/selectors/content';
import { DISABLE_DOWNLOAD_BUTTON_TAG } from 'constants/tags';

const select = (state, props) => {
  const { uri } = props;

  return {
    claim: selectClaimForUri(state, uri),
    inviteStatusFetched: selectUserInviteStatusFetched(state),
    referralCode: selectUserInviteReferralCode(state),
    user: selectUser(state),
    title: selectTitleForUri(state, uri),
    position: selectContentPositionForUri(state, uri),
    disableDownloadButton: makeSelectTagInClaimOrChannelForUri(uri, DISABLE_DOWNLOAD_BUTTON_TAG)(state),
    isMature: selectClaimIsNsfwForUri(state, uri),
  };
};

const perform = {
  doFetchInviteStatus,
};

export default connect(select, perform)(SocialShare);
