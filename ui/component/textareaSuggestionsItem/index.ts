//@ts-nocheck
import {connect} from 'react-redux';
import { selectClaimForUri } from 'redux/selectors/claims';
import TextareaSuggestionsItem from './view';

const select = (state: unknown, props: unknown) => ({
  claim: props.uri && selectClaimForUri(state, props.uri),
});

export default connect(select)(TextareaSuggestionsItem);
