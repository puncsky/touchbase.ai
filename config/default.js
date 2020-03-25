const { config } = require("dotenv");
config();

module.exports = {
  project: "touchbase.ai",
  server: {
    port: process.env.PORT || 4103,
    staticDir: "./dist",
    delayInitMiddleware: false,
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
      console.warn("FULLCONTACT_API_KEY is empty")
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
