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
const _collection = "apis";

// ---- Insere Schema Validation na Collection ---- //
const schemaValidation = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["descricao", "endpoints", "token", "ativo"],
            properties: {
                descricao: {
                    bsonType: "string",
                    description: "Campo deve ser do tipo string e é obrigatório"
                },
                endpoints: {
                    bsonType: "array",
                    description: "Campo deve ser do tipo array e é obrigatório",
                    required: ["_id", "endpoint", "ativo", "total"],
                    properties: {
                        _id: {
                            bsonType: "objectId",
                            description: "Campo deve ser do tipo string e é obrigatório"
                        },
                        endpoint: {
                            bsonType: "string",
                            description: "Campo deve ser do tipo string"
                        },
                        ativo: {
                            bsonType: "bool",
                            description: "Campo deve ser do tipo Booleano e é obrigatório"
                        },
                        total: {
                            bsonType: "int",
                            description: "Campo deve ser do tipo inteiro e é obrigatório"
                        },
                    }
                },
                token: {
                    bsonType: "string",
                    description: "Campo deve ser do tipo string e é obrigatório"
                },
                ativo: {
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
                    { name: 'token_unique', key: { token: 1 }, unique: true },
                    { name: 'ativo_index', key: { ativo: 1 } },
                    { name: 'endpoints_ativo_index', key: { 'endpoints.ativo': 1 } },
                    { name: 'endpoints_total_index', key: { 'endpoints.total': 1 } },
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