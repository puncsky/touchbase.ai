const { config } = require("dotenv");
config();

module.exports = {
  project: "touchbase.ai",
  server: {
    port: process.env.PORT || 4103,
    proxy: false,
    staticDir: "./dist",
    delayInitMiddleware: true,
    cookie: {
      secrets: ["insecure plain text", "insecure secret here"]
    },
    noSecurityHeadersRoutes: {
      "/api-gateway/": true,
      "/api/": true
    },
    noCsrfRoutes: {
      "/api-gateway/": true,
      "/api/": true
    }
  },
  ssm: {
    enabled: false
  },
  gateways: {
    logger: {
      enabled: true,
      level: "debug"
    },
    mongoose: {
      uri: process.env.MONGODB_URI
    },
    fullContactApiKey:
      process.env.FULLCONTACT_API_KEY ||
      console.warn("FULLCONTACT_API_KEY is empty"),
    webPush: {
      privateKey: process.env.WEB_PUSH_PRIVATE_KEY,
      publicKey:
        "BDWKLyZV1ynrpg1E6SSpx25-NR-GmUiFI5UskaPFltyivyVtOkkZzM4raj4-KVdU6WjX4ZMDEsQP6vmI_cGoLSw",
      mailto: "mailto:me@touchbase.ai",
      gcmApiKey: "TODO"
    }
  },
  analytics: {
    googleTid: "UA-149377173-1"
  }
  // csp: {
  //   "default-src": ["none"],
  //   "manifest-src": ["self"],
  //   "style-src": ["self", "unsafe-inline", "https://fonts.googleapis.com/css"],
  //   "frame-src": [],
  //   "connect-src": ["self"],
  //   "child-src": ["self"],
  //   "font-src": ["self", "data:", "https://fonts.gstatic.com/"],
  //   "img-src": ["*"],
  //   "media-src": ["self"],
  //   "object-src": ["self"],
  //   "script-src": ["self", "https://www.google-analytics.com/"]
  // },
};
