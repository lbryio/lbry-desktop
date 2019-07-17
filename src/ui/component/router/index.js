import { connect } from 'react-redux';
<<<<<<< HEAD
import { selectScrollStartingPosition } from 'redux/selectors/app';
import Router from './view';

const select = state => ({
  currentScroll: selectScrollStartingPosition(state),
=======
import Router from './view';

const select = state => ({
  scroll: state.app.scrollHistory[state.app.scrollHistory.length - 1],
  scrollHistory: state.app.scrollHistory,
  currentScroll: state.app.currentScroll || 0,
>>>>>>> restore that shit
});

export default connect(select)(Router);
