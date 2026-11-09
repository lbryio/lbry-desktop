//@ts-nocheck
import {connect} from 'react-redux';
import { makeSelectCanonicalUrlForUri } from 'redux/selectors/claims';
import { doToast } from 'redux/actions/notifications';
import ClaimUri from './view';

const select = (state: unknown, props: unknown) => ({
  shortUrl: makeSelectCanonicalUrlForUri(props.uri)(state),
});

export default connect(select, {
  doToast,
})(ClaimUri);
