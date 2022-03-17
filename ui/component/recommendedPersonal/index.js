import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doToast } from 'redux/actions/notifications';
import { doFetchPersonalRecommendations } from 'redux/actions/search';
import { doSetClientSetting } from 'redux/actions/settings';
import { selectPersonalRecommendations } from 'redux/selectors/search';
import { selectClientSetting } from 'redux/selectors/settings';
import { selectHasOdyseeMembership, selectUser } from 'redux/selectors/user';

import RecommendedPersonal from './view';

const select = (state) => {
  const user = selectUser(state);
  return {
    userId: user && user.id,
    personalRecommendations: selectPersonalRecommendations(state),
    hasMembership: selectHasOdyseeMembership(state),
    hideFyp: selectClientSetting(state, SETTINGS.HIDE_FYP),
  };
};

const perform = {
  doFetchPersonalRecommendations,
  doSetClientSetting,
  doToast,
};

export default connect(select, perform)(RecommendedPersonal);
