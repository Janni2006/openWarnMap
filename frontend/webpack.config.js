const path = require("path");
const webpack = require("webpack");

module.exports = {
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "./static/frontend"),
		filename: "[name].js",
	},
	cache: {
		type: "filesystem",
	},
	module: {
		rules: [
			{
				test: /\.js|.jsx$/,
				exclude: "/node_modules/",
				use: "babel-loader",
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(jpg|png)$/,
				use: {
					loader: "url-loader",
				},
			},
			{
				test: /\.svg$/,
				use: ["@svgr/webpack", "url-loader"],
			},
		],
	},
	optimization: {
		minimize: true,
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("development"),
			},
		}),
	],
};
