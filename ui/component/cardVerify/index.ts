//@ts-nocheck
import {connect} from 'react-redux';
import { selectUserEmail } from 'redux/selectors/user';
import CardVerify from './view';

const select = state: unknown => ({
  email: selectUserEmail(state),
});

const perform = () => ({});

export default connect(select, perform)(CardVerify);
