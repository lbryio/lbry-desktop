import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import { makeSelectViewCountForUri } from 'lbryinc';
import { selectLanguage } from 'redux/selectors/settings';
import FileViewCountInline from './view';

const select = (state, props) => {
  return {
    claim: makeSelectClaimForUri(props.uri)(state),
    viewCount: makeSelectViewCountForUri(props.uri)(state),
    lang: selectLanguage(state),
  };
};

export default connect(select, null)(FileViewCountInline);
