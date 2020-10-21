// @ts-ignore
import window from "global/window";
import { assetURL } from "onefx/lib/asset-url";

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === "[::1]" ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
  );

  return new Promise(resolve => {
    let registration: ServiceWorkerRegistration | null = null;
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", async () => {
        const swUrl = assetURL("./service-worker.js");

        if (isLocalhost) {
          // This is running on localhost. Lets check if a service worker still exists or not.
          if (await isServiceWorkerValid(swUrl)) {
            registration = await registerValidSW(swUrl);
          }

          // Add some additional logging to localhost, pointing developers to the
          // service worker/PWA documentation.
          await navigator.serviceWorker.ready;
          window.console.log(
            "This web app is being served cache-first by a service " +
              "worker. To learn more, visit https://goo.gl/SC7cgQ"
          );
        } else {
          // Is not local host. Just register service worker
          registration = await registerValidSW(swUrl);
        }
        resolve(registration);
      });
    }
  });
}

async function registerValidSW(
  swUrl: string
): Promise<ServiceWorkerRegistration | null> {
  try {
    const registration = await navigator.serviceWorker.register(swUrl);
    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      if (!installingWorker) {
        return;
      }
      installingWorker.onstatechange = () => {
        if (installingWorker.state === "installed") {
          if (navigator.serviceWorker.controller) {
            // At this point, the old content will have been purged and
            // the fresh content will have been added to the cache.
            // It's the perfect time to display a "New content is
            // available; please refresh." message in your web app.
            window.console.log("New content is available; please refresh.");
          } else {
            // At this point, everything has been precached.
            // It's the perfect time to display a
            // "Content is cached for offline use." message.
            window.console.log("Content is cached for offline use.");
          }
        }
      };
    };
    return registration;
  } catch (error) {
    window.console.error("Error during service worker registration:", error);
    return null;
  }
}

async function isServiceWorkerValid(swUrl: string): Promise<boolean> {
  try {
    const response = await fetch(swUrl);
    // Ensure service worker exists, and that we really are getting a JS file.
    if (
      response.status === 404 ||
      String(response.headers.get("content-type")).indexOf("javascript") === -1
    ) {
      // No service worker found. Probably a different app. Reload the page.
      const registration = await navigator.serviceWorker.ready;
      await registration.unregister();
      window.location.reload();
      return false;
    }
    return true;
  } catch (e) {
    window.console.log(
      "No internet connection found. App is running in offline mode."
    );
    return false;
  }
}
