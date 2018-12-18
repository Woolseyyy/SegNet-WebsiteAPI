var webpack=require("webpack");

module.exports = {
    entry:{
		index: './index.jsx'
	} ,
    output: {
        path: __dirname + '/build',
        publicPath:  '/build/',
        filename: '[name].bundle.js',
        chunkFilename:'[id].[chunkhash:5].chunk.js'
    },

    module: {
    	loaders: [{
    		test: /\.(jsx|js)?$/,
    		loader: 'babel-loader',
    		exclude:/node_modules/,
			query:{
				presets:["es2015","stage-0","react"]
			}
    	}, {
    		test: /\.css$/,
    		loader: 'style-loader!css-loader?modules'
    	}, {
    		test: /\.(png|jpg|svg|gif|eot|woff|ttf)$/,
    		loader: 'url-loader?limit=25000'
    	}]
    },
	/*externals: {
		"react": 'React',
		"react-dom": 'ReactDOM',
		"react-router": 'ReactRouter'
	}*/
};
