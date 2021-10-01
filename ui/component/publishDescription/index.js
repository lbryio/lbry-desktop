import { connect } from 'react-redux';
import { doUpdatePublishForm, makeSelectPublishFormValue } from 'lbry-redux';
import PublishDescription from './view';

const select = state => ({
  description: makeSelectPublishFormValue('description')(state),
});

const perform = dispatch => ({
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
});

export default connect(select, perform)(PublishDescription);
