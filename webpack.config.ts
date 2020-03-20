import * as path from "path";
import { Configuration } from "webpack";
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
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-typescript"],
                    },
                },
            },
        ],
    },
    output: {
        filename: "main.js",
        libraryTarget: "commonjs",
        path: path.resolve(__dirname, "lib"),
    },
    plugins: [
        new CopyPlugin([{ from: "built/src/index.d.ts", to: "main.d.ts" }]),
        new CopyPlugin(["package.json", "README.md"]),
    ],
    resolve: {
        extensions: [".js", ".ts"],
        modules: [path.resolve("./src"), path.resolve("./node_modules")],
    },
};

export default configuration;
