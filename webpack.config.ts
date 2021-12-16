import { join } from "path";
import { Configuration } from "webpack";
import { compilerOptions } from "./tsconfig.json";
import nodeExternals from "webpack-node-externals";

const { NODE_ENV = 'development' } = process.env
const isDevMode = NODE_ENV != 'production'

const getAliaces = () => {
  return Object.entries(compilerOptions.paths)
    .reduce((acc, [key, [value]]) => {
      acc[key] = join(__dirname, value)
      return acc
    }, {} as { [key: string]: string })
}

const externalsParams = {
  modulesFromFile: {
    exclude: ['preact/compat']
  }
}

module.exports = {
  entry: {
    'index': './index.tsx'
  },
  output: {
    path: join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: './dist/'
  },
  target: 'node',
  externals: [nodeExternals(externalsParams) as any],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    alias: getAliaces(),
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
  },
  mode: isDevMode ? 'development' : 'production',
  devtool: isDevMode ? 'source-map' : false,
  watch: isDevMode,
} as Configuration