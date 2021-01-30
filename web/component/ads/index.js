import { connect } from 'react-redux';
import { selectTheme } from 'redux/selectors/settings';
import Ads from './view';
const select = state => ({
  theme: selectTheme(state),
});

export default connect(select)(Ads);
