const assert = require("assert");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const mode = process.env.NODE_ENV || "development";

class PreloadPlugin {
  insertLinks(html, compilation) {
    const links = [];

    Object.keys(compilation.assets).forEach((asset) => {
      if (/\.(png|gif|jpe?g|svg)/.test(asset)) {
        links.push(`<link rel="preload" as="image" href="${asset}"/>`);
      }
    });

    if (html.includes("</head>")) {
      // If a valid closing </head> is found, insert the new <link>s right before it.
      return html.replace("</head>", links.join("") + "</head>");
    }

    if (html.includes("<body>")) {
      // If there's a <body> but no <head>, create a <head> containing the <head>.
      return html.replace("<body>", `<head>${links.join("")}\n</head><body>`);
    }

    throw new Error(`The HTML provided did not contain a </head> or a <body>`);
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(this.constructor.name, (compilation) => {
      const [HtmlWebpackPlugin] = compiler.options.plugins.filter(
        (plugin) => plugin.constructor.name === "HtmlWebpackPlugin"
      );
      assert(HtmlWebpackPlugin, "Unable to find an instance of HtmlWebpackPlugin in the current compilation.");
      const hook = HtmlWebpackPlugin.constructor.getHooks(compilation).beforeEmit;

      hook.tapAsync(this.constructor.name, (htmlPluginData, callback) => {
        try {
          htmlPluginData.html = this.insertLinks(htmlPluginData.html, compilation);
          callback(null, htmlPluginData);
        } catch (error) {
          callback(error);
        }
      });
    });
  }
}

module.exports = {
  mode: mode,
  entry: "./src/js/index.js",
  output: {
    clean: true,
    filename: "assets/js/bundle.min.js",
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/css/bundle.min.css",
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      hash: true,
      favicon: "./src/img/favicon.ico",
    }),
    new PreloadPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.(png|gif|ico|jpe?g|svg)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/img/[name][ext]?[hash]",
        },
      },
      {
        test: /\.(woff2?|ttf|eot)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name][ext]?[hash]",
        },
      },
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
