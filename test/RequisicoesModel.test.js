"use strict";
let { Requisicoes } = require('../app/models/Requisicoes');
let chai = require('chai');
let expect = chai.expect;
let should = chai.should();

describe('Testes Model - Requisicoes', () => {
    var dadosRequisicao = {
        _id_cliente: 18901359000103,
        _id_usuario: 1,
        api_token: 'teste',
        authorizationToken: 'teste',
        parameters: { teste: '' },
    }
    describe('Requisicoes create', () => {
        it('Metodo deve retornar o status false não sejam informados parametros para cadastro', (done) => {
            var requisicao = new Requisicoes();
            requisicao.create().then((retorno) => {
                //console.log("Resultado =", retorno);
                should.equal(retorno.status.status, false);
                done();
            });
        }).timeout(60000);

        it('Metodo deve retornar o status true fazendo a criação da requisição no banco de dados', (done) => {
            var requisicao = new Requisicoes();
            requisicao.create(dadosRequisicao).then((retorno) => {
                //console.log("Resultado =", retorno);
                dadosRequisicao = retorno.result.data;
                should.equal(retorno.status.status, true);
                done();
            });
        }).timeout(60000);
    });

    describe('Requisicoes update', () => {

        it('Metodo deve retornar status false caso um id ou os dados(update) não serem informados na requisição do metodo', (done) => {

            var apisFind = new Requisicoes();
            apisFind.update().then((retorno) => {
                //console.log("Resultado =", retorno);
                should.equal(retorno.status.status, false);
                done();
            });
        }).timeout(60000);

        it('Metodo deve retornar status true caso consiga fazer o a atualização do registro', (done) => {
            let dadosRequisicaoUpdate = dadosRequisicao;
            var requisicao = new Requisicoes();
            requisicao.update(dadosRequisicaoUpdate._id, dadosRequisicaoUpdate).then((retorno) => {
                //console.log("Resultado =", retorno);
                should.equal(retorno.status.status, true);
                done();
            });
        }).timeout(60000);

    });



});