// @flow

declare type UpdatePublishFormData = {
  filePath?: string,
  contentIsFree?: boolean,
  price?: {
    amount: number,
    currency: string,
  },
  title?: string,
  thumbnail_url?: string,
  uploadThumbnailStatus?: string,
  thumbnailPath?: string,
  description?: string,
  language?: string,
  channel?: string,
  channelId?: string,
  name?: string,
  nameError?: string,
  bid?: number,
  bidError?: string,
  otherLicenseDescription?: string,
  licenseUrl?: string,
  licenseType?: string,
  uri?: string,
  replace?: boolean,
};

declare type PublishParams = {
  name: ?string,
  bid: ?number,
  filePath?: string,
  description: ?string,
  language: string,
  publishingLicense?: string,
  publishingLicenseUrl?: string,
  thumbnail: ?string,
  channel: string,
  channelId?: string,
  title: string,
  contentIsFree: boolean,
  uri?: string,
  license: ?string,
  licenseUrl: ?string,
  fee?: {
    currency: string,
    amount: number,
  },
  replace?: boolean,

  // This is bad.
  // Will be removed for tags soon
  nsfw: boolean,
};
