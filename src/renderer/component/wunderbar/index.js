import { connect } from 'react-redux';
import { Lbryuri, doNavigate, selectWunderBarAddress, selectWunderBarIcon } from 'lbry-redux';
import Wunderbar from './view';

const select = state => ({
  address: selectWunderBarAddress(state),
  icon: selectWunderBarIcon(state),
});

const perform = dispatch => ({
  onSearch: query => dispatch(doNavigate('/search', { query })),
  onSubmit: (query, extraParams) =>
    dispatch(doNavigate('/show', { uri: Lbryuri.normalize(query), ...extraParams })),
});

export default connect(select, perform)(Wunderbar);
