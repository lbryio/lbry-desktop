import { connect } from 'react-redux';
import SelectHomepage from './view';
import { SETTINGS } from 'lbry-redux';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectHomepageCode } from 'redux/selectors/settings';

const select = state => ({
  homepage: selectHomepageCode(state),
});

const perform = dispatch => ({
  setHomepage: value => dispatch(doSetClientSetting(SETTINGS.HOMEPAGE, value)),
});

export default connect(select, perform)(SelectHomepage);
