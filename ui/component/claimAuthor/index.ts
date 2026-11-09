//@ts-nocheck
import {connect} from 'react-redux';
import { makeSelectChannelForClaimUri } from 'redux/selectors/claims';
import ClaimAuthor from './view';

const select = (state: unknown, props: unknown) => ({
  channelUri: makeSelectChannelForClaimUri(props.uri)(state),
});

export default connect(select)(ClaimAuthor);
