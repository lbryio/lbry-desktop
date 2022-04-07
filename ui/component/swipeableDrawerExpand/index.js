import { connect } from 'react-redux';
import { doToggleAppDrawer } from 'redux/actions/app';
import DrawerExpandButton from './view';

const perform = {
  onClick: doToggleAppDrawer,
};

export default connect(null, perform)(DrawerExpandButton);
