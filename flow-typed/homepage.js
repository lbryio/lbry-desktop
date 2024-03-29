declare type HomepageObject = {
  icon: string,
  link: string,
  options: any,
  route: string,
  title: string,
};

declare type HomepageData = {
  [string]: HomepageObject,
  default: any => any,
};

declare type RowDataItem = {
  title: any,
  link?: string,
  help?: any,
  icon?: string,
  extra?: any,
  pinnedUrls?: Array<string>,
  options?: {
    channelIds?: Array<string>,
    limitClaimsPerChannel?: number,
    pageSize?: number,
    languages?: Array<string>,
  },
  route?: string,
  hideForUnauth?: boolean,
};
