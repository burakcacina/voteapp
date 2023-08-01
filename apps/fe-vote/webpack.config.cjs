const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    style: path.join(__dirname, "./src/scss/styles.ts"),
    // bootstrap: path.join(__dirname, "./src/scss/bootstrap.ts"),
    index: path.join(__dirname, "./src/index.ts"),
  },
  output: {
    path: path.join(__dirname, "./dist/"),
    filename: "[name].js",
  },
  module: ["node_modules"],
  mode: "development",
  // Enable sourcemaps for debugging webpack's output.
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [
      "",
      ".webpack.js",
      ".web.js",
      ".ts",
      ".tsx",
      ".js",
      ".csj",
      ".css",
      ".scss",
    ],
    modules: ["node_modules"],
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.(s(a|c)ss)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
  ],
  // Other options...
};
