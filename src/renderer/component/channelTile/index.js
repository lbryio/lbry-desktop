import { connect } from 'react-redux';
import {
  doNavigate,
  doResolveUri,
  makeSelectClaimForUri,
  makeSelectIsUriResolving,
} from 'lbry-redux';
import { makeSelectTotalItemsForChannel } from 'redux/selectors/content';
import ChannelTile from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  isResolvingUri: makeSelectIsUriResolving(props.uri)(state),
  totalItems: makeSelectTotalItemsForChannel(props.uri)(state),
});

const perform = dispatch => ({
  navigate: (path, params) => dispatch(doNavigate(path, params)),
  resolveUri: uri => dispatch(doResolveUri(uri)),
});

export default connect(select, perform)(ChannelTile);
