import { axiosInstance } from "../onefx-auth-provider/email-password-identity-provider/view/axios-instance";
import { registerServiceWorker } from "../register-service-worker";
import { userId, webPushPublicKey } from "./browser-state";

export async function subscribeWebPush(): Promise<void> {
  const registration = await registerServiceWorker();
  if (!registration) {
    return;
  }
  if (!userId) {
    return;
  }

  const pushSubscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: Buffer.from(webPushPublicKey, "base64")
  });

  await axiosInstance.post("/api/web-push-token", pushSubscription);
}
