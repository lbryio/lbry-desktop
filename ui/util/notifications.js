export const getNotificationFromClaim = (claim) => {
  // create a notification object from claim
  const claimName = claim.name;
  const claimTitle = claim.title;

  const signingChannel = claim.signing_channel;
  const channelUrl = signingChannel && signingChannel.permanent_url;
  const claimThumbnail = claim.value.thumbnail;
  const channelThumbnail = signingChannel.value.thumbnail;

  const dynamic = {};
  dynamic.claim_name = claimName;
  dynamic.channel_url = channelUrl;
  dynamic.claim_title = claimTitle;
  dynamic.claim_thumbnail = claimThumbnail;
  dynamic.channel_thumbnail = channelThumbnail;

  const target = `lbry://${claimName}#${claim.claim_id}`;
  const device = { target };

  const notificationParams = {};
  notificationParams.dynamic = dynamic;
  notificationParams.device = device;

  const timestamp = new Date().toISOString();
  const notification = {};
  notification.notification_rule = 'new_content';
  notification.notification_params = notificationParams;
  notification.is_seen = false;
  notification.is_read = false;
  notification.active_at = timestamp;
  notification.created_at = timestamp;
  notification.updated_at = timestamp;
  notification.id = claim.claim_id;

  return notification;
};

/*
id(pin):1063634811
user_id(pin):1006101
type(pin):"new_content"
notification_rule(pin):"new_content"
is_app_readable(pin):true
is_read(pin):false
is_emailed(pin):true
is_device_notified(pin):true
active_at(pin):"2022-05-07T21:47:28Z"
created_at(pin):"2022-05-07T21:47:28Z"
updated_at(pin):"2022-05-07T21:48:41Z"
is_seen(pin):false
is_deleted(pin):false
dynamic: {
  claim_name(pin):"macbook-logic-board-repair-livestream-3"
  channel_url(pin):"lbry://@rossmanngroup#aa5544b6778d3620d57d8dcd3229c6c59354857a"
  claim_title(pin):"Macbook logic board repair livestream with Louis Rossmann"
  claim_thumbnail(pin):"https://thumbnails.lbry.com/3zuzWlc8jsg"
  channel_thumbnail(pin):"https://thumbnails.lbry.com/UCl2mFZoRqjw_ELax4Yisf6w"
}

notification_rule
notificatoin_parameters { dynamic: { claim_name:, channel_url:, claim_title:, claim_thumbnail:, channel_thumbnail:, }
is_read
is_seen

 */
