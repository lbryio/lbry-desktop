import { connect } from 'react-redux';
import { makeSelectTitleForUri } from 'lbry-redux';
import FileTitleSection from './view';

const select = (state, props) => ({
  title: makeSelectTitleForUri(props.uri)(state),
});

export default connect(select)(FileTitleSection);
