import React from 'react';
import { formatCredits } from 'util/formatCredits';
import { connect } from 'react-redux';
import { selectIsBackDisabled, selectIsForwardDisabled } from 'redux/selectors/navigation';
import { selectBalance } from 'redux/selectors/wallet';
import { doNavigate, doHistoryBack, doHistoryForward } from 'redux/actions/navigation';
import Header from './view';
import { selectIsUpgradeAvailable, selectAutoUpdateDownloaded } from 'redux/selectors/app';
import { doDownloadUpgradeRequested } from 'redux/actions/app';

const select = state => ({
  isBackDisabled: selectIsBackDisabled(state),
  isForwardDisabled: selectIsForwardDisabled(state),
  isUpgradeAvailable: selectIsUpgradeAvailable(state),
  autoUpdateDownloaded: selectAutoUpdateDownloaded(state),
  balance: formatCredits(selectBalance(state) || 0, 2),
});

const perform = dispatch => ({
  navigate: path => dispatch(doNavigate(path)),
  back: () => dispatch(doHistoryBack()),
  forward: () => dispatch(doHistoryForward()),
  downloadUpgradeRequested: () => dispatch(doDownloadUpgradeRequested()),
});

export default connect(select, perform)(Header);
