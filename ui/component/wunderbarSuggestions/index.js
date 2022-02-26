import * as MODALS from 'constants/modal_types';
import { connect } from 'react-redux';
import { selectShowMatureContent } from 'redux/selectors/settings';
import { doToast } from 'redux/actions/notifications';
import { doOpenModal, doHideModal } from 'redux/actions/app';
import { withRouter } from 'react-router';
import { doResolveUris } from 'redux/actions/claims';
import analytics from 'analytics';
import Wunderbar from './view';

const select = (state, props) => ({
  showMature: selectShowMatureContent(state),
});

const perform = (dispatch, ownProps) => ({
  doResolveUris: (uris) => dispatch(doResolveUris(uris)),
  navigateToSearchPage: (query) => {
    let encodedQuery = encodeURIComponent(query);
    ownProps.history.push({ pathname: `/$/search`, search: `?q=${encodedQuery}` });
    analytics.apiLogSearch();
  },
  doShowSnackBar: (message) => dispatch(doToast({ isError: true, message })),
  doOpenMobileSearch: () => dispatch(doOpenModal(MODALS.MOBILE_SEARCH)),
  doCloseMobileSearch: () => dispatch(doHideModal()),
});

export default withRouter(connect(select, perform)(Wunderbar));
