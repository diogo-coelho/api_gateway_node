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
const _collection = "clientes";           // ---- Instancia a classe MongoDB

var data = [{
    razao_social: "IT Broker Serviços Operacionais LTDA",
    cnpj: "18901359000103",
    responsavel: "Marvin Fiori",
    email: "marvin.fiori@itb360.com.br",
    requisicoes_diarias: 0,
    requisicoes_mensais: 0,
    limite_requisicoes_diarias: 10,
    limite_requisicoes_mensais: 1000,
    ativo: true,
    ultimo_acesso: new Date(),
    created_at: new Date(),
    updated_at: new Date()
},
{
    razao_social: "Adobe Teste",
    cnpj: "02999520000185",
    responsavel: "Responsavel Adobe",
    email: "contato@adobe.com.br",
    requisicoes_diarias: 0,
    requisicoes_mensais: 0,
    limite_requisicoes_diarias: 50,
    limite_requisicoes_mensais: 1000,
    ativo: true,
    ultimo_acesso: new Date(),
    created_at: new Date(),
    updated_at: new Date()
},
];
console.log(data);

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