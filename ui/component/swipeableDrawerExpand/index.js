import { connect } from 'react-redux';
import { doToggleAppDrawer } from 'redux/actions/app';
import DrawerExpandButton from './view';

const perform = {
  doToggleAppDrawer,
};

export default connect(null, perform)(DrawerExpandButton);
