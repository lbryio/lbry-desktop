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
  options?: {
    channelIds?: Array<string>,
    limitClaimsPerChannel?: number,
    pageSize: number,
  },
  route?: string,
  hideForUnauth?: boolean,
};
