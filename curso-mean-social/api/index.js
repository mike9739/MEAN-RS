'use strict'

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean_social')
		.then(() => {
			console.log("La conexion si funciona XD");
		})
		.catch(err => console.log(err))