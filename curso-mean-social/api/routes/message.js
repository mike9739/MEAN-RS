'use strict'

var express = require('express');
var MessageController = require('../controllers/message');
var api = express.Router();
var md_auth = require('../middlewares/authentificated');

api.get('/probando-md',md_auth.ensureAuth,MessageController.prueba);
api.post('/message',md_auth.ensureAuth,MessageController.saveMessage);
api.get('/my-message/:page?',md_auth.ensureAuth,MessageController.getRecivedMessage);
api.get('/messages/:page?',md_auth.ensureAuth,MessageController.getEmmitMessage);
api.get('/unviewed-message',md_auth.ensureAuth,MessageController.getUnviewMessage);
api.get('/set-viewed-message',md_auth.ensureAuth,MessageController.setViewedMessage);

module.exports = api;