"use strict";

// ---- Imports ---- //
var apis = require('./seeders/apis');
var clientes = require('./seeders/clientes');
var usuarios = require('./seeders/usuarios');


module.exports.seed = () => {
  clientes.seeder();
  usuarios.seeder();
  apis.seeder();
};

