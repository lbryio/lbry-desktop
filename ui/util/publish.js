import { ESTIMATED_FEE, MINIMUM_PUBLISH_BID } from 'constants/claim';

export function handleBidChange(bid, amount, balance, setBidError, setParam) {
  const totalAvailableBidAmount = (parseFloat(amount) || 0.0) + (parseFloat(balance) || 0.0);

  setParam({ bid: bid });

  if (bid <= 0.0 || isNaN(bid)) {
    setBidError(__('Deposit cannot be 0'));
  } else if (totalAvailableBidAmount < bid) {
    setBidError(
      __('Deposit cannot be higher than your available balance: %balance%', { balance: totalAvailableBidAmount })
    );
  } else if (totalAvailableBidAmount - bid < ESTIMATED_FEE) {
    setBidError(__('Please decrease your deposit to account for transaction fees'));
  } else if (bid < MINIMUM_PUBLISH_BID) {
    setBidError(__('Your deposit must be higher'));
  } else {
    setBidError('');
  }
}
