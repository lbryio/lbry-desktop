import { connect } from 'react-redux';

import { normalizeURI } from 'lbryURI';
import { doNavigate } from 'redux/actions/navigation';
import { selectCurrentPath } from 'redux/selectors/navigation';
import { selectWunderBarAddress, selectWunderBarIcon } from 'redux/selectors/search';
import Wunderbar from './view';

const select = state => ({
  address: selectWunderBarAddress(state),
  currentPath: selectCurrentPath(state),
  icon: selectWunderBarIcon(state),
});

const perform = dispatch => ({
  onSearch: query => dispatch(doNavigate('/search', { query })),
  onSubmit: (query, extraParams) =>
    dispatch(doNavigate('/show', { uri: normalizeURI(query), ...extraParams })),
});

export default connect(select, perform)(Wunderbar);
