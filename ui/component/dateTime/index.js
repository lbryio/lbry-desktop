import { connect } from 'react-redux';
import { makeSelectDateForUri, SETTINGS } from 'lbry-redux';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import DateTime from './view';

const select = (state, props) => ({
  date: props.date || makeSelectDateForUri(props.uri)(state),
  clock24h: makeSelectClientSetting(SETTINGS.CLOCK_24H)(state),
});
export default connect(select)(DateTime);
