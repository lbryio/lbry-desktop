import { connect } from 'react-redux';
import { selectPreorderTagForUri, selectClaimForUri, selectClaimIsMine } from 'redux/selectors/claims';
import PreorderButton from './view';
import { doOpenModal } from 'redux/actions/app';
import * as SETTINGS from 'constants/settings';
import { selectClientSetting } from 'redux/selectors/settings';

const select = (state, props) => {
  const claim = selectClaimForUri(state, props.uri);

  return {
    preorderTag: selectPreorderTagForUri(state, props.uri),
    claimIsMine: selectClaimIsMine(state, claim),
    claim,
    preferredCurrency: selectClientSetting(state, SETTINGS.PREFERRED_CURRENCY),
  };
};

const perform = {
  doOpenModal,
};

export default connect(select, perform)(PreorderButton);
