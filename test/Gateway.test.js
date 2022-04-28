"use strict";

// ------------------------------------------------------------- //
// ------------------------------------------------------------- //
// -----  Arquivo de Testes da Resource de Geolocalização  ----- //
// ------------------------------------------------------------- //
// ------------------------------------------------------------- //

let server = require('../server');
let chai = require('chai');
let chaiHttp = require('chai-http');
let { expect } = chai;
chai.use(chaiHttp);
var geolocalizacao = '6dcb8179d51ace6589f59258f8cd9199';
var authorizationToken = '4294de7a746800c0f4dc6fd9ab30b423';
var parametros = { api: geolocalizacao, empresa: 'Nestle', pais: 'BR', cidade: 'São Paulo' };



describe('Testes unitários do Gateway', () => {


    describe('/GET/TESTE DE SERVIDOR', () => {
        it('Verifica se o servidor subiu e está respondendo', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });


    describe('/GET/TESTE DO Authorization Header', () => {
        it('Caso não informe Authorization Token do Header, retorna status 401', (done) => {
            chai.request(server)
                .get('/v1')
                .query({ api: geolocalizacao })
                //.set('Authorization', authorizationToken)
                .end((err, res) => {
                    if (err) {
                        console.log('Erro', err);
                        return done(err);
                    }
                    expect(res).to.have.status(401);
                    expect(res.body.status.status_code).to.equal(401);
                    expect(res.body.status.message).to.equals("Token Authorization não foi informado");
                    done();
                });
        }).timeout(60000);
    });

    describe('/GET/TESTE DO TOKEN DE API', () => {
        it('Caso não informe Token de API, retorna status 401', (done) => {
            chai.request(server)
                .get('/v1')
                .query({ empresa: parametros.empresa })
                .set('Authorization', authorizationToken)
                .end((err, res) => {
                    if (err) {
                        console.log('Erro', err);
                        return done(err);
                    }
                    expect(res).to.have.status(401);
                    expect(res.body.status.status_code).to.equal(401);
                    expect(res.body.status.message).to.equals("Token da API não foi informado");
                    done();
                });
        });
    });


    describe('/GET/TESTE DE REQUISIÇÃO API GEOLOCALIZACAO', () => {
        it('Caso todos os parametros sejam informados, faz requisição na API, caso sucesso deve retorna status 200', (done) => {
            chai.request(server)
                .get('/v1')
                .query(parametros)
                .set('Authorization', authorizationToken)
                .end((err, res) => {
                    if (err) {
                        console.log('Erro', err);
                        return done(err);
                    }
                    expect(res).to.have.status(200);
                    expect(res.body.status.status_code).to.equal(200);
                    //expect(res.body.status.message).to.equals("Success");
                    done();
                });
        }).timeout(60000);
    });



});