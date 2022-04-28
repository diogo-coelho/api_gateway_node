"use strict";
//CLASSES PARA CONTROLE DE ERROS
const databaseError = require('../exceptions/databaseError');
const clientesModelError = require('../exceptions/clientesModelError');
/*IMPORT DO CONFIG MONGODB */
const dbConnection = require('../../config/dbConnection.js')();
/* IMPORT MONGODB */
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;

class Clientes {
    constructor() {
        //NOMEAÇÃO DO BANCO DE DADOS E COLLECTION
        this._connection = dbConnection.url;
        this._database = dbConnection.database;
        this._collection = "clientes";
        this.retorno = { status: { status: null, message: null }, result: { data: null } };
    }

    async findClientes() {
        this.resetRetorno();
        //METODO QUE FAZ BUSCA CLIENTES
        return new Promise((resolve, reject) => {
            MongoClient.connect(this._connection, { useUnifiedTopology: true }, (err, client) => {
                if (err) {
                    return reject(new databaseError(err));
                }
                let db = client.db(this._database);
                db.collection(this._collection).find({ ativo: true }).toArray((err, result) => {
                    if (err) {
                        client.close();
                        return reject(new clientesModelError(err));
                    }
                    this.retorno.status.status = true;
                    this.retorno.status.message = 'ok';
                    this.retorno.result.data = result;
                    this.retorno.result.total = result.length;
                    client.close();
                    return resolve(this.retorno);

                });
            });
        }).catch((err) => {
            this.retorno.status.status = false;
            this.retorno.status.message = err.messageSuper();
            return this.retorno;
        });
    }

    async findClienteCnpj(cnpj) {
        this.resetRetorno();
        //METODO QUE FAZ BUSCA DE UM CLIENTE PELO CNPJ
        return new Promise((resolve, reject) => {
            if (cnpj !== undefined && cnpj != '') {
                MongoClient.connect(this._connection, { useUnifiedTopology: true }, (err, client) => {
                    if (err) {
                        return reject(new databaseError(err));
                    }
                    let db = client.db(this._database);
                    db.collection(this._collection).findOne({ cnpj: cnpj, ativo: true }, (err, result) => {
                        if (err) {
                            client.close();
                            return reject(new clientesModelError(err));
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
                return reject(new clientesModelError(1));
            }
        }).catch((err) => {
            this.retorno.status.status = false;
            this.retorno.status.message = err.messageSuper();
            return this.retorno;
        });
    }


    async update(_id, data) {
        this.resetRetorno();
        //METODO QUE FAZ O INCREMENTO DO NUMERO DE REQUISIÇÕES DE UM ENDPOINT DE UMA API
        return new Promise((resolve, reject) => {
            if (_id !== undefined && data !== undefined && _id != '' && data != '') {
                MongoClient.connect(this._connection, { useUnifiedTopology: true }, (err, client) => {
                    if (err) {
                        return reject(new databaseError(err));
                    }
                    let db = client.db(this._database);
                    db.collection(this._collection).updateOne(
                        {
                            '_id': ObjectID(_id)
                        },
                        {
                            $set: data,
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
                return reject(new clientesModelError(1));
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
module.exports = { Clientes };