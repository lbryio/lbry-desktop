import { connect } from 'react-redux';
import { makeSelectClaimForUri, makeSelectClaimIsMine } from 'lbry-redux';
import { makeSelectChannelIsMuted } from 'redux/selectors/blocked';
import { doToggleMuteChannel } from 'redux/actions/blocked';
import { doCommentModBlock, doCommentModUnBlock } from 'redux/actions/comments';
import { makeSelectChannelIsBlocked } from 'redux/selectors/comments';
import ClaimPreview from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  claimIsMine: props.channelIsMine ? (props.isRepost ? makeSelectClaimIsMine(props.uri)(state) : true) : makeSelectClaimIsMine(props.uri)(state),
  channelIsMuted: makeSelectChannelIsMuted(props.uri)(state),
  channelIsBlocked: makeSelectChannelIsBlocked(props.uri)(state),
});

export default connect(select, {
  doToggleMuteChannel,
  doCommentModBlock,
  doCommentModUnBlock,
})(ClaimPreview);
