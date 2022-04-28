"use strict";

// ----------------------------------------------------- //
// ----------------------------------------------------- //
// -----                Migration                   ---- //
// ----------------------------------------------------- //
// ----------------------------------------------------- //

// ---- Imports ---- //
require('dotenv/config');

const dbConnection = require('../../../config/dbConnection.js')();
/* IMPORT MONGODB */
const MongoClient = require('mongodb').MongoClient;

const _connection = dbConnection.url;
const _database = dbConnection.database;
const _collection = "requisicoes";

// ---- Insere Schema Validation na Collection ---- //
const schemaValidation = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["_id_cliente", "_id_usuario"],
            properties: {
                _id_cliente: {
                    bsonType: "objectId",
                    description: "Campo deve ser do tipo objectId e é obrigatório"
                },
                _id_usuario: {
                    bsonType: "objectId",
                    description: "Campo deve ser do tipo objectId e é obrigatório"
                },
                api_token: {
                    bsonType: "string",
                    description: "Campo deve ser do tipo string e é obrigatório"
                },
                authorizationToken: {
                    bsonType: "string",
                    description: "Campo deve ser do tipo string e é obrigatório"
                },
                parameters: {
                    bsonType: "object",
                    description: "Campo deve ser do tipo object e é obrigatório"
                },
                _api_id: {
                    bsonType: ["objectId", "null", "string"],
                    description: "Campo deve ser do tipo objectId e é obrigatório"
                },
                _endpoint_id: {
                    bsonType: ["objectId", "null", "string"],
                    description: "Campo deve ser do tipo objectId e é obrigatório"
                },
                retorno_api_endpoint: {
                    bsonType: ["object", "null"],
                    description: "Campo deve ser do tipo object e é obrigatório"
                },
                retorno_cliente: {
                    bsonType: ["object", "null"],
                    description: "Campo deve ser do tipo object e é obrigatório"
                },
                tempo_processamento: {
                    bsonType: ["int", "double", "null"],
                    description: "Campo deve ser do tipo double e é obrigatório"
                },
                finalizado: {
                    bsonType: "bool",
                    description: "Campo deve ser do tipo Booleano e é obrigatório"
                },
                created_at: {
                    bsonType: "date",
                    description: "Campo deve ser do tipo data e é obrigatório"
                },
                updated_at: {
                    bsonType: "date",
                    description: "Campo deve ser do tipo data e é obrigatório"
                }
            }
        }
    }
};

// ---- Processamento ---- //
module.exports.up = () => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(_connection, { useUnifiedTopology: true }, (err, client) => {
            if (err) {
                return reject(err);
            }
            let db = client.db(_database);
            db.createCollection(_collection, schemaValidation, async (err, res) => {
                if (err) reject(err);
                console.log(`Collection criada`);

                // Caso queira criar índices na sua collection, descomente o bloco de código abaixo 

                await db.collection(_collection).createIndexes([
                    { name: '_id_cliente_index', key: { _id_cliente: 1 } },
                    { name: '_id_usuario_index', key: { _id_usuario: 1 } },
                ]);

                console.log(`Índices criados`);

                resolve(true);
                client.close();
                return;
            });
        });
    }).catch((err) => {
        console.log(err);
        return false;
    });
};

module.exports.down = () => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(_connection, { useUnifiedTopology: true }, (err, client) => {
            if (err) {
                return reject(err);
            }
            let db = client.db(_database);
            db.collection(_collection).drop(async (err, delOK) => {
                if (err) reject(err);

                if (delOK) {
                    console.log(`Collection excluída`);
                    resolve(true);
                }
                await client.close();
                return;
            });
        });
    }).catch((err) => {
        console.log(err);
        return false;
    });
};