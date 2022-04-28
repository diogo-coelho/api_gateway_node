"use strict";
// ----------------------------------------------------- //
// ----------------------------------------------------- //
// -----                   Seeder                   ---- //
// ----------------------------------------------------- //
// ----------------------------------------------------- //

// ---- Imports ---- //
require('dotenv/config');

const dbConnection = require('../../../config/dbConnection.js')();
/* IMPORT MONGODB */
const MongoClient = require('mongodb').MongoClient;
const _connection = dbConnection.url;
const _database = dbConnection.database;
const _collection = "usuarios";           // ---- Instancia a classe MongoDB

var md5 = require('md5');
var data = [];
var user = {
    nome: "Bruno Feliciano de Godoi",
    cliente_cnpj: "18901359000103",
    email: "bruno.godoi@itb360.com.br",
    ativo: true,
    token: '',
    apis: ["27efaba681c5c6320784c074388cf09e", "6dcb8179d51ace6589f59258f8cd9199", "44e2308cdc51a0a1a5350ba3937e0b5e", "028d4b524cf7b2c7ca6ce15abac26b09"],
    ultimo_acesso: new Date(),
    created_at: new Date(),
    updated_at: new Date()
};
user.token = md5(user.nome + user.email);
data.push(user);

user = {
    nome: "Diogo Oliveira Coelho",
    cliente_cnpj: "18901359000103",
    email: "diogo.coelho@itb360.com.br",
    ativo: true,
    token: '',
    apis: ["27efaba681c5c6320784c074388cf09e", "6dcb8179d51ace6589f59258f8cd9199", "44e2308cdc51a0a1a5350ba3937e0b5e", "028d4b524cf7b2c7ca6ce15abac26b09"],
    ultimo_acesso: new Date(),
    created_at: new Date(),
    updated_at: new Date()
};
user.token = md5(user.nome + user.email);
data.push(user);

user = {
    nome: "Databuilder - ITB360",
    cliente_cnpj: "18901359000103",
    email: "databuilder@itb360.com.br",
    ativo: true,
    token: '',
    apis: ["27efaba681c5c6320784c074388cf09e", "6dcb8179d51ace6589f59258f8cd9199", "44e2308cdc51a0a1a5350ba3937e0b5e"],
    ultimo_acesso: new Date(),
    created_at: new Date(),
    updated_at: new Date()
};
user.token = md5(user.nome + user.email);
data.push(user);

user = {
    nome: "Databroker Global - ITB360",
    cliente_cnpj: "18901359000103",
    email: "dbg@itb360.com.br",
    ativo: true,
    token: '',
    apis: ["27efaba681c5c6320784c074388cf09e", "6dcb8179d51ace6589f59258f8cd9199", "44e2308cdc51a0a1a5350ba3937e0b5e"],
    ultimo_acesso: new Date(),
    created_at: new Date(),
    updated_at: new Date()
};
user.token = md5(user.nome + user.email);
data.push(user);

user = {
    nome: "App Miner - ITB360",
    cliente_cnpj: "18901359000103",
    email: "miner@itb360.com.br",
    ativo: true,
    token: '',
    apis: ["27efaba681c5c6320784c074388cf09e", "6dcb8179d51ace6589f59258f8cd9199", "44e2308cdc51a0a1a5350ba3937e0b5e"],
    ultimo_acesso: new Date(),
    created_at: new Date(),
    updated_at: new Date()
};
user.token = md5(user.nome + user.email);
data.push(user);

user = {
    nome: "Itbdata1",
    cliente_cnpj: "02999520000185",
    email: "Itbdata1@adobe.com.br",
    ativo: true,
    token: '',
    apis: ["028d4b524cf7b2c7ca6ce15abac26b09"],
    ultimo_acesso: new Date(),
    created_at: new Date(),
    updated_at: new Date()
};
user.token = md5(user.nome + user.email);
data.push(user);


user = {
    nome: "Itbdata2",
    cliente_cnpj: "02999520000185",
    email: "Itbdata1@adobe.com.br",
    ativo: true,
    token: '',
    apis: ["028d4b524cf7b2c7ca6ce15abac26b09"],
    ultimo_acesso: new Date(),
    created_at: new Date(),
    updated_at: new Date()
};
user.token = md5(user.nome + user.email);
data.push(user);


user = {
    nome: "Itbdata3",
    cliente_cnpj: "02999520000185",
    email: "Itbdata1@adobe.com.br",
    ativo: true,
    token: '',
    apis: ["028d4b524cf7b2c7ca6ce15abac26b09"],
    ultimo_acesso: new Date(),
    created_at: new Date(),
    updated_at: new Date()
};
user.token = md5(user.nome + user.email);
data.push(user);

// ---- Processamento ---- //
module.exports.seeder = () => {

    return new Promise((resolve, reject) => {
        MongoClient.connect(_connection, { useUnifiedTopology: true }, (err, client) => {
            if (err) {
                return reject(err);
            }
            let db = client.db(_database);
            db.collection(_collection).deleteMany();
            db.collection(_collection).insertMany(data, async (err, res) => {
                if (err) {
                    console.log(`[ ${new Date().toLocaleTimeString()} ] : Ocorreu um erro na inclusão dos dados : `, err);
                    reject(err);
                    return;
                } else {
                    console.log(`[ ${new Date().toLocaleTimeString()} ] : Resultado : `, res.result.ok === 1 ? 'OK' : 'Not OK');
                    console.log(`[ ${new Date().toLocaleTimeString()} ] : Quantidade de documentos inseridos : `, res.insertedCount);
                    for (let documento of res.ops) {
                        console.log(`[ ${new Date().toLocaleTimeString()} ] : Documento inserido : `, documento);
                    }
                    resolve(true);
                    client.close();
                    return;
                }
            });
        });
    }).catch((err) => {
        //console.log(err);
        return false;
    });
}