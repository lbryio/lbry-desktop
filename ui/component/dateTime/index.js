import { connect } from 'react-redux';
import { makeSelectDateForUri } from 'lbry-redux';
import DateTime from './view';

const select = (state, props) => ({
  date: props.date || makeSelectDateForUri(props.uri)(state),
});
export default connect(select)(DateTime);
