import { connect } from 'react-redux';
import FourOhFourPage from './view';

const select = state => ({});

export default connect(
  select,
  null
)(FourOhFourPage);
