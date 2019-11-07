import { connect } from 'react-redux';
import { selectTheme } from 'redux/selectors/settings';
import Spinner from './view';

const mapStateToProps = state => ({
  theme: selectTheme(state),
});

export default connect(
  mapStateToProps,
  null
)(Spinner);
