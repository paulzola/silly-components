
function getNotificationText(event) {
  if (event.type === 'comment') return `${event.user} прокомментировал`;
  if (event.type === 'like') return `${event.user} лайкнул`;
  if (event.type === 'follow') return `${event.user} подписался`;
  //
}