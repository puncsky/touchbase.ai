// @ts-ignore
import window from "global/window";
// @ts-ignore
import load from "load-script";

export function loadScript(
  link: string,
  cb: (...args: any[]) => unknown
): void {
  window.loadScriptLoaded = window.loadScriptLoaded || {};
  if (window.loadScriptLoaded[link]) {
    cb();
    return;
  }
  load(link, (...args: Array<any>) => {
    window.loadScriptLoaded[link] = true;
    cb(...args);
  });
}
