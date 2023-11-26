const { resolve } = require('path');

const ESLintPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootPath = resolve(__dirname, './');
const paths = Object.freeze({
  root: rootPath,
  build: resolve(rootPath, './build'),
  public: resolve(rootPath, './public'),
});

module.exports = (_env, args) => {
  const isDevMode = args.mode !== 'production';

  return {
    entry: './src/index.ts',
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '...'],
    },
    output: {
      path: paths.build,
      filename: 'main-[contenthash].js',
      clean: true,
    },
    devServer: {
      static: {
        directory: paths.public,
      },
      hot: true,
      port: 3000,
      compress: true,
      client: {
        logging: 'warn',
        overlay: true,
        progress: true,
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: resolve(paths.public, './index.html'),
      }),
    ].concat(
      isDevMode
        ? [
          new ForkTsCheckerWebpackPlugin(),
          new ESLintPlugin({ extensions: 'ts', quiet: true }),
        ]
        : [
          new MiniCSSExtractPlugin(),
        ],
    ),
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'babel-loader',
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            isDevMode
              ? 'style-loader'
              : MiniCSSExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        },
      ],
    },
  };
};
