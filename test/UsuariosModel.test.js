"use strict";
let { Usuarios } = require('../app/models/Usuarios');
let chai = require('chai');
let expect = chai.expect;
let should = chai.should();

describe('Testes Model - Usuarios', () => {
    describe('Usuários findUsuarioToken', () => {

        it('Ao não passar o authorizationToken do usuario por parâmetro, deve retornar status:false', (done) => {
            var userFind = new Usuarios();
            userFind.findUsuarioToken().then((retorno) => {
                //console.log("Resultado =", retorno);
                should.equal(retorno.status.status, false);
                done();
            });
        }).timeout(10000);


        it('Ao informar authorizationToken do usuario por parâmetro, deve retornar um objeto com status:true + result:data com dados do usuario ', (done) => {
            var userFind = new Usuarios();
            userFind.findUsuarioToken('4294de7a746800c0f4dc6fd9ab30b423').then((retorno) => {
                //console.log("Resultado =", retorno);
                should.equal(retorno.status.status, true);
                should.equal(retorno.result.total, 1);
                expect(retorno.result.data._id).to.exist;
                expect(retorno.result.data.nome).to.exist;
                expect(retorno.result.data.cliente_cnpj).to.exist;
                expect(retorno.result.data.email).to.exist;
                expect(retorno.result.data.ativo).to.exist;
                expect(retorno.result.data.token).to.exist;
                expect(retorno.result.data.apis).to.exist;
                done();
            });
        }).timeout(10000);

    });

});