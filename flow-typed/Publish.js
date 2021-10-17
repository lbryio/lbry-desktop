// @flow

declare type UpdatePublishFormData = {
  filePath?: string,
  contentIsFree?: boolean,
  fee?: {
    amount: string,
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
  bid?: string,
  bidError?: string,
  otherLicenseDescription?: string,
  licenseUrl?: string,
  licenseType?: string,
  uri?: string,
  nsfw: boolean,
};
