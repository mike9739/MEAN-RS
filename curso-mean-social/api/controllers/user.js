'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../Services/jwt');

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

function saveUser(req,res){
	var params = req.body;
	var user = new User();
	if (params.name && params.surname && params.nick && params.email && params.password) {
		user.name = params.name;
		user.nick = params.nick;
		user.surname = params.surname;
		user.email = params.email;
		user.role = 'ROLE_USER'
		user.image = null;
		
		//Comprobación de usuarios duplicados
		User.find({ $or: [
							{email: user.email},
							{nick: user.nick}
							]}).exec((err,users) => {
								if(err) return res.status(500).send({message:'Error en la petición de usuario'});

								if (users && users.length >=1) {
									return res.status(200).send({message:'el usuario que tratas de registrar ya existe '});
								}
								else{
			//encriptación de las contraseñas y guarda los datos
			bcrypt.hash(params.password,null,null,(err,hash)=>{
			user.password = hash;
			user.save((err,userStored)=>{
			if(err) return res.status(500).send({message:'Error al guardar el usuario'});
			if (userStored) {
						res.status(200).send({user : userStored});
							}
			else{
						res.status(404).send({message:'No se ha registrado el usuario'});
				}
			});
		});

								}


							});
	


	}
	else
	{
		res.status(200).send({
			message:'Envia todos los campos necesarios'
		});
	}

}

function loginUser(req,res){
	var params =req.body;
	var email = params.email;
	var password = params.password;
	User.findOne({email:email},(err,user) =>{
		if(err) return res.status(500).send({message:'Error en la petición'});
		if(user){
			bcrypt.compare(password,user.password,(err,check) =>{
				if(check){
					
				
					if (params.gettoken) 
					{
						//devolver un token
						//generar un token
						return res.status(200).send({
							token: jwt.createToken(user)
						});
					}
						else
						{
						//devuelve datos de usuario
							user.password = undefined;
					return res.status(200).send({user});

						}
					

				}
				else{
					return res.status(404).send({message:'El usuario no se ha podido identificar'});
				}
			});
		}
		else{
			return res.status(404).send({message:'El usuario no se ha podido identificar'});
		}
	});
}

module.exports = {
	home,
	pruebas,
	saveUser,
	loginUser
}