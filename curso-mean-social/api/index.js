'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean_social')
		.then(() => {
			console.log("La conexion si funciona XD");
			//crear servidor
			app.listen(port, () =>
			{
				console.log("Se creo el servidor http://localhost:3800");
			})
		})
		.catch(err => console.log(err)) 