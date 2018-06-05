import { connect } from 'react-redux';
import FileRender from './view';
const select = (state, props) => ({});
const perform = dispatch => ({});
export default connect(
  select,
  perform
)(FileRender);
