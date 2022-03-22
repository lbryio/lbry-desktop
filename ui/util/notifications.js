// @flow

export const buildUnseenCountStr = (unseenCount: number) => (unseenCount > 20 ? '20+' : `${unseenCount}`);
