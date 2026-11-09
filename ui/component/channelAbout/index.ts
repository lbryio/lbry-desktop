//@ts-nocheck
import {connect} from 'react-redux';
import { makeSelectMetadataItemForUri, makeSelectClaimForUri } from 'redux/selectors/claims';
import ChannelAbout from './view';

const select = (state: unknown, props: unknown) => ({
  claim: makeSelectClaimForUri(props.uri)(state),
  description: makeSelectMetadataItemForUri(props.uri, 'description')(state),
  website: makeSelectMetadataItemForUri(props.uri, 'website_url')(state),
  email: makeSelectMetadataItemForUri(props.uri, 'email')(state),
  languages: makeSelectMetadataItemForUri(props.uri, 'languages')(state),
});

export default connect(select, null)(ChannelAbout);
