import { connect } from 'react-redux';
import {
  makeSelectTitleForUri,
  makeSelectThumbnailForUri,
  makeSelectCoverForUri,
  selectCurrentChannelPage,
  makeSelectMetadataItemForUri,
  doUpdateChannel,
  makeSelectAmountForUri,
  makeSelectClaimForUri,
} from 'lbry-redux';
import ChannelPage from './view';

const select = (state, props) => ({
  title: makeSelectTitleForUri(props.uri)(state),
  thumbnail: makeSelectThumbnailForUri(props.uri)(state),
  cover: makeSelectCoverForUri(props.uri)(state),
  page: selectCurrentChannelPage(state),
  description: makeSelectMetadataItemForUri(props.uri, 'description')(state),
  website: makeSelectMetadataItemForUri(props.uri, 'website_url')(state),
  email: makeSelectMetadataItemForUri(props.uri, 'email')(state),
  tags: makeSelectMetadataItemForUri(props.uri, 'tags')(state),
  locations: makeSelectMetadataItemForUri(props.uri, 'locations')(state),
  languages: makeSelectMetadataItemForUri(props.uri, 'languages')(state),
  amount: makeSelectAmountForUri(props.uri)(state),
  claim: makeSelectClaimForUri(props.uri)(state),
});

const perform = dispatch => ({
  updateChannel: params => dispatch(doUpdateChannel(params)),
});

export default connect(
  select,
  perform
)(ChannelPage);
