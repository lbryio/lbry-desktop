declare type HomepageObject = {
  icon: string,
  link: string,
  options: any,
  route: string,
  title: string,
};

declare type HomepageData = {
  [string]: HomepageObject,
  default: (any) => any,
};

declare type RowDataItem = {
  id: string,
  title: any,
  link?: string,
  help?: any,
  icon?: string,
  extra?: any,
  pinnedUrls?: Array<string>,
  pinnedClaimIds?: Array<string>, // takes precedence over pinnedUrls
  hideByDefault?: boolean,
  options?: {
    channelIds?: Array<string>,
    excludedChannelIds?: Array<string>,
    limitClaimsPerChannel?: number,
    pageSize?: number,
    releaseTime?: string,
    searchLanguages?: Array<string>,
  },
  route?: string,
  hideForUnauth?: boolean,
};
