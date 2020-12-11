import * as MODALS from 'constants/modal_types';
import { connect } from 'react-redux';
import { selectLanguage, makeSelectClientSetting } from 'redux/selectors/settings';
import { doToast } from 'redux/actions/notifications';
import { doSearch } from 'redux/actions/search';
import { doOpenModal } from 'redux/actions/app';
import { withRouter } from 'react-router';
import { doResolveUris, SETTINGS } from 'lbry-redux';
import analytics from 'analytics';
import Wunderbar from './view';

const select = (state, props) => ({
  language: selectLanguage(state),
  showMature: makeSelectClientSetting(SETTINGS.SHOW_MATURE)(state),
});

const perform = (dispatch, ownProps) => ({
  doResolveUris: uris => dispatch(doResolveUris(uris)),
  doSearch: (query, options) => dispatch(doSearch(query, options)),
  navigateToSearchPage: query => {
    let encodedQuery = encodeURIComponent(query);
    ownProps.history.push({ pathname: `/$/search`, search: `?q=${encodedQuery}` });
    analytics.apiLogSearch();
  },
  doShowSnackBar: message => dispatch(doToast({ isError: true, message })),
  doOpenMobileSearch: () => dispatch(doOpenModal(MODALS.MOBILE_SEARCH)),
});

export default withRouter(connect(select, perform)(Wunderbar));
