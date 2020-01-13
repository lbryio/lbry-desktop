import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { selectPublishFormValues, doUpdatePublishForm } from 'lbry-redux';
import { selectIsStillEditing } from 'redux/selectors/publish';
import PublishPage from './view';

const selectDefaultLanguage = createSelector(
  selectPublishFormValues,
  selectIsStillEditing,
  (publishState, isStillEditing) => {
    const { languages, language } = publishState;
    // returns the language of the original claim if editing
    return isStillEditing ? languages[0] : language;
  }
);

const select = state => ({
  ...selectPublishFormValues(state),
  defaultLanguage: selectDefaultLanguage(state),
});

const perform = dispatch => ({
  updatePublishForm: value => dispatch(doUpdatePublishForm(value)),
});

export default connect(
  select,
  perform
)(PublishPage);
