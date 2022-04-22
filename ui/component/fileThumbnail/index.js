import { connect } from 'react-redux';
import { doResolveUri } from 'redux/actions/claims';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import { makeSelectContentWatchedPercentageForUri } from 'redux/selectors/content';
import CardMedia from './view';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import * as SETTINGS from 'constants/settings';

const select = (state, props) => {
  return {
    watchedPercentage: makeSelectContentWatchedPercentageForUri(props.uri)(state),
    claim: makeSelectClaimForUri(props.uri)(state),
    showPercentage: makeSelectClientSetting(SETTINGS.PERSIST_WATCH_TIME)(state),
  };
};

export default connect(select, { doResolveUri })(CardMedia);
