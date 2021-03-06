const path = require("path");
const Webpack = require("webpack");

const nodeExternals = require("webpack-node-externals");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const packageJson = require("./package.json");
const debug = process.env.NODE_ENV !== "production";

console.log(`Building ${packageJson.name} v${packageJson.version} in ${debug ? "debug" : "prod"} mode.`);

module.exports = {
    entry: ["./src/index.ts"],
    target: "node",
    externals: [nodeExternals()],

    output: {
        filename: "index.js",
        path: path.resolve("./build"),
        publicPath: "/",
        library: packageJson.name,
        libraryTarget: "umd"
    },

    devtool: debug ? "source-map" : false,
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json", ".jsx"],
        modules: [
            path.resolve("./node_modules"),
            path.resolve("./src")
        ],
        symlinks: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loaders: [
                    {
                        loader: "babel-loader",
                        options: {
                            babelrc: false,
                            extends: path.join(process.cwd(), "./.babelrc")
                        }
                    },
                    "awesome-typescript-loader",
                ],
            },
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                loader: "babel-loader",
                options: {
                    babelrc: false,
                    extends: path.join(process.cwd(), "./.babelrc")
                }
            },
            // {
            //     enforce: "pre",
            //     test: /\.js$/,
            //     loader: "source-map-loader"
            // }
        ]
    },
    plugins: [
        new Webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimize: false
	}
};
