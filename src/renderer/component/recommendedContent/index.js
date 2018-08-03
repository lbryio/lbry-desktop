import * as settings from 'constants/settings';
import { connect } from 'react-redux';
import { makeSelectClaimForUri, doSearch, makeSelectRecommendedContentForUri } from 'lbry-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import RecommendedVideos from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  recommendedContent: makeSelectRecommendedContentForUri(props.uri)(state),
  autoplay: makeSelectClientSetting(settings.AUTOPLAY)(state),
});

const perform = dispatch => ({
  setAutoplay: value => dispatch(doSetClientSetting(settings.AUTOPLAY, value)),
  search: query => dispatch(doSearch(query, 20)),
});

export default connect(
  select,
  perform
)(RecommendedVideos);
