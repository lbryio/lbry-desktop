import { connect } from 'react-redux';
import {
  selectChannelIsBlocked,
  doToggleBlockChannel,
  makeSelectClaimIsMine,
  makeSelectShortUrlForUri,
  makeSelectPermanentUrlForUri,
} from 'lbry-redux';
import { doToast } from 'redux/actions/notifications';
import BlockButton from './view';

const select = (state, props) => ({
  channelIsBlocked: selectChannelIsBlocked(props.uri)(state),
  claimIsMine: makeSelectClaimIsMine(props.uri)(state),
  shortUrl: makeSelectShortUrlForUri(props.uri)(state),
  permanentUrl: makeSelectPermanentUrlForUri(props.uri)(state),
});

export default connect(select, {
  toggleBlockChannel: doToggleBlockChannel,
  doToast,
})(BlockButton);
