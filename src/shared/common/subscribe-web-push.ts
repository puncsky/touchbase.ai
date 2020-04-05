import { axiosInstance } from "../onefx-auth-provider/email-password-identity-provider/view/axios-instance";
import { registerServiceWorker } from "../register-service-worker";
import { userId, webPushPublicKey } from "./browser-state";

let registration: ServiceWorkerRegistration | null;

export async function setupSW(): Promise<void> {
  registration = await registerServiceWorker();
}

export async function subscribePush(): Promise<boolean> {
  if (!registration) {
    return false;
  }
  if (!userId) {
    return false;
  }

  const pushSubscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: Buffer.from(webPushPublicKey, "base64")
  });

  await axiosInstance.post("/api/web-push-token", pushSubscription);
  return true;
}
