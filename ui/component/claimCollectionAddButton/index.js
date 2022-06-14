import { connect } from 'react-redux';
import { doOpenModal } from 'redux/actions/app';
import CollectionAddButton from './view';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import { makeSelectClaimUrlInCollection } from 'redux/selectors/collections';

const select = (state, props) => {
  const claim = makeSelectClaimForUri(props.uri)(state);
  const permanentUrl = claim && claim.permanent_url;

  return {
    claim,
    isSaved: makeSelectClaimUrlInCollection(permanentUrl)(state),
  };
};

export default connect(select, {
  doOpenModal,
})(CollectionAddButton);
