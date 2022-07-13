import { connect } from 'react-redux';
import CollectionCreate from './view';
import { selectPermanentUrlForUri } from 'redux/selectors/claims';
import { doToast } from 'redux/actions/notifications';

const select = (state, props) => {
  const { uri } = props;

  return {
    // lists can only use permanent_url
    uri: selectPermanentUrlForUri(state, uri),
  };
};

const perform = {
  doToast,
};

export default connect(select, perform)(CollectionCreate);
