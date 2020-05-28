// @flow
// We should be using the `reselect` that comes with flow-typed but it's going to take a ton of work to get that working
// without any errors. For now it's any type
declare module 'reselect' {
  declare module.exports: any;
}
