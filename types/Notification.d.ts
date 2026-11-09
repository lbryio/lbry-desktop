/*
  Toasts:
    - First-in, first-out queue
    - Simple messages that are shown in response to user interactions
    - Never saved
    - If they are the result of errors, use the isError flag when creating
    - For errors that should interrupt user behavior, use Error
*/
type ToastParams = {
  message: string;
  title?: string;
  linkText?: string;
  linkTarget?: string;
  isError?: boolean;
};

type Toast = {
  id: string;
  params: ToastParams;
};

type DoToast = {
  type: string; // ACTIONS.CREATE_TOAST
  data: Toast;
};

/*
  Notifications:
    - List of notifications based on user interactions/app notifications
    - Always saved, but can be manually deleted
    - Can happen in the background, or because of user interaction (ex: publish confirmed)
*/
// Flow name: Notification — renamed to avoid colliding with the DOM's Notification type
type LbryNotification = {
  id: string; // Unique id
  dateCreated: number;
  isRead: boolean; // Used to display "new" notifications that a user hasn't seen yet
  source?: string; // The type/area an notification is from. Used for sorting (ex: publishes, transactions)
  // We may want to use priority/isDismissed in the future to specify how urgent a notification is
  // and if the user should see it immediately
  // isDissmied: boolean,
  // priority?: number
};

type DoNotification = {
  type: string; // ACTIONS.CREATE_NOTIFICATION
  data: LbryNotification;
};

type DoEditNotification = {
  type: string; // ACTIONS.EDIT_NOTIFICATION
  data: {
    notification: LbryNotification;
  };
};

type DoDeleteNotification = {
  type: string; // ACTIONS.DELETE_NOTIFICATION
  data: {
    id: string; // The id to delete
  };
};

/*
  Errors:
    - First-in, first-out queue
    - Errors that should interupt user behavior
    - For errors that can be shown without interrupting a user, use Toast with the isError flag
*/
type ErrorNotification = {
  title: string;
  text: string;
};

type DoError = {
  type: string; // ACTIONS.CREATE_ERROR
  data: ErrorNotification;
};

type DoDismissError = {
  type: string; // ACTIONS.DISMISS_ERROR
};

/*
  NotificationState
*/
type NotificationState = {
  notifications: Array<LbryNotification>;
  errors: Array<ErrorNotification>;
  toasts: Array<Toast>;
};

type WebNotification = {
  active_at: string;
  created_at: string;
  id: number;
  is_app_readable: boolean;
  is_device_notified: boolean;
  is_emailed: boolean;
  is_read: boolean;
  is_seen: boolean;
  notification_parameters: {
    device: {
      analytics_label: string;
      image_url: string;
      is_data_only: boolean;
      name: string;
      placeholders: string | null | undefined;
      target: string;
      text: string;
      title: string;
      type: string;
    };
    dynamic: {
      comment_author: string;
      reply_author: string;
      hash: string;
      claim_title: string;
      comment?: string;
      channel_url: string;
    };
    email: {};
  };
  notification_rule: string;
  type: string;
  updated_at: string;
  user_id: number;
  group_count?: number;
};

type NotificationCategory = {
  name: string;
  types: Array<string> | null | undefined;
};
