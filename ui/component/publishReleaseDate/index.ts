//@ts-nocheck
import {connect} from 'react-redux';
import { makeSelectPublishFormValue } from 'redux/selectors/publish';
import { doUpdatePublishForm } from 'redux/actions/publish';
import PublishReleaseDate from './view';

const select = (state: unknown) => ({
  releaseTime: makeSelectPublishFormValue('releaseTime')(state),
  releaseTimeEdited: makeSelectPublishFormValue('releaseTimeEdited')(state),
});

const perform = (dispatch: unknown) => ({
  updatePublishForm: (value) => dispatch(doUpdatePublishForm(value)),
});

export default connect(select, perform)(PublishReleaseDate);
