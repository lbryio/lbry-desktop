import { connect } from 'react-redux';
import { selectTitleForUri } from 'redux/selectors/claims';
import FileTitleSection from './view';

const select = (state, props) => ({
  title: selectTitleForUri(state, props.uri),
});

export default connect(select)(FileTitleSection);
