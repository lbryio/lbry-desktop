import { connect } from 'react-redux';
import { selectThemePath } from 'redux/selectors/settings';
import Theme from './view';

const select = state => ({
  themePath: selectThemePath(state),
});

export default connect(select)(Theme);
