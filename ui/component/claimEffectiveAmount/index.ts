//@ts-nocheck
import {connect} from 'react-redux';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import ClaimEffectiveAmount from './view';

const select = (state: unknown, props: unknown) => ({
  claim: makeSelectClaimForUri(props.uri, true)(state),
});

export default connect(select)(ClaimEffectiveAmount);
