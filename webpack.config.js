const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [
  {
    mode: "production",
    entry: "./src/main.ts",
    output: {
      path: path.join(__dirname, "dist"),
      filename: "main.js",
    },
    cache: {
      type: "filesystem",
      buildDependencies: {
        config: [__filename],
      },
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: "babel-loader",
          exclude: /node_modules/,
          options: {
            cacheDirectory: true,
          },
        },
        {
          test: /\.mjs$/,
          loader: "babel-loader",
          exclude: /node_modules\/(?!(pixi.js)\/).*/,
          options: {
            cacheDirectory: true,
          },
        },
      ],
    },
    target: ["web", "es5"],
    resolve: {
      extensions: [".ts", ".js"],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Simas test",
        template: "./public/index.html",
      }),
      new CopyPlugin({
        patterns: [
          {
            from: "./public",
            to: "./",
            globOptions: {
              ignore: ["**/index.html"],
            },
          },
        ],
      }),
    ],
    devServer: {
      static: "./dist",
      compress: true,
      port: 9000,
      proxy: [
        {
          context: ["/api"],
          target: "http://localhost:8788",
        },
      ],
      client: {
        overlay: {
          errors: true,
          warnings: false,
          runtimeErrors: true,
        },
      },
      watchFiles: {
        paths: ["./public/**/*"],
        options: {
          ignored: /node_modules/,
          usePolling: false,
        },
      },
    },
    performance: {
      maxAssetSize: 350000,
      maxEntrypointSize: 300000,
    },
  },
];
