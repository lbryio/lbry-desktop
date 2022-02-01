import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import CollectionAddButton from './view';
import { selectClaimForUri } from 'redux/selectors/claims';
import { makeSelectClaimUrlInCollection } from 'redux/selectors/collections';

const select = (state, props) => {
  const { uri } = props;

  const claim = selectClaimForUri(state, uri);

  // $FlowFixMe
  const { permanent_url: permanentUrl, value } = claim || {};
  const streamType = (value && value.stream_type) || '';

  return {
    streamType,
    isSaved: permanentUrl && makeSelectClaimUrlInCollection(permanentUrl)(state),
  };
};

const perform = {
  doOpenModal,
};

export default connect(select, perform)(CollectionAddButton);
