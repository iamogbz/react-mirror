import * as path from "path";
import { execSync } from "child_process";
import { Configuration } from "webpack";
import * as nodeExternals from "webpack-node-externals";
import { WebpackCompilerPlugin } from "webpack-compiler-plugin";

const configuration: Configuration = {
    devtool: "source-map",
    entry: "./src",
    mode: "production",
    module: {
        rules: [
            {
                exclude: /(node_modules|bower_components)/,
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-typescript"],
                        },
                    },
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: "tsconfig.prod.json",
                        },
                    },
                ],
            },
        ],
    },
    output: {
        filename: "main.js",
        libraryTarget: "commonjs",
        path: path.resolve(__dirname, "lib"),
    },
    plugins: [
        new WebpackCompilerPlugin({
            name: "script-build-types",
            listeners: {
                compileStart: (): void => void execSync("pnpm build-types"),
            },
        }),
    ],
    resolve: {
        extensions: [".js", ".ts", ".jsx", ".tsx"],
        modules: [path.resolve("./src"), path.resolve("./node_modules")],
    },
    watchOptions: {
        ignored: /node_modules|built|lib/,
    },
    externals: [nodeExternals()] as Configuration["externals"],
};

export default configuration;
