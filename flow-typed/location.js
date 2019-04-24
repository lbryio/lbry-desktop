// @flow

declare type UrlLocation = {
  search: string,
  hash: string,
  host: string,
  hostname: string,
  href: string,
  key: string,
  origin: string,
  pathname: string,
  port: string,
  protocol: string,
  reload: () => void,
  replace: string => void,
  search: string,
  state: {},
};
