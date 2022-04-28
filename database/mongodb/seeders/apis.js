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
const _collection = "apis";           // ---- Instancia a classe MongoDB
const ObjectId = require('mongodb').ObjectID;

var md5 = require('md5');
var data = [];
var api = {
    descricao: "Cnpj Finder",
    endpoints: [{
        _id: ObjectId(),
        endpoint: "http://165.227.252.70/empresasbrasil",
        ativo: true,
        total: 0
    }],
    ativo: true,
    token: '',
    created_at: new Date(),
    updated_at: new Date()
};
api.token = md5(api.descricao);
//data.push(api);

api = {
    descricao: "Geolocalização",
    endpoints: [{
        _id: ObjectId(),
        endpoint: "http://191.239.117.167/api/geolocalizacao",
        ativo: true,
        total: 0
    },
    {
        _id: ObjectId(),
        endpoint: "http://191.234.162.207/api/geolocalizacao",
        ativo: true,
        total: 0
    },
    {
        _id: ObjectId(),
        endpoint: "http://191.233.248.209/api/geolocalizacao",
        ativo: true,
        total: 0
    },
    {
        _id: ObjectId(),
        endpoint: "http://191.233.249.157/api/geolocalizacao",
        ativo: true,
        total: 0
    }
    ],
    ativo: true,
    token: '',
    created_at: new Date(),
    updated_at: new Date()
};
api.token = md5(api.descricao);
data.push(api);

api = {
    descricao: "Linkedin",
    endpoints: [{
        _id: ObjectId(),
        endpoint: "http://191.239.117.167/api/contatos",
        ativo: true,
        total: 0
    },
    {
        _id: ObjectId(),
        endpoint: "http://191.234.162.207/api/contatos",
        ativo: true,
        total: 0
    },
    {
        _id: ObjectId(),
        endpoint: "http://191.233.248.209/api/contatos",
        ativo: true,
        total: 0
    },
    {
        _id: ObjectId(),
        endpoint: "http://191.233.249.157/api/contatos",
        ativo: true,
        total: 0
    }
    ],
    ativo: true,
    token: '',
    created_at: new Date(),
    updated_at: new Date()
};
api.token = md5(api.descricao);
data.push(api);

api = {
    descricao: "Whois",
    endpoints: [{
        _id: ObjectId(),
        endpoint: "http://191.239.117.167/api/whois",
        ativo: true,
        total: 0
    },
    {
        _id: ObjectId(),
        endpoint: "http://191.234.162.207/api/whois",
        ativo: true,
        total: 0
    },
    {
        _id: ObjectId(),
        endpoint: "http://191.233.248.209/api/whois",
        ativo: true,
        total: 0
    },
    {
        _id: ObjectId(),
        endpoint: "http://191.233.249.157/api/whois",
        ativo: true,
        total: 0
    }
    ],
    ativo: true,
    token: '',
    created_at: new Date(),
    updated_at: new Date()
};
api.token = md5(api.descricao);
data.push(api);


api = {
    descricao: "Adobe M2",
    endpoints: [{
        _id: ObjectId(),
        endpoint: "http://104.41.63.8/api/m2",
        ativo: true,
        total: 0
    },
    ],
    ativo: true,
    token: '',
    created_at: new Date(),
    updated_at: new Date()
};
api.token = md5(api.descricao);
data.push(api);


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