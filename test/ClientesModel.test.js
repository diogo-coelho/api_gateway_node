"use strict";
let { Clientes } = require('../app/models/Clientes');
let chai = require('chai');
let expect = chai.expect;
let should = chai.should();

describe('Testes Model - Clientes', () => {

    describe('Clientes findClientes', () => {

        it('Metodo deve retornar todos os clientes cadastrados', (done) => {
            var clientesFind = new Clientes();
            clientesFind.findClientes({}).then((retorno) => {
                //console.log("Resultado =", retorno);
                should.equal(retorno.status.status, true);
                done();
            });
        }).timeout(60000);
    });


    describe('Clientes findClienteCnpj', () => {

        it('Metodo deve retornar falha caso o CNPJ não seja informado', (done) => {
            var clientesFind = new Clientes();
            clientesFind.findClienteCnpj().then((retorno) => {
                //console.log("Resultado =", retorno);
                should.equal(retorno.status.status, false);
                done();
            });
        }).timeout(60000);

        it('Metodo deve retornar apenas um cliente conforme o cnpj informado', (done) => {
            var clientesFind = new Clientes();
            clientesFind.findClienteCnpj('18901359000103').then((retorno) => {
                //console.log("Resultado =", retorno);
                should.equal(retorno.status.status, true);
                should.equal(retorno.result.total, 1);
                expect(retorno.result.data._id).to.exist;
                expect(retorno.result.data.razao_social).to.exist;
                expect(retorno.result.data.cnpj).to.exist;
                expect(retorno.result.data.ativo).to.exist;
                done();
            });
        }).timeout(60000);

    });


    describe('Clientes update', () => {

        it('Metodo deve retornar status false caso um id ou um data não sem informados na requisição do metodo', (done) => {
            var clientesFind = new Clientes();
            clientesFind.update().then((retorno) => {
                //console.log("Resultado =", retorno);
                should.equal(retorno.status.status, false);
                done();
            });
        }).timeout(60000);

        it('Metodo deve retornar status true caso consiga atualizar um cliente, deve ser informado um _id(object mongo) para fazer a atualização', (done) => {
            var clientesFind = new Clientes();
            clientesFind.update('5eff96e2a7efd2c78859b3c5', { updated_at: new Date }).then((retorno) => {
                //console.log("Resultado =", retorno);
                should.equal(retorno.status.status, true);
                should.equal(retorno.result.update, true);
                done();
            });
        }).timeout(60000);

    });


});