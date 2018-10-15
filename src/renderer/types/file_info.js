// @flow

export type FileInfo = {
  absolute_channel_position: ?number,
  name: string,
  channelName: ?string,
  pending?: boolean,
  channel_claim_id: string,
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
  outpoint: string,
  file_name: string,
  written_bytes: number,
  total_bytes: number,
  download_path: string,
  completed: boolean,
  claim_id: string,
};
