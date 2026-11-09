//@ts-nocheck
import {connect} from 'react-redux';
import { selectClaimForUri } from 'redux/selectors/claims';
import { selectViewCountForUri } from 'lbryinc';
import { selectLanguage } from 'redux/selectors/settings';
import FileViewCountInline from './view';

const select = (state: unknown, props: unknown) => {
  return {
    claim: selectClaimForUri(state, props.uri),
    viewCount: selectViewCountForUri(state, props.uri),
    lang: selectLanguage(state),
  };
};

export default connect(select, null)(FileViewCountInline);
