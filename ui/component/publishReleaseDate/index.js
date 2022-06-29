import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { makeSelectPublishFormValue } from 'redux/selectors/publish';
import { doUpdatePublishForm } from 'redux/actions/publish';
import { selectClientSetting } from 'redux/selectors/settings';
import PublishReleaseDate from './view';

const select = (state) => ({
  releaseTime: makeSelectPublishFormValue('releaseTime')(state),
  releaseTimeEdited: makeSelectPublishFormValue('releaseTimeEdited')(state),
  releaseTimeError: makeSelectPublishFormValue('releaseTimeError')(state),
  clock24h: selectClientSetting(state, SETTINGS.CLOCK_24H),
});

const perform = (dispatch) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
});

export default connect(select, perform)(PublishReleaseDate);
