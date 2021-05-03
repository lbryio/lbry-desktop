import SearchScreenInput from './view';
import { connect } from 'react-redux';
import { doSetSearchWindow } from 'redux/actions/app';
import { selectSearchWindow } from 'redux/selectors/app';

const select = (state) => ({
  searchWindow: selectSearchWindow(state),
});

const perform = (dispatch) => ({
  setSearchWindow: (isOpen) => dispatch(doSetSearchWindow(isOpen)),
});

export default connect(select, perform)(SearchScreenInput);
