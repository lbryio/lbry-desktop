import { connect } from 'react-redux';
import { makeSelectPublishFormValue } from 'redux/selectors/publish';
import PublishPage from './view';

const select = state => ({
  contentIsFree: makeSelectPublishFormValue('contentIsFree')(state),
  fee: makeSelectPublishFormValue('fee')(state),
});

export default connect(
  select,
  null
)(PublishPage);
