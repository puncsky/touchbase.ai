self.addEventListener("push", (event) => {
  const icon = "/favicon.png";
  let {data} = event;
  if (event.data) {
    data = data.json();

    event.waitUntil(
      // @ts-ignore
      self.registration.showNotification(data.text, {
        body: data.body,
        icon,
        data: {
          url: data.url
        }
      })
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

