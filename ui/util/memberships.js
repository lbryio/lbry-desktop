// @flow

export const getTotalPriceFromSupportersList = (supportersList: SupportersList) =>
  supportersList.map((supporter) => supporter.Price).reduce((total, supporterPledge) => total + supporterPledge, 0);
