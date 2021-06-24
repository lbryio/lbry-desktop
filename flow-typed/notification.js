// @flow
declare type WebNotification = {
  active_at: string,
  created_at: string,
  id: number,
  is_app_readable: boolean,
  is_device_notified: boolean,
  is_emailed: boolean,
  is_read: boolean,
  is_seen: boolean,
  notification_parameters: {
    device: {
      analytics_label: string,
      image_url: string,
      is_data_only: boolean,
      name: string,
      placeholders: ?string,
      target: string,
      text: string,
      title: string,
      type: string,
    },
    dynamic: {
      comment_author: string,
      reply_author: string,
      hash: string,
      claim_title: string,
      comment?: string,
      channel_url: string,
    },
    email: {},
  },
  notification_rule: string,
  type: string,
  updated_at: string,
  user_id: number,
  group_count?: number,
};

declare type NotificationCategory = {
  name: string,
  types: ?Array<string>,
};
