"use strict";
//CLASSES PARA CONTROLE DE ERROS
const databaseError = require('../exceptions/databaseError');
const requisicoesModelError = require('../exceptions/requisicoesModelError');
/*IMPORT DO CONFIG MONGODB */
const dbConnection = require('../../config/dbConnection.js')();
/* IMPORT MONGODB */
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;
const moment = require('moment');
const { Double } = require('mongodb');

class Requisicoes {
    constructor() {
        //NOMEAÇÃO DO BANCO DE DADOS E COLLECTION
        this._connection = dbConnection.url;
        this._database = dbConnection.database;
        this._collection = "requisicoes";
        this.retorno = { status: { status: null, message: null }, result: { data: null } };
    }

    async create(dados) {
        this.resetRetorno();
        //METODO QUE CRIA UM DOCUMENTO NA COLLECTION requisicoes
        return new Promise((resolve, reject) => {
            if (dados !== undefined && dados._id_cliente !== undefined && dados._id_usuario !== undefined) {
                //COM OS DADOS RECEBIDOS POR PARAMETRO, FAÇO O INCREMENTO DE MAIS ALGUMAS INFORMAÇÕES
                dados._id_cliente = ObjectID(dados._id_cliente);
                dados._id_usuario = ObjectID(dados._id_usuario);
                dados._api_id = '';
                dados._endpoint_id = '';
                dados.retorno_api_endpoint = {};
                dados.retorno_cliente = {};
                dados.created_at = new Date();
                dados.updated_at = new Date();
                dados.tempo_processamento = 1;
                dados.finalizado = false;
                MongoClient.connect(this._connection, { useUnifiedTopology: true }, (err, client) => {
                    if (err) {
                        return reject(new databaseError(err));
                    }
                    let db = client.db(this._database);
                    db.collection(this._collection).insertOne(dados, (err, result) => {
                        if (err) {
                            return reject(new databaseError(err));
                        }
                        if (result.insertedCount === 1 && result.insertedId != '') {
                            this.retorno.status.status = true;
                            this.retorno.status.message = 'ok';
                            this.retorno.result.data = result.ops[0];
                        } else {
                            this.retorno.status.status = false;
                            this.retorno.status.message = 'falha';
                            this.retorno.result.data = null;
                        }
                        client.close();
                        return resolve(this.retorno);
                    });
                });
            } else {
                return reject(new requisicoesModelError(1));
            }
        }).catch((err) => {
            this.retorno.status.status = false;
            this.retorno.status.message = err.messageSuper();
            return this.retorno;
        });
    }

    async update(_id, dados) {
        this.resetRetorno();
        //METODO QUE FAZ A ATUALIZAÇÃO DE UM DOCUMENTO DE UMA COLLECTION CONFORME _id INFORMADO,
        //É ACRESCENTADO A AUTALIZAÇÃO DO ATRIBUTO updated_at JUNTO DOS DEMAIS DADOS RECEBIDOS
        return new Promise((resolve, reject) => {
            if (_id !== undefined && dados !== undefined) {
                dados.updated_at = new Date();
                MongoClient.connect(this._connection, { useUnifiedTopology: true }, (err, client) => {
                    if (err) {
                        return reject(new databaseError(err));
                    }
                    let db = client.db(this._database);
                    db.collection(this._collection).updateOne({ "_id": _id }, { $set: dados }, (err, result) => {
                        if (err) {
                            client.close();
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
                return reject(new requisicoesModelError(1));
            }
        }).catch((err) => {
            this.retorno.status.status = false;
            this.retorno.status.message = err.messageSuper();
            return this.retorno;
        });
    }

    async countRequisicoesMensal(_id) {
        this.resetRetorno();
        //METODO QUE FAZ A CONTAGEM DE REQUISIÇÕES DE UM CLIENTE NO MÊS CONFORME ID INFORMADO
        const startOfMonth = moment().startOf('month').format('YYYY-MM-DD[T00:00:00.000Z]');
        const endOfMonth = moment().endOf('month').format('YYYY-MM-DD[T23:59:59.999Z]');
        return new Promise((resolve, reject) => {
            if (_id !== undefined) {
                MongoClient.connect(this._connection, { useUnifiedTopology: true }, (err, client) => {
                    if (err) {
                        return reject(new databaseError(err));
                    }
                    let db = client.db(this._database);
                    db.collection(this._collection).find({ "_id_cliente": _id, created_at: { $gte: new Date(startOfMonth), $lte: new Date(endOfMonth) } }).count((err, result) => {
                        if (err) {
                            client.close();
                            return reject(new databaseError(err));
                        }
                        this.retorno.status.status = true;
                        this.retorno.status.message = 'ok';
                        this.retorno.result.total = parseInt(result);
                        client.close();
                        return resolve(this.retorno);
                    });
                });
            }
            else {
                return reject(new requisicoesModelError(1));
            }

        }).catch((err) => {
            this.retorno.status.status = false;
            this.retorno.status.message = err.messageSuper();
            return this.retorno;
        });
    }

    async countRequisicoesDiarias(_id) {
        this.resetRetorno();
        //METODO QUE FAZ A CONTAGEM DE REQUISIÇÕES DE UM CLIENTE NO MÊS CONFORME ID INFORMADO
        const startDay = moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]');
        const endDay = moment(new Date()).format('YYYY-MM-DD[T23:59:59.999Z]');
        return new Promise((resolve, reject) => {
            if (_id !== undefined) {
                MongoClient.connect(this._connection, { useUnifiedTopology: true }, (err, client) => {
                    if (err) {
                        return reject(new databaseError(err));
                    }
                    let db = client.db(this._database);
                    db.collection(this._collection).find({ "_id_cliente": _id, created_at: { $gte: new Date(startDay), $lte: new Date(endDay) } }).count((err, result) => {
                        if (err) {
                            client.close();
                            return reject(new databaseError(err));
                        }
                        this.retorno.status.status = true;
                        this.retorno.status.message = 'ok';
                        this.retorno.result.total = parseInt(result);
                        client.close();
                        return resolve(this.retorno);
                    });
                });
            }
            else {
                return reject(new requisicoesModelError(1));
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
module.exports = { Requisicoes };