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
const _collection = "usuarios";

// ---- Insere Schema Validation na Collection ---- //
const schemaValidation = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["nome", "cliente_cnpj", "email", "ativo", "token"],
            properties: {
                nome: {
                    bsonType: "string",
                    description: "Campo deve ser do tipo string e é obrigatório"
                },
                cliente_cnpj: {
                    bsonType: "string",
                    description: "Campo deve ser do tipo string e é obrigatório"
                },
                email: {
                    bsonType: "string",
                    description: "Campo deve ser do tipo string e é obrigatório"
                },
                ativo: {
                    bsonType: "bool",
                    description: "Campo deve ser do tipo Booleano e é obrigatório"
                },
                token: {
                    bsonType: "string",
                    description: "Campo deve ser do tipo string e é obrigatório"
                },
                apis: {
                    bsonType: "array",
                    description: "Campo deve ser do tipo array e é obrigatório"
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
                    { name: 'cliente_cnpj_index', key: { cliente_cnpj: 1 } },
                    { name: 'email_unique', key: { email: 1 }, unique: true },
                    { name: 'ativo_index', key: { ativo: 1 } },
                    { name: 'token_unique', key: { token: 1 }, unique: true },
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