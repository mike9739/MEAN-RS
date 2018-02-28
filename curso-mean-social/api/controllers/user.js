'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../Services/jwt');
var mongoosePaginate = require('mongoose-pagination');

//metodos de prueba
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
//REgistro de usuarios
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
//login
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


//conseguir datos de usuario
function getUser(req,res){
	var userId = req.params.id;
	User.findById(userId,(err,user) => {
		if (err) return res.status(500).send({message:'Error en la petición'});
		if (!user) return res.status(404).send({message:'El usuario no existe'});

		return res.status(200).send({user});
	});
}


//devolver un listado de usuarios paginados

function getUsers(req,res) {
 	var identity_user_id = req.user.sub;
 	var page = 1;
 	if (req.params.page) 
 	{
 		page = req.params.page;
 		var itemPerPage = 5;
 		User.find().sort('_id').paginate(page,itemPerPage,(err,users,total)=>{
 			if (err) return res.status(500).send({message:'Error en la petición'});
 			if (!users) return res.status(404).send({message: 'No hay usuarios disponibles'});

 			return res.status(200).send({
 				users,
 				total,
 				pages: Math.ceil(total/itemPerPage)
 			});


 		});
 	}
}
//Edición de datos de usuario

function updateUser(req,res)
{
	var userId = req.params.id;
	var update = req.body;
	//delete password
	delete update.password;
	if (userId != req.user.sub)
	{
		return res.status(500).send({message:'No tienes permiso para actualiar los datos del usuario'});
	}
	 User.findByIdAndUpdate(userId,update,{new: true},(err,userUpdated) =>{
	 	if (err) return res.status(500).send({message:'No se ha podido actualizar el usuario'});

	 	if (!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

	 	return res.status(200).send({user: userUpdated});

	 });


}

module.exports = {
	home,
	pruebas,
	saveUser,
	loginUser,
	getUser,
	getUsers,
	updateUser
}