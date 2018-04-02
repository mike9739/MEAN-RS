'use sttict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function prueba(req,res)
{
	return res.status(200).send({message:'Holi message'});

}

//guarda los mnesaje
function saveMessage(req,res)
{
	var params = req.body;

	if(!params.text || !params.receiver) return res.status(200).send({message:'envia los campos necesarios'});

		var message = new Message();
		message.emitter = req.user.sub;
		message.receiver = params.receiver;
		message.text = params.text;
		message.created_at = moment().unix();

		message.save((err,messageStored)=>
		{
			if (err) res.status(500).send({message:'error en la peticón'});
			if (!messageStored) return res.status(500).send({message:'Error al enviar el mensaje '});

			return res.status(200).send({message:messageStored});
		});
}

function getRecivedMessage(req,res)
{
	var userId = req.user.sub;
	var page = 1;
	if (req.params.page)
	 {
	 	page = req.params.page;

	 }
	 var itemesPerPage = 4;
	 Message.find({receiver: userId}).populate('emitter','nick _id image').paginate(page,itemesPerPage,(err,messages,total)=>{
	 	if (err) return res.status(500).send({message:'Error en la petición'});
	 	if(!messages) return res.status(404).send({message:'No  hay mensaje'});
	 	return res.status(200).send({
	 		total: total,
	 		pages: Math.ceil(total/itemesPerPage),
	 		messages
	 	});
			 });

}

module.exports = {
	prueba,
	saveMessage,
	getRecivedMessage
};