//@ts-nocheck
import {connect} from 'react-redux';
import { selectThemePath } from 'redux/selectors/settings';
import Theme from './view';

const select = state: unknown => ({
  themePath: selectThemePath(state),
});

export default connect(select)(Theme);
