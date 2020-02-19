import { connect } from 'react-redux';
import Welcome from './view';

const select = () => ({});
const perform = () => ({});

export default connect(
  select,
  perform
)(Welcome);
