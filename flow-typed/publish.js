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
  thumbnailError?: boolean,
  description?: string,
  language?: string,
  releaseTime?: number,
  releaseTimeEdited?: number,
  releaseTimeError?: string,
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
  nsfw: boolean,
  isMarkdownPost?: boolean,
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
    amount: string,
    currency: string,
  },
  claim: StreamClaim,
  nsfw: boolean,
  tags: Array<Tag>,
};

declare type TusUploader = any;

declare type FileUploadSdkParams = {
  file_path: string | File,
  claim_id: ?string,
  name: ?string,
  preview?: boolean,
  remote_url?: string,
  thumbnail_url?: string,
  title?: string,
  // Temporary values; remove when passing to SDK
  guid: string,
  uploadUrl?: string,
};

declare type FileUploadItem = {
  params: FileUploadSdkParams,
  file: File,
  fileFingerprint: string,
  progress: string,
  status?: string,
  uploader?: TusUploader | XMLHttpRequest,
  resumable: boolean,
};
