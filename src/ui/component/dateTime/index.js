import { connect } from 'react-redux';
import { doFetchBlock, makeSelectBlockDate } from 'lbry-redux';
import DateTime from './view';

const select = (state, props) => ({
  date: !props.date && props.block ? makeSelectBlockDate(props.block)(state) : props.date,
});

const perform = dispatch => ({
  fetchBlock: height => dispatch(doFetchBlock(height)),
});

export default connect(
  select,
  perform
)(DateTime);
