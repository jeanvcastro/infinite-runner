const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const mode = process.env.NODE_ENV || "development";

module.exports = {
  mode: mode,

  output: {
    filename: "assets/js/bundle.min.js",
    path: path.resolve(__dirname, "dist"),
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/css/bundle.min.css",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 3000,
  },

  stats: "errors-only",
};
