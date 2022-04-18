import { connect } from 'react-redux';
import * as SETTINGS from 'constants/settings';
import { doResolveUri } from 'redux/actions/claims';
import { makeSelectClientSetting } from 'redux/selectors/settings';
import { makeSelectClaimForUri } from 'redux/selectors/claims';
import { makeSelectContentPositionForUri, makeSelectContentPositionPersistedForUri } from 'redux/selectors/content';
import CardMedia from './view';

const select = (state, props) => {
  const persistWatchTime = makeSelectClientSetting(SETTINGS.PERSIST_WATCH_TIME)(state);
  return {
    position: persistWatchTime
      ? makeSelectContentPositionPersistedForUri(props.uri)(state)
      : makeSelectContentPositionForUri(props.uri)(state),
    claim: makeSelectClaimForUri(props.uri)(state),
  };
};

export default connect(select, { doResolveUri })(CardMedia);
