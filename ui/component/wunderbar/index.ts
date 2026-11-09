//@ts-nocheck
import * as MODALS from 'constants/modal_types';
import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import Wunderbar from './view';

const perform = (dispatch: unknown, ownProps: unknown) => ({
  doOpenMobileSearch: (props) => dispatch(doOpenModal(MODALS.MOBILE_SEARCH, props)),
});

export default connect(null, perform)(Wunderbar);
