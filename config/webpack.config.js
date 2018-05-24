const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const { join } = require('path');
const { NoEmitOnErrorsPlugin } = require('webpack');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const cssnano = require('cssnano');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

/** Build for github pages */
const baseHref = '/list-of-planets/';
const deployUrl = '/list-of-planets/';
const outDir = 'docs';

const rootPath = join(__dirname, '../');
const distPath = join(rootPath, outDir);
const srcPath = join(rootPath, 'src');

const ccBundleName = 'bundle.min.js';
const ccDistDirname = 'cc-dist';
const ccDistPath = join(rootPath, ccDistDirname);

module.exports = {
  mode: 'production',
  entry: {
    polyfills: [
      join(srcPath, 'polyfills.ts'),
      join(srcPath, 'theme.scss'),
      join(srcPath, 'styles.scss'),
    ],
  },
  output: {
    path: distPath,
    filename: '[name].[hash].js',
    publicPath: deployUrl,
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: { plugins: () => [autoprefixer(), cssnano()] },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new NoEmitOnErrorsPlugin(),

    /** Copy assets and CC bundle to dist */
    new CopyWebpackPlugin(
      [
        {
          context: ccDistDirname,
          to: '',
          from: { glob: ccBundleName, dot: true },
        },
        {
          context: 'src',
          to: '',
          from: { glob: 'assets/**/*', dot: true },
        },
        {
          context: 'src',
          to: '',
          from: { glob: 'favicon.ico', dot: true },
        },
      ],
      {
        ignore: ['.gitkeep', '**/.DS_Store', '**/Thumbs.db'],
        debug: 'warning',
      },
    ),

    /** Extract css from polyfills entry */
    new MiniCssExtractPlugin({
      filename: 'styles.[hash].css',
    }),

    /** Create template */
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    /** Set base href */
    new BaseHrefWebpackPlugin({ baseHref }),
    /** Inject CC bundle */
    new HtmlWebpackIncludeAssetsPlugin({
      assets: [ccBundleName],
      hash: true,
      append: true,
    }),
    /** Add defer attribute to scripts */
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
    }),
  ],
};
