"use strict";

// ---- Imports ---- //
var apis = require('./migrations/apis'); 
var clientes = require('./migrations/clientes'); 
var requisicoes = require('./migrations/requisicoes'); 
var usuarios = require('./migrations/usuarios'); 


module.exports.up = () => { 
  apis.up(); 
  clientes.up(); 
  requisicoes.up(); 
  usuarios.up(); 
};

module.exports.down = () => { 
    apis.down(); 
    clientes.down(); 
    requisicoes.down(); 
    usuarios.down(); 
};

