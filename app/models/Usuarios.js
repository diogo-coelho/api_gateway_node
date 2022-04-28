"use strict";
//CLASSES PARA CONTROLE DE ERROS
const databaseError = require('../exceptions/databaseError');
const usuariosModelError = require('../exceptions/usuariosModelError');
/*IMPORT DO CONFIG MONGODB */
const dbConnection = require('../../config/dbConnection.js')();
/* IMPORT MONGODB */
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;

class Usuarios {
    constructor() {
        //NOMEAÇÃO DO BANCO DE DADOS E COLLECTION
        this._connection = dbConnection.url;
        this._database = dbConnection.databasex;
        this._collection = "usuarios";
        this.retorno = { status: { status: null, message: null }, result: { data: null } };
    }

    async findUsuarioToken(authorizationToken) {
        this.resetRetorno();
        //METODO QUE FAZ BUSCA DE UM USUARIO, CONFORME TOKEN
        return new Promise((resolve, reject) => {
            if (authorizationToken !== undefined && authorizationToken != '') {
                MongoClient.connect(this._connection, { useUnifiedTopology: true }, (err, client) => {
                    if (err) {
                        return reject(new databaseError(err));
                    }
                    let db = client.db(this._database);
                    db.collection(this._collection).findOne({ token: authorizationToken, ativo: true }, (err, result) => {
                        if (err) {
                            client.close();
                            return reject(new usuariosModelError(err));
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
                return reject(new usuariosModelError(1));
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
module.exports = { Usuarios };