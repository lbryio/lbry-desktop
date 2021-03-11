import { connect } from 'react-redux';
import { makeSelectTitleForUri } from 'lbry-redux';
import { makeSelectInsufficientCreditsForUri } from 'redux/selectors/content';
import FileTitleSection from './view';

const select = (state, props) => ({
  isInsufficientCredits: makeSelectInsufficientCreditsForUri(props.uri)(state),
  title: makeSelectTitleForUri(props.uri)(state),
});

export default connect(select)(FileTitleSection);
