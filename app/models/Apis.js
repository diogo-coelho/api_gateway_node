"use strict";
//CLASSES PARA CONTROLE DE ERROS
const databaseError = require('../exceptions/databaseError');
const apisModelError = require('../exceptions/apisModelError');
/*IMPORT DO CONFIG MONGODB */
const dbConnection = require('../../config/dbConnection.js')();
/* IMPORT MONGODB */
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;


class Apis {
    constructor() {
        //NOMEAÇÃO DO BANCO DE DADOS E COLLECTION
        this._connection = dbConnection.url;
        this._database = dbConnection.database;
        this._collection = "apis";
        this.retorno = { status: { status: null, message: null }, result: { data: null } };
    }

    async findApiToken(tokenApi) {
        this.resetRetorno();
        //METODO QUE FAZ A BUSCA DE UM API CONFORME TOKEN INFORMADO + APIS ATIVAS
        return new Promise((resolve, reject) => {
            if (tokenApi !== undefined && tokenApi != '') {
                MongoClient.connect(this._connection, { useUnifiedTopology: true }, (err, client) => {
                    if (err) {
                        return reject(new databaseError(err));
                    }
                    let db = client.db(this._database);
                    db.collection(this._collection).findOne({ token: tokenApi, ativo: true }, (err, result) => {
                        if (err) {
                            client.close();
                            return reject(new databaseError(err));
                        }
                        if (result === null) {
                            this.retorno.result.total = 0;
                        } else {
                            this.retorno.result.total = 1;
                        }
                        this.retorno.status.status = true;
                        this.retorno.status.message = 'ok';
                        this.retorno.result.data = result;
                        client.close();
                        return resolve(this.retorno);
                    });
                });
            } else {
                reject(new apisModelError(1));
            }
        }).catch((err) => {
            this.retorno.status.status = false;
            this.retorno.status.message = err.messageSuper();
            return this.retorno;
        });
    }

    async findApiTokenEndPoint(tokenApi) {
        this.resetRetorno();
        //METODO QUE FAZ A BUSCA DE UM API CONFORME TOKEN INFORMADO + APIS ATIVAS
        return new Promise((resolve, reject) => {
            if (tokenApi !== undefined && tokenApi != '') {
                MongoClient.connect(this._connection, { useUnifiedTopology: true }, (err, client) => {
                    if (err) {
                        return reject(new databaseError(err));
                    }
                    let db = client.db(this._database);
                    db.collection(this._collection).aggregate([
                        // Encontra o documento principal
                        {
                            $match: {
                                token: tokenApi
                            }
                        },
                        // Encontra o documento do array
                        { $unwind: '$endpoints' },
                        // Passa o filtro para os documentos do Array
                        {
                            $match: {
                                'endpoints.ativo': true
                            }
                        },
                        // Ordena os resultados
                        {
                            $sort: {
                                'endpoints.total': 1
                            }
                        },
                        { $limit: 1 }
                    ]).toArray((err, result) => {
                        if (err) {
                            client.close();
                            return reject(new databaseError(err));
                        }
                        if (result === null) {
                            this.retorno.result.total = 0;
                        } else {
                            this.retorno.result.total = 1;
                        }
                        this.retorno.status.status = true;
                        this.retorno.status.message = 'ok';
                        this.retorno.result.data = result;
                        client.close();
                        return resolve(this.retorno);
                    });
                });
            } else {
                return reject(new apisModelError(1));
            }
        }).catch((err) => {
            this.retorno.status.status = false;
            this.retorno.status.message = err.messageSuper();
            return this.retorno;
        });
    }



    async incrementarRequisicaoEndpointApi(_idApi) {
        this.resetRetorno();
        //METODO QUE FAZ O INCREMENTO DO NUMERO DE REQUISIÇÕES DE UM ENDPOINT DE UMA API
        return new Promise((resolve, reject) => {
            if (_idApi !== undefined && _idApi != '') {
                MongoClient.connect(this._connection, { useUnifiedTopology: true }, (err, client) => {
                    if (err) {
                        return reject(new databaseError(err));
                    }
                    let db = client.db(this._database);
                    db.collection(this._collection).updateOne(
                        {
                            'endpoints._id': ObjectID(_idApi)
                        },
                        {
                            $inc: {
                                'endpoints.$.total': 1
                            }
                        }, (err, result) => {
                            if (err) {
                                return reject(new databaseError(err));
                            }
                            if (result.result.n === 1 && result.result.nModified === 1) {
                                this.retorno.status.status = true;
                                this.retorno.status.message = 'ok';
                                this.retorno.result.update = true;
                            } else {
                                this.retorno.status.status = false;
                                this.retorno.status.message = 'falha';
                                this.retorno.result.update = false;
                            }
                            client.close();
                            return resolve(this.retorno);
                        });
                });
            } else {
                return reject(new apisModelError(1));
            }
        }).catch((err) => {
            this.retorno.status.status = false;
            this.retorno.status.message = err.messageSuper();
            return this.retorno;
        });
    }

    async decrementarRequisicaoEndpointApi(_idApi) {
        this.resetRetorno();
        //METODO QUE FAZ O INCREMENTO DO NUMERO DE REQUISIÇÕES DE UM ENDPOINT DE UMA API
        return new Promise((resolve, reject) => {
            if (_idApi !== undefined && _idApi != '') {
                MongoClient.connect(this._connection, { useUnifiedTopology: true }, (err, client) => {
                    if (err) {
                        return reject(new databaseError(err));
                    }
                    let db = client.db(this._database);
                    db.collection(this._collection).updateOne(
                        {
                            'endpoints._id': ObjectID(_idApi)
                        },
                        {
                            $inc: {
                                'endpoints.$.total': -1
                            }
                        }, (err, result) => {
                            if (err) {
                                return reject(new databaseError(err));
                            }
                            if (result.result.n === 1 && result.result.nModified === 1) {
                                this.retorno.status.status = true;
                                this.retorno.status.message = 'ok';
                                this.retorno.result.update = true;
                            } else {
                                this.retorno.status.status = false;
                                this.retorno.status.message = 'falha';
                                this.retorno.result.update = false;
                            }
                            client.close();
                            return resolve(this.retorno);
                        });
                });
            } else {
                return reject(new apisModelError(1));
            }
        }).catch((err) => {
            this.retorno.status.status = false;
            this.retorno.status.message = err.messageSuper();
            return this.retorno;
        });
    }


    resetRetorno() {
        this.retorno = { status: { status: null, message: null }, result: { data: null } };
    }

}
module.exports = { Apis };