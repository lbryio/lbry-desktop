import { ESTIMATED_FEE, MINIMUM_PUBLISH_BID } from 'constants/claim';
import * as PUBLISH from 'constants/publish';

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

// TODO remove this or better decide whether app should delete languages[2+]
// This was added because a previous update setting was duplicating language codes
export function dedupeLanguages(languages) {
  if (languages.length <= 1) {
    return languages;
  } else if (languages.length === 2) {
    if (languages[0] !== languages[1]) {
      return languages;
    } else {
      return [languages[0]];
    }
  } else if (languages.length > 2) {
    const newLangs = [];
    languages.forEach((l) => {
      if (!newLangs.includes(l)) {
        newLangs.push(l);
      }
    });
    return newLangs;
  }
}

export function handleLanguageChange(index, code, languageParam, setParams, params) {
  let langs = [...languageParam];
  if (index === 0) {
    if (code === PUBLISH.LANG_NONE) {
      // clear all
      langs = [];
    } else {
      langs[0] = code;
      if (langs[0] === langs[1]) {
        langs.length = 1;
      }
    }
  } else {
    if (code === PUBLISH.LANG_NONE || code === langs[0]) {
      langs.splice(1, 1);
    } else {
      langs[index] = code;
    }
  }
  setParams({ ...params, languages: langs });
}
