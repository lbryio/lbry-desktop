import { connect } from 'react-redux';
import { makeSelectMetadataItemForUri, makeSelectClaimForUri, makeSelectStakedLevelForChannelUri } from 'lbry-redux';
import ChannelAbout from './view';

const select = (state, props) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  stakedLevel: makeSelectStakedLevelForChannelUri(props.uri)(state),
  description: makeSelectMetadataItemForUri(props.uri, 'description')(state),
  website: makeSelectMetadataItemForUri(props.uri, 'website_url')(state),
  email: makeSelectMetadataItemForUri(props.uri, 'email')(state),
  languages: makeSelectMetadataItemForUri(props.uri, 'languages')(state),
});

export default connect(select, null)(ChannelAbout);
