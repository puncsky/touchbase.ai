const path = require("path");
const UglifyJSPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const glob = require("glob");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const process = require("global/process");

const ANALYZE = false;
const PROD = process.env.NODE_ENV === "production";
const OUTPUT_DIR = "dist/";

module.exports = {
  mode: PROD ? "production" : "development",
  entry: glob.sync("./src/client/javascripts/*.ts*").reduce(
    (entries, entry) =>
      Object.assign(entries, {
        [entry
          .replace("./src/client/javascripts/", "")
          .replace(/(\.ts|\.tsx)$/, "")]: entry
      }),
    {}
  ),
  output: {
    filename: PROD ? "[name]-[chunkhash].js" : "[name].js",
    path: path.resolve(__dirname, OUTPUT_DIR)
  },
  ...(PROD ? {} : { devtool: "source-map" }),
  module: {
    rules: [
      {
        test: /(\.js|\.ts|\.tsx|\.jsx)$/,
        use: ["cache-loader", "babel-loader"],
        include: path.resolve("src")
      },
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: [/node_modules/, /build/, /__test__/]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: require("./babel.config")
        }
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
      }
    ]
  },
  resolve: {
    // options for resolving module requests
    // (does not apply to resolving to loaders)
    modules: ["node_modules", path.resolve(__dirname, "src")],
    // directories where to look for modules
    extensions: [".js", ".json", ".jsx", ".ts", ".tsx", ".mjs"],
    // extensions that are used
    alias: {},
    fallback: {
      fs: false,
      tls: false,
      net: false,
      path: false,
      zlib: false,
      http: false,
      https: false,
      stream: false,
      crypto: false,
      util: false
    }
    /* Alternative alias syntax (click to show) */
    /* Advanced resolve configuration (click to show) */
  },
  plugins: [
    new WebpackManifestPlugin({
      basePath: "/",
      fileName: "asset-manifest.json"
    }),
    ...(ANALYZE ? [new BundleAnalyzerPlugin()] : []),
    ...(PROD
      ? [
          new UglifyJSPlugin({
            cache: true,
            parallel: true
          }),
          new webpack.DefinePlugin({
            "process.env": {
              NODE_ENV: JSON.stringify("production")
            }
          })
        ]
      : [])
  ]
};
