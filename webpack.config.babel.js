import autoprefixer from 'autoprefixer';
import autoreset from 'postcss-autoreset';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { ContextReplacementPlugin, HotModuleReplacementPlugin } from 'webpack';

const sassLoaders = [
  'css-loader',
  'postcss-loader',
  `sass-loader?includePaths[]=${path.resolve(__dirname, './src')}`
];

export default {
  entry: {
    app: [
      'webpack-dev-server/client?http://0.0.0.0:8080',
      'webpack/hot/only-dev-server',
      path.resolve('./src/index.js')
    ]
  },
  output: {
    path: path.resolve('./dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        include: path.join(__dirname, 'src'),
        loaders: ['react-hot', 'babel']
      },
      {
        test: /\.html$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'html'
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules|bower_components)/,
        loader: process.env.NODE_ENV !== 'production' ?
          `style!${sassLoaders.join('!')}` :
          ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'file'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new ContextReplacementPlugin(/moment[\/\\]locale$/, /en|bg/),
    new HotModuleReplacementPlugin()
  ],
  postcss: () => [
    autoprefixer({
      browsers: ['last 2 versions']
    }),
    autoreset({
      reset: {
        margin: 0,
        padding: 0
      },
      rulesMatcher: 'bem'
    })
  ],
  resolve: {
    extensions: ['', '.js', '.scss']
  },
  devServer: {
    publicPath: '/dist/',
    host: '0.0.0.0',
    port: '8080',
    filename: 'bundle.js',
    hot: true,
    historyApiFallback: true,
    stats: {
      chunkModules: false,
      colors: true,
      progress: true
    }
  }
};
