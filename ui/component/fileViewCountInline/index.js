import { connect } from 'react-redux';
import { makeSelectClaimForUri } from 'lbry-redux';
import { makeSelectViewCountForUri } from 'lbryinc';
import FileViewCountInline from './view';

const select = (state, props) => {
  return {
    claim: makeSelectClaimForUri(props.uri)(state),
    viewCount: makeSelectViewCountForUri(props.uri)(state),
  };
};

export default connect(select, null)(FileViewCountInline);
