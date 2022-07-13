import { connect } from 'react-redux';
import SwipeableDrawer from './view';
import { selectTheme } from 'redux/selectors/settings';
import { selectIsDrawerOpenForType } from 'redux/selectors/app';
import { doToggleAppDrawer } from 'redux/actions/app';

const select = (state, props) => {
  const { type } = props;

  return {
    open: selectIsDrawerOpenForType(state, type),
    theme: selectTheme(state),
  };
};

const perform = {
  doToggleAppDrawer,
};

export default connect(select, perform)(SwipeableDrawer);
