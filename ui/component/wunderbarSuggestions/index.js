import { connect } from 'react-redux';
import { selectClientSetting, selectLanguage, selectShowMatureContent } from 'redux/selectors/settings';
import { doToast } from 'redux/actions/notifications';
import { doHideModal } from 'redux/actions/app';
import { withRouter } from 'react-router';
import { doResolveUris } from 'redux/actions/claims';
import analytics from 'analytics';
import Wunderbar from './view';
import * as SETTINGS from 'constants/settings';

const select = (state, props) => ({
  languageSetting: selectLanguage(state),
  searchInLanguage: selectClientSetting(state, SETTINGS.SEARCH_IN_LANGUAGE),
  showMature: selectShowMatureContent(state),
});

const perform = (dispatch, ownProps) => ({
  doResolveUris: (uris) => dispatch(doResolveUris(uris)),
  navigateToSearchPage: (query) => {
    let encodedQuery = encodeURIComponent(query);
    ownProps.history.push({ pathname: `/$/search`, search: `?q=${encodedQuery}` });
    analytics.apiLog.search();
  },
  doShowSnackBar: (message) => dispatch(doToast({ isError: true, message })),
  doCloseMobileSearch: () => dispatch(doHideModal()),
});

export default withRouter(connect(select, perform)(Wunderbar));
