declare type BlocklistState = {
  blockedChannels: Array<string>,
  geoBlockedList: ?GBL,
};

declare type BlocklistAction = {
  type: string,
  data: {
    uri: string,
  },
};

// ****************************************************************************
// Geo-blocked list (GBL)
// ****************************************************************************

declare type GeoChannelId = string;

declare type GeoRestriction = {
  id: string,
  trigger?: string,
  reason?: string,
  message?: string,
};

declare type GeoConfig = {
  countries?: Array<GeoRestriction>,
  continents?: Array<GeoRestriction>,
  specials?: Array<GeoRestriction>,
};

declare type GBL = {
  livestreams?: { [GeoChannelId]: GeoConfig },
  videos?: { [GeoChannelId]: GeoConfig }
};

// ****************************************************************************
// ****************************************************************************
