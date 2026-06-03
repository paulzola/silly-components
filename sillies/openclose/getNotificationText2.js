const notificationFormatters = {
  comment: (e) => `${e.user} прокомментировал`,
  like:    (e) => `${e.user} лайкнул`,
  follow:  (e) => `${e.user} подписался`,
};
const getNotificationText = (e) => notificationFormatters[e.type]?.(e) ?? '';