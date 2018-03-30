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

module.exports ={
	probando,
	savePublication,
	getPublications,
	getPublication
}