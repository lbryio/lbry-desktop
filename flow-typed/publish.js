// @flow

declare type Paywall = 'free' | 'fiat' | 'sdk';

declare type UpdatePublishFormData = {
  claim_id?: string,
  filePath?: string,
  paywall?: Paywall,
  fee?: {
    amount: string,
    currency: string,
  },
  fiatPurchaseFee?: Price,
  fiatPurchaseEnabled?: boolean,
  fiatRentalFee?: Price,
  fiatRentalExpiration?: Duration,
  fiatRentalEnabled?: boolean,
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
  nsfw?: boolean,
  isMarkdownPost?: boolean,
  tags?: Array<Tag>,
  restrictedToMemberships?: Array<string>,
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
  paywall: Paywall,
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
  sdkRan?: boolean,
  isMarkdown: boolean,
};

declare type UploadStatus = 'error' | 'retry' | 'notify_ok' | 'notify_failed' | 'conflict';
// declare type PublishStage = '1_uploading' | '2_upload_done' | '3_sdk_publishing' | '4_skd_publish_done';

declare type FileUploadItem = {
  params: FileUploadSdkParams,
  file: File,
  fileFingerprint: string,
  progress: string,
  status?: UploadStatus,
  sdkRan?: boolean,
  uploader?: TusUploader | XMLHttpRequest,
  resumable: boolean,
};
