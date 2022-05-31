// @flow

const buildCDNUrl = (path: string) => `https://static.odycdn.com/stickers/${path}`;

const buildSticker = (name: string, path: string, price?: number) => ({
  name: `:${name}:`,
  url: buildCDNUrl(path),
  price: price,
});

const CAT_BORDER = 'CAT/PNG/cat_with_border.png';
const FAIL_BORDER = 'FAIL/PNG/fail_with_border.png';
const HYPE_BORDER = 'HYPE/PNG/hype_with_border.png';
const PANTS_1_WITH_FRAME = 'PANTS/PNG/PANTS_1_with_frame.png';
const PISS = 'PISS/PNG/piss_with_frame.png';
const PREGNANT_MAN_BLONDE_WHITE_BORDER = 'pregnant%20man/png/Pregnant%20man_white%20border_blondie.png';
const PREGNANT_WOMAN_BROWN_HAIR_WHITE_BORDER = 'pregnant%20woman/png/Pregnant%20woman_white_border_brown%20hair.png';
const ROCKET_SPACEMAN_WITH_BORDER = 'ROCKET%20SPACEMAN/PNG/rocket-spaceman_with-border.png';
const SALTY = 'SALTY/PNG/salty.png';
const SICK_2_WITH_BORDER = 'SICK/PNG/sick2_with_border.png';
const SICK_1_WITH_BORDERDARK_WITH_FRAME = 'SICK/PNG/with%20borderdark%20with%20frame.png';
const SLIME_WITH_FRAME = 'SLIME/PNG/slime_with_frame.png';
const FIRE_WITH_FRAME = 'MISC/PNG/fire.png';
const SPHAGETTI_BATH_WITH_FRAME = 'SPHAGETTI%20BATH/PNG/sphagetti%20bath_with_frame.png';
const THUG_LIFE_WITH_BORDER = 'THUG%20LIFE/PNG/thug_life_with_border_clean.png';
const WHUUT_WITH_FRAME = 'WHUUT/PNG/whuut_with-frame.png';
const EGIRL = 'EGIRL/PNG/e-girl.png';
const BULL_RIDE = 'BULL/PNG/bull-ride.png';
const TRAP = 'TRAP/PNG/trap.png';
// const XMAS = 'SEASONAL/PNG/xmas.png';
const ELIMINATED = 'ELIMINATED/PNG/eliminated.png';
const TRASH = 'TRASH/PNG/trash.png';
const BAN = 'BAN/PNG/ban.png';
const KANYE_WEST = 'MISC/PNG/kanye_west.png';
const CHE_GUEVARA = 'MISC/PNG/che_guevara.png';
const BILL_COSBY = 'MISC/PNG/bill_cosby.png';
const KURT_COBAIN = 'MISC/PNG/kurt_cobain.png';
const BILL_CLINTON = 'MISC/PNG/bill_clinton.png';
const CHRIS_CHAN = 'MISC/PNG/chris_chan.png';
const TAYLOR_SWIFT = 'MISC/PNG/taylor_swift.png';
const EPSTEIN_ISLAND = 'MISC/PNG/epstein_island.png';
const DONALD_TRUMP = 'MISC/PNG/donald_trump.png';
const EGG_CARTON = 'MISC/PNG/egg_carton.png';
const MOUNT_RUSHMORE = 'MISC/PNG/mount_rushmore.png';
const MONEY_PRINTER = 'MISC/PNG/money_printer.png';
const COMET_TIP = 'TIPS/png/$%20comet%20tip%20with%20border.png';
const BIG_LBC_TIP = 'TIPS/png/big_LBC_TIPV.png';
const BIG_TIP = 'TIPS/png/with%20borderbig$tip.png';
const BITE_TIP = 'TIPS/png/bite_$tip_with%20border.png';
const BITE_TIP_CLOSEUP = 'TIPS/png/bite_$tip_closeup.png';
const FORTUNE_CHEST_LBC = 'TIPS/png/with%20borderfortunechest_LBC_tip.png';
const FORTUNE_CHEST = 'TIPS/png/with%20borderfortunechest$_tip.png';
const LARGE_LBC_TIP = 'TIPS/png/with%20borderlarge_LBC_tip%20.png';
const LARGE_TIP = 'TIPS/png/with%20borderlarge$tip.png';
const BITE_LBC_CLOSEUP = 'TIPS/png/LBC%20bite.png';
const LBC_COMET_TIP = 'TIPS/png/LBC%20comet%20tip%20with%20border.png';
const MEDIUM_LBC_TIP = 'TIPS/png/with%20bordermedium_LBC_tip%20%20%20%20%20%20%20%20%20%20.png';
const MEDIUM_TIP = 'TIPS/png/with%20bordermedium$_%20tip.png';
const SILVER_ODYSEE_COIN = 'TIPS/png/with%20bordersilver_odysee_coinv.png';
const SMALL_LBC_TIP = 'TIPS/png/with%20bordersmall_LBC_tip%20.png';
const SMALL_TIP = 'TIPS/png/with%20bordersmall$_tip.png';
const TIP_HAND_FLIP = 'TIPS/png/tip_hand_flip_$%20_with_border.png';
const TIP_HAND_FLIP_COIN = 'TIPS/png/tip_hand_flip_coin_with_border.png';
const TIP_HAND_FLIP_LBC = 'TIPS/png/tip_hand_flip_lbc_with_border.png';
const DOGE = 'MISC/PNG/doge.png';
const TWITCH = 'MISC/PNG/twitch.png';

export const FREE_GLOBAL_STICKERS = [
  buildSticker('CAT', CAT_BORDER),
  buildSticker('FAIL', FAIL_BORDER),
  buildSticker('HYPE', HYPE_BORDER),
  buildSticker('PANTS_1', PANTS_1_WITH_FRAME),
  buildSticker('DOGE', DOGE),
  // buildSticker('XMAS', XMAS),
  buildSticker('FIRE', FIRE_WITH_FRAME),
  buildSticker('SLIME', SLIME_WITH_FRAME),
  buildSticker('PISS', PISS),
  buildSticker('TWITCH', TWITCH),
  buildSticker('BULL_RIDE', BULL_RIDE),
  buildSticker('ELIMINATED', ELIMINATED),
  buildSticker('EGG_CARTON', EGG_CARTON),
  buildSticker('BAN', BAN),
  buildSticker('MONEY_PRINTER', MONEY_PRINTER),
  buildSticker('MOUNT_RUSHMORE', MOUNT_RUSHMORE),
  buildSticker('EGIRL', EGIRL),
  buildSticker('KANYE_WEST', KANYE_WEST),
  buildSticker('TAYLOR_SWIFT', TAYLOR_SWIFT),
  buildSticker('DONALD_TRUMP', DONALD_TRUMP),
  buildSticker('BILL_CLINTON', BILL_CLINTON),
  buildSticker('EPSTEIN_ISLAND', EPSTEIN_ISLAND),
  buildSticker('KURT_COBAIN', KURT_COBAIN),
  buildSticker('BILL_COSBY', BILL_COSBY),
  buildSticker('CHE_GUEVARA', CHE_GUEVARA),
  buildSticker('CHRIS_CHAN', CHRIS_CHAN),
  buildSticker('PREGNANT_MAN_BLONDE', PREGNANT_MAN_BLONDE_WHITE_BORDER),
  buildSticker('PREGNANT_WOMAN_BROWN_HAIR', PREGNANT_WOMAN_BROWN_HAIR_WHITE_BORDER),
  buildSticker('ROCKET_SPACEMAN', ROCKET_SPACEMAN_WITH_BORDER),
  buildSticker('SALTY', SALTY),
  buildSticker('SICK_FLAME', SICK_2_WITH_BORDER),
  buildSticker('SICK_SKULL', SICK_1_WITH_BORDERDARK_WITH_FRAME),
  buildSticker('SPHAGETTI_BATH', SPHAGETTI_BATH_WITH_FRAME),
  buildSticker('THUG_LIFE', THUG_LIFE_WITH_BORDER),
  buildSticker('TRAP', TRAP),
  buildSticker('TRASH', TRASH),
  buildSticker('WHUUT', WHUUT_WITH_FRAME),
];

export const PAID_GLOBAL_STICKERS = [
  buildSticker('TIP_HAND_FLIP', TIP_HAND_FLIP, 1),
  buildSticker('TIP_HAND_FLIP_COIN', TIP_HAND_FLIP_COIN, 1),
  buildSticker('TIP_HAND_FLIP_LBC', TIP_HAND_FLIP_LBC, 1),
  buildSticker('COMET_TIP', COMET_TIP, 5),
  buildSticker('SILVER_ODYSEE_COIN', SILVER_ODYSEE_COIN, 5),
  buildSticker('LBC_COMET_TIP', LBC_COMET_TIP, 25),
  buildSticker('SMALL_TIP', SMALL_TIP, 25),
  buildSticker('SMALL_LBC_TIP', SMALL_LBC_TIP, 25),
  buildSticker('BITE_TIP', BITE_TIP, 50),
  buildSticker('BITE_TIP_CLOSEUP', BITE_TIP_CLOSEUP, 50),
  buildSticker('BITE_LBC_CLOSEUP', BITE_LBC_CLOSEUP, 50),
  buildSticker('MEDIUM_TIP', MEDIUM_TIP, 50),
  buildSticker('MEDIUM_LBC_TIP', MEDIUM_LBC_TIP, 50),
  buildSticker('LARGE_TIP', LARGE_TIP, 100),
  buildSticker('LARGE_LBC_TIP', LARGE_LBC_TIP, 100),
  buildSticker('BIG_TIP', BIG_TIP, 150),
  buildSticker('BIG_LBC_TIP', BIG_LBC_TIP, 150),
  buildSticker('FORTUNE_CHEST', FORTUNE_CHEST, 200),
  buildSticker('FORTUNE_CHEST_LBC', FORTUNE_CHEST_LBC, 200),
];
