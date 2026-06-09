
function getNotificationText(event) {
  if (event.type === 'comment') return `${event.user} прокомментировал`;
  if (event.type === 'like') return `${event.user} лайкнул`;
  if (event.type === 'follow') return `${event.user} подписался`;
  //
}

const notificationFormatters = {
  comment: (e) => `${e.user} прокомментировал`,
  like:    (e) => `${e.user} лайкнул`,
  follow:  (e) => `${e.user} подписался`,
};
const getNotificationText = (e) => notificationFormatters[e.type]?.(e) ?? '';