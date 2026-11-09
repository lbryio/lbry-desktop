//@ts-nocheck
import {connect} from 'react-redux';
import { selectUser } from 'redux/selectors/user';
import NudgeFloating from './view';

const select = (state: unknown) => ({
  user: selectUser(state),
});

export default connect(select)(NudgeFloating);
