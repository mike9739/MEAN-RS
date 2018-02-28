'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso_desarrollar_red_social_angular'

exports.createToken = function(user){
//la payload contiene datos del usuario que se quieran codificar 
var payload = {
//sub = id
	sub: user._id,
	name: user.name,
	surname: user.surname,
	email: user.email,
	nick: user.nick,
	role: user.role,
	image: user.image,
	iat: moment().unix(),
	exp: moment().add(30,'days').unix
};
return jwt.encode(payload,secret);
};