type UpdatePublishFormData = {
  filePath?: string;
  contentIsFree?: boolean;
  fee?: {
    amount: string;
    currency: string;
  };
  title?: string;
  thumbnail_url?: string;
  uploadThumbnailStatus?: string;
  thumbnailPath?: string;
  thumbnailError?: boolean;
  description?: string;
  language?: string;
  channel?: string;
  channelId?: string;
  name?: string;
  nameError?: string;
  bid?: number;
  bidError?: string;
  otherLicenseDescription?: string;
  licenseUrl?: string;
  licenseType?: string;
  uri?: string;
  nsfw: boolean;
  isMarkdownPost?: boolean;
};

type PublishParams = {
  name: string | null | undefined;
  bid: number | null | undefined;
  filePath?: string;
  description: string | null | undefined;
  language: string;
  publishingLicense?: string;
  publishingLicenseUrl?: string;
  thumbnail: string | null | undefined;
  channel: string;
  channelId?: string;
  title: string;
  contentIsFree: boolean;
  uri?: string;
  license: string | null | undefined;
  licenseUrl: string | null | undefined;
  fee?: {
    amount: string;
    currency: string;
  };
  claim: StreamClaim;
  nsfw: boolean;
  tags: Array<Tag>;
};
