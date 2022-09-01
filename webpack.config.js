// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const HtmlWebpackPlugin = require('html-webpack-plugin');
const server_port = process.env.PORT;
const server_host = process.env.HOST;
module.exports = {
  entry: {
    'app': './src/index.tsx',
    'sw': './src/sw/sw.ts',
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  devServer: {
    historyApiFallback: true,
    port: server_port,
    host: server_host,
    allowedHosts: 
    [ '.herokuapp.com']
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      assets: path.resolve(__dirname, 'src/assets'),
      components: path.resolve(__dirname, 'src/components'),
      core: path.resolve(__dirname, 'src/core'),
      pages: path.resolve(__dirname, 'src/pages'),
      remoteApi: path.resolve(__dirname, 'src/remoteApi'),
      styles: path.resolve(__dirname, 'src/styles'),
      types: path.resolve(__dirname, 'src/types'),
      hooks: path.resolve(__dirname, 'src/hooks'),
      AppContext: path.resolve(__dirname, 'src/AppContext'),
      hocs: path.resolve(__dirname, 'src/hocs'),
      reduxStore: path.resolve(__dirname, 'src/reduxStore'),
      utils: path.resolve(__dirname, 'src/utils'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './www/index.html'
    })
  ]
};
