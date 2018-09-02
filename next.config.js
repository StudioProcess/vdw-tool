const withTypescript = require("@zeit/next-typescript");
const withProgressBar = require("next-progressbar");
const path = require("path");

module.exports = withProgressBar(
  withTypescript({
    webpack: (config) => {
      // Fixes npm packages that depend on `fs` module
      config.node = {
        fs: 'empty'
      }

      // Perform customizations to webpack config
      config.module.rules.push(
        // SCSS support
        {
          test: /\.scss/,
          use: [
            {
              loader: "emit-file-loader",
              options: {
                name: "dist/[path][name].[ext].js",
              },
            },
            {
              loader: "babel-loader",
              options: {
                babelrc: false,
                extends: path.resolve(__dirname, "./.babelrc"),
              },
            },
            "styled-jsx-css-loader",
          ]
        },
        // shader import support
        {
          test: /\.glsl$/,
          use: [
            {
              loader: "emit-file-loader",
              options: {
                name: "dist/[path][name].[ext]",
              },
            },
            "babel-loader",
            "webpack-glsl-loader"
          ]
        },
        // txt loader
        {
          test: /\.txt$/,
          use: [
            {
              loader: "emit-file-loader",
              options: {
                name: "dist/[path][name].[ext]",
              },
            },
            "raw-loader",
          ]
        },
        // md loader
        {
          test: /\.md$/,
          use: [
            {
              loader: "emit-file-loader",
              options: {
                name: "dist/[path][name].[ext]",
              },
            },
            "raw-loader",
          ]
        },
        // salat loader
        {
          test: /.salat$/,
          use: [
            {
              loader: "emit-file-loader",
              options: {
                name: "dist/[path][name].[ext]",
              },
            },
            "raw-loader",
          ]
        },
      );

      return config
    },
    exportPathMap: () => ({
      "/": { page: "/" },
      "/controller": { page: "/controller" },
    })
  })
);
