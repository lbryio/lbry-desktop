import LivestreamList from './view';
import { connect } from 'react-redux';
import { doFetchActiveLivestreams } from 'redux/actions/livestream';
import { selectActiveLivestreams, selectFetchingActiveLivestreams } from 'redux/selectors/livestream';

const select = (state) => ({
  activeLivestreams: selectActiveLivestreams(state),
  fetchingActiveLivestreams: selectFetchingActiveLivestreams(state),
});

const perform = {
  doFetchActiveLivestreams,
};

export default connect(select, perform)(LivestreamList);
