// @flow

export type FileInfo = {
  absolute_channel_position: ?number,
  name: string,
  channelName: ?string,
  pending?: boolean,
  channel_claim_id: string,
  file_name: string,
  download_path: string,
  value?: {
    publisherSignature: {
      certificateId: string,
    },
  },
  metadata: {
    publisherSignature: {
      certificateId: string,
    },
  },
};
