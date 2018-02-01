'use strict'

var User = require('../models/user');

function home(req,res) {
	res.status(200).send({
		message:'aqui va existir algo piolisimamente piolas'
	});
}

function pruebas(req,res){
	console.log(req.body);
	res.status(200).send({
		message:'Hola'
	});
}

module.exports = {
	home,
	pruebas
}