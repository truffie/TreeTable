const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const IS_SERVE = process.env.WEBPACK_SERVE ?? false;

const PATH_ENTRY = path.join(__dirname, 'src', 'index.tsx');
const PATH_TEMPLATE_ENTRY = path.join(__dirname, 'public', 'index.html');
const PATH_PUBLIC_FOLDER = path.join(__dirname, 'public');
const PATH_OUTPUT_FOLDER = path.join(__dirname, 'build');

module.exports = () => {
  const config = {
    mode: IS_DEVELOPMENT ? 'development' : 'production',
    devtool: IS_DEVELOPMENT ? 'source-map' : undefined,
    entry: PATH_ENTRY,
    output: {
      path: PATH_OUTPUT_FOLDER,
      filename: '[name].[fullhash:8].js',
      chunkFilename: '[name].[chunkhash:8].js',
      publicPath: 'auto',
    },
    resolve: {
      alias: {
        '@styles': path.resolve(__dirname, 'src/styles/'),
        '@api': path.resolve(__dirname, 'src/api'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.sass'],
      fallback: { process: false },
      modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    },
    devServer: {
      hot: true,
      open: true,
      compress: true,
      port: 3000,
      historyApiFallback: true,
      watchOptions: {
        ignored: /node_modules/,
      },
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                experimentalFileCaching: true,
              },
            },
          ],
        },
        {
          test: /\.s?[ca]ss$/i,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|webp|ico)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: ['@svgr/webpack'],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: PATH_TEMPLATE_ENTRY,
        filename: 'index.html?[fullhash:8]',
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[fullhash:8].css',
        chunkFilename: '[name].[chunkhash:8].css',
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: PATH_PUBLIC_FOLDER,
            filter: filepath => {
              switch (
                path
                  .normalize(filepath)
                  .substring(PATH_PUBLIC_FOLDER.length + 1)
              ) {
                case 'index.html':
                  return false;
                default:
                  return true;
              }
            },
          },
        ],
      }),
      new TsconfigPathsPlugin(),
    ],
    cache: {
      type: 'filesystem',
      cacheDirectory: path.resolve(__dirname, '.temp_cache'),
    },
  };

  if (IS_DEVELOPMENT && IS_SERVE) {
    config.plugins.push(new ReactRefreshWebpackPlugin());
    config.module.rules[0].use[1].options.getCustomTransformers = () => ({
      before: [ReactRefreshTypeScript()],
    });
  }

  return config;
};
