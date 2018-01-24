'use strict'
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas

//middleware

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cors

//rutas

app.get('/pruebas', (req,res) => {
	res.status(200).send({
		message:'Hola'
	});
} );
app.get('/', (req,res) => {
	res.status(200).send({
		message:'aqui va existir algo piolisimamente piolas'
	});
} );


//exportar
module.exports = app;