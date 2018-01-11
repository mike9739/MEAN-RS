'use strict'
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas

//cargar middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json);
//cors

//rutas
app.get('/pruebas', () =>
{
	res.status(200).send({
		message: 'Acción de pruebas en el servidor'
	});
})

//exportar
module.exports = app;
