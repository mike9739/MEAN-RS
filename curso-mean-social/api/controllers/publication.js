'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

//carga el modelo de publicaciones
var Publication = require('../models/publication');
//carga el modelo de usuario
var User = require('../models/user');
//carga el modeko de follows
var Follow = require('../models/follow');

function probando(req,res)
{
	res.status(200).send({message:'Primera publicación perros '});
}

module.exports ={
	probando
}