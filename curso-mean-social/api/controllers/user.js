'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../Services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');
var Follow = require('../models/follow')
var Publication = require('../models/publication');

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
		user.role = 'ROLE_USER';
		user.image = null;
		user.rfc = params.rfc;
		user.anualprofit = params.anualprofit;
		user.employees = params.employees;
		user.score = params.score;
		
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
		followThisUser(req.user.sub,userId).then((value)=>{
			user.password = undefined;
			return res.status(200).send({
				user,
				following: value.following,
				followed: value.followed

			});
		});
	

	});
}

async function followThisUser(identity_user_id , user_id)
{
	var following = await Follow.findOne({"user":identity_user_id,"followed":user_id}).exec((err,follow)=>{
			if (err) {
				return handleError(err);
			}
			return follow;
		});	

	var followed = await Follow.findOne({"user":user_id,"followed":identity_user_id}).exec((err,follow)=>{
			if (err) {
				return handleError(err);
			}
			return follow;
		});	
	return {
		following: following,
		followed: followed
	}
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

 			followUsersIds(identity_user_id).then((value) => {
 				return res.status(200).send({
 				users,
 				users_following: value.following,
 				users_follow_me: value.followed,
 				total,
 				pages: Math.ceil(total/itemPerPage)
 			});


 			});
 		

 		});
 	}
}

// duncion asincrona para deveolver el istado de follows y usuarios
async function followUsersIds(user_id)
{
		var following = await Follow.find({"user":user_id}).select({'_id':0,'__v':0,'user':0}).exec((err,follows) => {
		return follows;
		});

		var followed = await Follow.find({"followed":user_id}).select({'_id':0,'__v':0,'followed':0}).exec((err,follows) => {
		return follows;
	});

//procesar following ids
	var following_clean = [];

		following.forEach((follow)=>
			{
				following_clean.push(follow.followed);

			});
		
//procesar followed ids
	var followed_clean = [];
		followed.forEach((follow)=>{
			followed_clean.push(follow.user);
		});
	




		return {
			following: following_clean,
			followed: followed_clean
		}
}
//devolver el contador de follows , etc
function getCounters(req,res)
{
	var userId = req.user.sub;
	if (req.params.id) {
		userId = req.params.id;
	}
	getCountFollows(userId).then((value)=>{
		return res.status(200).send(value);

	});
}

async function getCountFollows(user_id)
{
	var following = await Follow.count({"user":user_id}).exec((err,count)=>{
		if (err)return handleError(err);
		return count;

	});
	var followed = await Follow.count({"followed":user_id}).exec((err,count)=>
		{
				if (err){ return handleError(err);}
				
				return count;
		});

	var publications = await Publication.count({"user":user_id}).exec((err,count)=>{
		if(err) return handleError(err);
		return count;
	}) ;

	return {
		following: following,
		followed: followed,
		publications : publications
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
	User.find({ $or: [
							{email: update.email},
							{nick: update.nick}
							]}).exec((err,users)=>{
								var user_isset = false;
								users.forEach((user)=>{
									if (user && user._id != userId) {
									user_isset = true;
									}
								});
								if (user_isset)
								 {
								 	return res.status(500).send({message:'Los datos ya estan en uso'});
								 }

									 User.findByIdAndUpdate(userId,update,{new: true},(err,userUpdated) =>{
	 									if (err) return res.status(500).send({message:'No se ha podido actualizar el usuario'});

								 		if (!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

	 									return res.status(200).send({user: userUpdated});

	 										});


							});


}


//subir archivos de imagen / avart de usuario
 function uploadImage(req,res)
 {
 	var userId = req.params.id;
 	
	if (req.files) 
	{
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];
		
		if (userId != req.user.sub)
	{
		return removeFileOfUploads(res,file_path,'no tienes permiso para modificar estos datos :D')
	}

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') 
		{
			//actualizar documento de usuario
			User.findByIdAndUpdate(userId,{image: file_name},{new: true} ,(err,userUpdated) => 
				{
				if (err) return res.status(500).send({message:'No se ha podido actualizar el usuario'});

	 			if (!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

	 			return res.status(200).send({user: userUpdated});
				});
		}
			else{
				return removeFileOfUploads(res,file_path,'Por favor cargue un archivo jpg o png ');
			}


	}
	else
	{
		return res.status(200).send({message:'no se han subido imgenes'});
	}

 }
function removeFileOfUploads(res,file_path,message)
 {
 	fs.unlink(file_path,(err) =>
					{
						 return res.status(200).send({message: message});
					});
 }

 function getImageFile(req,res)
 {
 	var imageFile = req.params.imageFile;
 	var path_file = './uploads/users/'+imageFile;
 	fs.exists(path_file,(exists)=>
 	{
 		if (exists) 
 		{
 			res.sendFile(path.resolve(path_file));
 		}
 		else
 		{
 			res.status(200).send({message: 'No existe la imagen' });
 		}
 	});

 }


module.exports = {
	home,
	pruebas,
	saveUser,
	loginUser,
	getUser,
	getUsers,
	getCounters,
	updateUser,
	uploadImage,
	getImageFile,

}