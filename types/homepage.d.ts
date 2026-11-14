type HomepageObject = {
  icon: string;
  link: string;
  options: any;
  route: string;
  title: string;
};

// Flow allowed a named prop alongside a mismatching index signature;
// TS needs the intersection form to express the same shape.
type HomepageData = { [key: string]: HomepageObject } & {
  default: (arg: any) => any;
};

type RowDataItem = {
  title: any;
  link?: string;
  help?: any;
  icon?: string;
  extra?: any;
  pinnedUrls?: Array<string>;
  options?: {
    channelIds?: Array<string>;
    limitClaimsPerChannel?: number;
    pageSize?: number;
    languages?: Array<string>;
  };
  route?: string;
  hideForUnauth?: boolean;
};
