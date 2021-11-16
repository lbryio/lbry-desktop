import { connect } from 'react-redux';
import { selectClaimForUri } from 'redux/selectors/claims';
import { selectViewCountForUri } from 'lbryinc';
import { selectLanguage } from 'redux/selectors/settings';
import FileViewCountInline from './view';

const select = (state, props) => {
  return {
    claim: selectClaimForUri(state, props.uri),
    viewCount: selectViewCountForUri(state, props.uri),
    lang: selectLanguage(state),
  };
};

export default connect(select, null)(FileViewCountInline);
