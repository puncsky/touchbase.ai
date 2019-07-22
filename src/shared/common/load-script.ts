import window from "global/window";
import load from "load-script";

export function loadScript(link: string, cb: Function): void {
  window.loadScriptLoaded = window.loadScriptLoaded || {};
  if (window.loadScriptLoaded[link]) {
    return cb();
  }
  load(link, (...args) => {
    window.loadScriptLoaded[link] = true;
    cb(...args);
  });
}
