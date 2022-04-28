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
const _collection = "clientes";

// ---- Insere Schema Validation na Collection ---- //
const schemaValidation = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["razao_social", "cnpj", "responsavel", "email", "limite_requisicoes_diarias", "limite_requisicoes_mensais", "ativo"],
            properties: {
                razao_social: {
                    bsonType: "string",
                    description: "Campo deve ser do tipo string e é obrigatório"
                },
                cnpj: {
                    bsonType: "string",
                    description: "Campo deve ser do tipo string e é obrigatório"
                },
                responsavel: {
                    bsonType: "string",
                    description: "Campo deve ser do tipo string e é obrigatório"
                },
                email: {
                    bsonType: "string",
                    description: "Campo deve ser do tipo string e é obrigatório"
                },
                requisicoes_diarias: {
                    bsonType: "int",
                    description: "Campo deve ser do tipo inteiro e é obrigatório"
                },
                requisicoes_mensais: {
                    bsonType: "int",
                    description: "Campo deve ser do tipo inteiro e é obrigatório"
                },
                limite_requisicoes_diarias: {
                    bsonType: "int",
                    description: "Campo deve ser do tipo inteiro e é obrigatório"
                },
                limite_requisicoes_mensais: {
                    bsonType: "int",
                    description: "Campo deve ser do tipo inteiro e é obrigatório"
                },
                ativo: {
                    bsonType: "bool",
                    description: "Campo deve ser do tipo Booleano e é obrigatório"
                },
                ultimo_acesso: {
                    bsonType: "date",
                    description: "Campo deve ser do tipo data e é obrigatório"
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
                    { name: 'cnpj_unique', key: { cnpj: 1 }, unique: true },
                    { name: 'ativo_index', key: { ativo: 1 } }
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