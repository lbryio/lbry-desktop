import { connect } from 'react-redux';
import { doRemovePersonalRecommendation } from 'redux/actions/search';
import FileHideRecommendation from './view';

const perform = {
  doRemovePersonalRecommendation,
};

export default connect(null, perform)(FileHideRecommendation);
