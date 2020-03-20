import * as path from "path";
import { execSync } from "child_process";
import { Configuration } from "webpack";
import { WebpackCompilerPlugin } from "webpack-compiler-plugin";
import * as CopyPlugin from "copy-webpack-plugin";

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
                    { loader: "ts-loader" },
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
                compileStart: (): void => void execSync("npm run build-types"),
            },
        }),
        new CopyPlugin([{ from: "built/index.d.ts", to: "main.d.ts" }]),
        new CopyPlugin(["package.json", "README.md"]),
    ],
    resolve: {
        extensions: [".js", ".ts", ".jsx", ".tsx"],
        modules: [path.resolve("./src"), path.resolve("./node_modules")],
    },
    watchOptions: {
        ignored: /node_modules|built/,
    },
};

export default configuration;
