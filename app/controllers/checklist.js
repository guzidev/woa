var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  fs = require('fs'),
  mAuth = require('../middlewares/auth'),
  Checklist = mongoose.model('Checklist');

var io ={};
var http ={};

module.exports = function (app) {
  app.use('/woa/checklists', router);

  http = require('http').Server(app);
  io = require('socket.io')(http);
  initSocketServer();
};

function initSocketServer(){
  var socket={};
  io.use(mAuth.validateSocketToken);
  io.on('connection', function(socket){
      console.log('Connection opened');
      socket.on('disconnect', function(){
      console.log('Connection closed');
    });
  });
  http.listen(3002, function(){
    console.log('Socket server listening on port: 3002');
  });
}

function newDataEvent(data){
  io.sockets.emit("data", data);
}

/**
 * Return contents for UI
 */
router.get('/ui',function(req, res, next){
    var ui =[];
    var checklist = {
      container:'checklist',
      id:'checklist',
      view:'datatable',
      columns:[
        // TODO : define columns and how info will be displayed
      ],
      autoheight:true,
      autowidth:true,
        editable:true
    };

    var buttonAdd ={
      view:"button", 
      id:"buttonAdd", 
      container:'checklist',
      value:"Add", 
      type:"form", 
      inputWidth:100 
    };
    
  ui.push(checklist);
  ui.push(buttonAdd);           

  res.jsend.success(ui);
});

/**
 * Returns the existing checklist corresponding to the ID provided in url parameters
 * Token required
 */
router.get('/:id', mAuth.validateToken, function(req,res,next){
  var checklistId = req.params.id;
  Checklist.findById(checklistId, function(err, existingChecklist){
      res.jsend.success(existingChecklist);
    });
});

/**
 * Updates the existing checklist corresponding to the ID provided in url parameters
 * Token required
 */
router.put('/:id', mAuth.validateToken, function(req,res,next){
    var checklistId = req.params.id;
    var updatedChecklist = new Checklist(req.body);
    
    Checklist.findById(checklistId, function(err, existingChecklist){
    if(err) {
      res.status(500).send(err);
      return;
    } else if (!existingChecklist) {
      res.status(403).send('Checklist not found');
      return;
    }
    // insert code to set new info, for each task
    
    res.jsend(existingChecklist);
});