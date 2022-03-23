import { connect } from 'react-redux';
import { doSetLanguage, doSetHomepage } from 'redux/actions/settings';
import { selectHomepageCode } from 'redux/selectors/settings';
import { selectUserCountry } from 'redux/selectors/user';
import { doOpenModal } from 'redux/actions/app';
import NagLocaleSwitch from './view';

const select = (state) => ({
  homepageCode: selectHomepageCode(state),
  userCountry: selectUserCountry(state),
});

const perform = {
  doSetLanguage,
  doSetHomepage,
  doOpenModal,
};

export default connect(select, perform)(NagLocaleSwitch);
