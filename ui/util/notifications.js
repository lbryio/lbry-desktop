// @flow

export const buildUnseenCountStr = (unseenCount: number) => (unseenCount > 99 ? '99+' : `${unseenCount}`);
