import { connect } from 'react-redux';
import {
  selectMyClaimsWithoutChannels,
} from 'redux/selectors/claims';
import { doNavigate } from 'redux/actions/navigation';
import FileListPublished from './view';

const select = state => ({
  claims: selectMyClaimsWithoutChannels(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(select, perform)(FileListPublished);
