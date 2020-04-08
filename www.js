const express = require('express');
const path = require('path');
const webRoutes = express.Router();
webRoutes.use('/', 							express.static(pth('./www/')));
webRoutes.use('/vendors/angular', 			express.static(pth('./node_modules/angular')));
webRoutes.use('/vendors/angular-animate', 	express.static(pth('./node_modules/angular-animate')));
webRoutes.use('/vendors/angular-aria', 		express.static(pth('./node_modules/angular-aria')));
webRoutes.use('/vendors/angular-material', 	express.static(pth('./node_modules/angular-material')));
webRoutes.use('/vendors/angular-messages',	express.static(pth('./node_modules/angular-messages')));
webRoutes.use('/vendors/@uirouter', 		express.static(pth('./node_modules/@uirouter')));
webRoutes.use('/vendors/roboto-fontface', 	express.static(pth('./node_modules/roboto-fontface')));

function pth(p) { return path.relative(__dirname, p); }; 

module.exports = webRoutes;