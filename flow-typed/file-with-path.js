// @flow

declare type FileWithPath = {
  file: File,
  // The full path will only be available in
  // the application. For browser, the name
  // of the file will be used.
  path: string,
}
