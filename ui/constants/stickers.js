// @flow

const buildCDNUrl = (path: string) => `https://static.odycdn.com/stickers/${path}`;

const buildSticker = (name: string, path: string, price?: number) => ({
  name: __(`:${name}:`),
  url: buildCDNUrl(path),
  price: price,
});

const CAT_BORDER = 'CAT/PNG/cat_with_border.png';
const FAIL_BORDER = 'FAIL/PNG/fail_with_border.png';
const HYPE_BORDER = 'HYPE/PNG/hype_with_border.png';
const PANTS_1_WITH_FRAME = 'PANTS/PNG/PANTS_1_with_frame.png';
const PANTS_2_WITH_FRAME = 'PANTS/PNG/PANTS_2_with_frame.png';
const PISS = 'PISS/PNG/piss_with_frame.png';
const PREGNANT_MAN_ASIA_WHITE_BORDER = 'pregnant%20man/png/Pregnant%20man_white%20border_asia.png';
const PREGNANT_MAN_BLACK_HAIR_WHITE_BORDER = 'pregnant%20man/png/Pregnant%20man_white%20border_black%20hair.png';
const PREGNANT_MAN_BLACK_SKIN_WHITE_BORDER = 'pregnant%20man/png/Pregnant%20man_white%20border_black%20skin.png';
const PREGNANT_MAN_BLONDE_WHITE_BORDER = 'pregnant%20man/png/Pregnant%20man_white%20border_blondie.png';
const PREGNANT_MAN_RED_HAIR_WHITE_BORDER =
  'pregnant%20man/png/Pregnant%20man_white%20border_red%20hair%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20.png';
const PREGNANT_WOMAN_BLACK_HAIR_GREEN_SHIRT_WHITE_BORDER =
  'pregnant%20woman/png/Pregnant%20woman_white_border_black%20hair%20green%20shirt.png';
const PREGNANT_WOMAN_BLACK_HAIR_WHITE_BORDER = 'pregnant%20woman/png/Pregnant%20woman_white_border_black%20hair.png';
const PREGNANT_WOMAN_BLACK_SKIN_WHITE_BORDER = 'pregnant%20woman/png/Pregnant%20woman_white_border_black%20woman.png';
const PREGNANT_WOMAN_BLONDE_WHITE_BORDER = 'pregnant%20woman/png/Pregnant%20woman_white_border_blondie.png';
const PREGNANT_WOMAN_BROWN_HAIR_WHITE_BORDER = 'pregnant%20woman/png/Pregnant%20woman_white_border_brown%20hair.png';
const PREGNANT_WOMAN_RED_HAIR_WHITE_BORDER =
  'pregnant%20woman/png/Pregnant%20woman_white_border_red%20hair%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20.png';
const ROCKET_SPACEMAN_WITH_BORDER = 'ROCKET%20SPACEMAN/PNG/rocket-spaceman_with-border.png';
const SALTY = 'SALTY/PNG/salty.png';
const SICK_2_WITH_BORDER = 'SICK/PNG/sick2_with_border.png';
const SICK_1_WITH_BORDERDARK_WITH_FRAME = 'SICK/PNG/with%20borderdark%20with%20frame.png';
const SLIME_WITH_FRAME = 'SLIME/PNG/slime_with_frame.png';
const SPHAGETTI_BATH_WITH_FRAME = 'SPHAGETTI%20BATH/PNG/sphagetti%20bath_with_frame.png';
const THUG_LIFE_WITH_BORDER = 'THUG%20LIFE/PNG/thug_life_with_border_clean.png';
const WHUUT_WITH_FRAME = 'WHUUT/PNG/whuut_with-frame.png';
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

export const FREE_GLOBAL_STICKERS = [
  buildSticker('CAT', CAT_BORDER),
  buildSticker('FAIL', FAIL_BORDER),
  buildSticker('HYPE', HYPE_BORDER),
  buildSticker('PANTS_1', PANTS_1_WITH_FRAME),
  buildSticker('PANTS_2', PANTS_2_WITH_FRAME),
  buildSticker('PISS', PISS),
  buildSticker('PREGNANT_MAN_ASIA', PREGNANT_MAN_ASIA_WHITE_BORDER),
  buildSticker('PREGNANT_MAN_BLACK_HAIR', PREGNANT_MAN_BLACK_HAIR_WHITE_BORDER),
  buildSticker('PREGNANT_MAN_BLACK_SKIN', PREGNANT_MAN_BLACK_SKIN_WHITE_BORDER),
  buildSticker('PREGNANT_MAN_BLONDE', PREGNANT_MAN_BLONDE_WHITE_BORDER),
  buildSticker('PREGNANT_MAN_RED_HAIR', PREGNANT_MAN_RED_HAIR_WHITE_BORDER),
  buildSticker('PREGNANT_WOMAN_BLACK_HAIR_GREEN_SHIRT', PREGNANT_WOMAN_BLACK_HAIR_GREEN_SHIRT_WHITE_BORDER),
  buildSticker('PREGNANT_WOMAN_BLACK_HAIR', PREGNANT_WOMAN_BLACK_HAIR_WHITE_BORDER),
  buildSticker('PREGNANT_WOMAN_BLACK_SKIN', PREGNANT_WOMAN_BLACK_SKIN_WHITE_BORDER),
  buildSticker('PREGNANT_WOMAN_BLONDE', PREGNANT_WOMAN_BLONDE_WHITE_BORDER),
  buildSticker('PREGNANT_WOMAN_BROWN_HAIR', PREGNANT_WOMAN_BROWN_HAIR_WHITE_BORDER),
  buildSticker('PREGNANT_WOMAN_RED_HAIR', PREGNANT_WOMAN_RED_HAIR_WHITE_BORDER),
  buildSticker('ROCKET_SPACEMAN', ROCKET_SPACEMAN_WITH_BORDER),
  buildSticker('SALTY', SALTY),
  buildSticker('SICK_FLAME', SICK_2_WITH_BORDER),
  buildSticker('SICK_SKULL', SICK_1_WITH_BORDERDARK_WITH_FRAME),
  buildSticker('SLIME', SLIME_WITH_FRAME),
  buildSticker('SPHAGETTI_BATH', SPHAGETTI_BATH_WITH_FRAME),
  buildSticker('THUG_LIFE', THUG_LIFE_WITH_BORDER),
  buildSticker('WHUUT', WHUUT_WITH_FRAME),
];

export const PAID_GLOBAL_STICKERS = [
  buildSticker('TIP_HAND_FLIP', TIP_HAND_FLIP, 1),
  buildSticker('TIP_HAND_FLIP_COIN', TIP_HAND_FLIP_COIN, 1),
  buildSticker('TIP_HAND_FLIP_LBC', TIP_HAND_FLIP_LBC, 1),
  buildSticker('COMET_TIP', COMET_TIP, 25),
  buildSticker('LBC_COMET_TIP', LBC_COMET_TIP, 25),
  buildSticker('SMALL_TIP', SMALL_TIP, 25),
  buildSticker('SILVER_ODYSEE_COIN', SILVER_ODYSEE_COIN, 25),
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
