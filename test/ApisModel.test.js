"use strict";
let { Apis } = require('../app/models/Apis');
let chai = require('chai');
let expect = chai.expect;
let should = chai.should();

describe('Testes Model - Apis', () => {
    var apitoken = '6dcb8179d51ace6589f59258f8cd9199'; // API GEOLOCALIZAÇÃO
    var endpoint_id_api = '5eff96e1a7efd2c78859b3c1'; // API GEOLOCALIZAÇÃO

    describe('Apis findApiToken', () => {

        it('Metodo deve retornar o status false caso token de api não for informado', (done) => {
            var apisFind = new Apis();
            apisFind.findApiToken().then((retorno) => {
                //console.log("Resultado =", retorno);
                should.equal(retorno.status.status, false);
                done();
            });
        }).timeout(60000);


        it('Metodo deve retornar a api cadastrada conforme o token informado', (done) => {
            var apisFind = new Apis();
            apisFind.findApiToken(apitoken).then((retorno) => {
                //console.log("Resultado =", retorno);
                should.equal(retorno.status.status, true);
                done();
            });
        }).timeout(60000);

    });

    describe('Apis findApiTokenEndPoint', () => {
        it('Metodo deve retornar o status false caso token de api não for informado', (done) => {
            var apisFind = new Apis();
            apisFind.findApiTokenEndPoint().then((retorno) => {
                //console.log("Resultado =", retorno);
                should.equal(retorno.status.status, false);
                done();
            });
        }).timeout(60000);


        it('Metodo deve retornar os endpoints de apis ordenando pelo menor numero de requições', (done) => {
            var apisFind = new Apis();
            apisFind.findApiTokenEndPoint(apitoken).then((retorno) => {
                //console.log("Resultado =", retorno);
                should.equal(retorno.status.status, true);
                done();
            });
        }).timeout(60000);

    });

    describe('Apis update - incrementarRequisicaoEndpointApi', () => {

        it('Metodo deve retornar status false caso um id não serem informados na requisição do metodo', (done) => {
            var apisFind = new Apis();
            apisFind.incrementarRequisicaoEndpointApi().then((retorno) => {
                //console.log("Resultado =", retorno);
                should.equal(retorno.status.status, false);
                done();
            });
        }).timeout(60000);


        it('Metodo deve retornar status true caso consiga fazer o incremento de requisições de um endpoint', (done) => {
            var apisFind = new Apis();
            apisFind.incrementarRequisicaoEndpointApi(endpoint_id_api).then((retorno) => {
                //console.log("Resultado =", retorno);
                should.equal(retorno.status.status, true);
                done();
            });
        }).timeout(60000);

    });

    describe('Apis update - decrementarRequisicaoEndpointApi', () => {

        it('Metodo deve retornar status false caso um id não serem informados na requisição do metodo', (done) => {
            var apisFind = new Apis();
            apisFind.decrementarRequisicaoEndpointApi().then((retorno) => {
                //console.log("Resultado =", retorno);
                should.equal(retorno.status.status, false);
                done();
            });
        }).timeout(60000);


        it('Metodo deve retornar status true caso consiga fazer o decremento de requisições de um endpoint', (done) => {
            var apisFind = new Apis();
            apisFind.decrementarRequisicaoEndpointApi(endpoint_id_api).then((retorno) => {
                //console.log("Resultado =", retorno);
                should.equal(retorno.status.status, true);
                done();
            });
        }).timeout(60000);

    });




});