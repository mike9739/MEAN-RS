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

//  funcion para hacere preubas en el servidor
function probando(req,res)
{
	res.status(200).send({message:'Primera publicación perros '});
}
// funcioon para guardar publicaciones
function savePublication(req,res)
{
	var params = req.body;
	var publication = new Publication();
	if (!params.text) return res.status(200).send({message:'Debes agregar un texto'});

	publication.text = params.text;
	publication.file = 'null';
	publication.user = req.user.sub;
	publication.created_at = moment().unix();

	publication.save((err,publicationStored)=>
	{
		if (err) return res.status(500).send({message:'Error al guardar la publicación'});
		if (!publicationStored) return res.status(404).send({message:'La publicación no ha sido guardada'});

		return res.status(200).send({publication: publicationStored});

	});

}

//lista las publicaciones

function getPublications(req,res)
{
	var page = 1;
	if (req.params.page) 
		{
			page = req.params.page;
		}

	
	var itemsPerPage = 4;
	Follow.find({user: req.user.sub}).populate('followed').exec((err,follows)=>
	{
		if(err) return res.status(500).send({message: 'Error al devolver el seguimiento'});
		var follows_clean = [];
		follows.forEach((follow)=>{	
			follows_clean.push(follow.followed);

		});
		
		Publication.find({user: {"$in":follows_clean}}).sort('-created_at').populate('user').paginate(page,itemsPerPage,(err,publications,total)=>{
			if(err) return res.status(500).send({message: 'Error al devolver publicación'});
			if(!publications) return res.status(404).send({message: 'No hay publicaciones'});
			return res.status(200).send({
				total_items:total,
				pages: Math.ceil(total/itemsPerPage),
				page: page,
				publications
			});
		});
	});
}
function getPublication(req,res) {
	var publicationId = req.params.id;

	Publication.findById(publicationId,(err,publication) =>{
		if(err) res.status(500).send({message: 'Error al devolver publicación'});
		if(!publication) res.status(404).send({message: 'La publicación no existe'}); 
		return res.status(200).send({publication});

	});
}

//elimina publicaciones
function deletePublication(req,res)
{
	var publicationId = req.params.id;

	Publication.find({'user':req.user.sub,'_id':publicationId}).remove(err =>{
		if (err) return res.status(500).send({message:'Error al borrar la publicación'});
		return res.status(200).send({message: 'La publicación se ha borrado'});
	});
}

//subir archivos de imagen / avart de usuario
 function uploadImage(req,res)
 {
 	var publicationId = req.params.id;
 	
	if (req.files) 
	{
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];
		


		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') 
		{
			
				Publication.findOne({'user':req.user.sub,'_id':publicationId}).exec((err,publication) =>{

					if (publication) 
					{
							Publication.findByIdAndUpdate(publicationId,{file: file_name},{new: true} ,(err,publicationUpdated) => 
						{
							if (err) return res.status(500).send({message:'Error en la peticion'});

	 						if (!publicationUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

	 						return res.status(200).send({publication: publicationUpdated});
						});
					}
					else
					{
						return removeFileOfUploads(res,file_path,'no tienes permiso para editar la publicacion');
					}
				
			})



			//actualizar documento de usuario
		
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
 	var path_file = './uploads/publications/'+imageFile;
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

 

module.exports ={
	probando,
	savePublication,
	getPublications,
	getPublication,
	deletePublication,
	uploadImage,
	removeFileOfUploads,
	getImageFile	

}