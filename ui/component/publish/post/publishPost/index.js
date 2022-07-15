import { connect } from 'react-redux';
import { selectBalance } from 'redux/selectors/wallet';
import { selectPublishFormValue } from 'redux/selectors/publish';
import { doUpdatePublishForm } from 'redux/actions/publish';
import PublishPost from './view';

const select = (state, props) => ({
  title: selectPublishFormValue(state, 'title'),
  balance: selectBalance(state),
});

const perform = {
  doUpdatePublishForm,
};

export default connect(select, perform)(PublishPost);
