import { connect } from 'react-redux';
import { doNavigate, doHistoryBack, doHistoryForward } from 'redux/actions/navigation';
import {
  selectIsBackDisabled,
  selectIsForwardDisabled,
  selectIsHome,
  selectNavLinks,
} from 'redux/selectors/navigation';
import SideBar from './view';

const select = state => ({
  navLinks: selectNavLinks(state),
  isBackDisabled: selectIsBackDisabled(state),
  isForwardDisabled: selectIsForwardDisabled(state),
  isHome: selectIsHome(state),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  back: () => dispatch(doHistoryBack()),
  forward: () => dispatch(doHistoryForward()),
});

export default connect(select, perform)(SideBar);
