import { connect } from 'react-redux';
import { selectScrollStartingPosition } from 'redux/selectors/app';
import Router from './view';

const select = state => ({
  currentScroll: selectScrollStartingPosition(state),
});

export default connect(select)(Router);
