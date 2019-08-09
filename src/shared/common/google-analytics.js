let loaded = true;
module.exports = function initGoogleTagmanager({ tid }) {
  if (!loaded) return;
  (function(w, d, s, l, i) {
    w[l] = w[l] || [];
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtag/js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", tid);
  initDataLayer({ tid });
};

const initDataLayer = ({ tid }) => {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", tid);
};
