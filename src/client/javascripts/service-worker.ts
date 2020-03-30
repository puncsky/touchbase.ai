self.addEventListener("push", (event: Event & any) => {
  const title = "Yay a message.";
  const body = "We have received a push message.";
  const icon = "/favicon.png";
  const tag = "simple-push-demo-notification-tag";
  let data = event.data;
  if (event.data) {
    data = data.json();
    event.waitUntil(
      // @ts-ignore
      self.registration.showNotification(data.text, {
        title,
        body: body,
        icon: icon,
        tag: tag,
        data: data
      })
    );
  }
});
