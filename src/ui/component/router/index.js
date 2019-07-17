import { connect } from 'react-redux';
import Router from './view';

const select = state => ({
  scroll: state.app.scrollHistory[state.app.scrollHistory.length - 1],
  scrollHistory: state.app.scrollHistory,
  currentScroll: state.app.currentScroll || 0,
});

export default connect(select)(Router);
