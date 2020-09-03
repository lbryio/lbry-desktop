import { connect } from 'react-redux';
import { selectYoutubeChannels } from 'redux/selectors/user';
import { doUserFetch } from 'redux/actions/user';
import CreatorDashboardPage from './view';

const select = state => ({
  youtubeChannels: selectYoutubeChannels(state),
});

export default connect(select, {
  doUserFetch,
})(CreatorDashboardPage);
