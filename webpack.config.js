var webpack=require('webpack');
var us=webpack.optimize.UglifyJsPlugin;
module.exports={
	entry:'./dev/admin.jsx',
	output:{
		path:__dirname+'/site/public/js',
		filename:'admin.js'
	},
	module: {
    loaders:[
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react'
      },
    ]
  }
}