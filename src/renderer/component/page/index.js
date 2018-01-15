import { connect } from 'react-redux';
import { selectPageTitle } from 'redux/selectors/navigation';
import Page from './view';

const select = state => ({
  title: selectPageTitle(state),
});

export default connect(select, null)(Page);
