import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  selectMyPublishedPlaylistCollections,
  selectMyUnpublishedCollections, // should probably distinguish types
  // selectSavedCollections,
} from 'redux/selectors/collections';
import { selectFetchingMyCollections } from 'redux/selectors/claims';
import PlaylistsMine from './view';
import { PAGE_PARAM, PAGE_SIZE_PARAM } from 'constants/claim';
const COLLECTIONS_PAGE_SIZE = 12;

const select = (state, props) => {
  const { search } = props.location;
  const urlParams = new URLSearchParams(search);
  const page = Number(urlParams.get(PAGE_PARAM)) || '1';
  const pageSize = urlParams.get(PAGE_SIZE_PARAM) || String(COLLECTIONS_PAGE_SIZE);

  return {
    page,
    pageSize,
    publishedCollections: selectMyPublishedPlaylistCollections(state),
    unpublishedCollections: selectMyUnpublishedCollections(state),
    // savedCollections: selectSavedCollections(state),
    fetchingCollections: selectFetchingMyCollections(state),
  };
};

export default withRouter(connect(select)(PlaylistsMine));
