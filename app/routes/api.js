/*ROTA DE API*/
module.exports = application => {
    "use strict";
    //ROTA DO TIPO GET INICIAL versão 1.0 DA API
    application.get("/v1", function (req, res, next) {
        //AUTENTICAÇÃO DE USUARIO/CLIENTE|APLICAÇÃO E PERMISSÃO DE ULTLIZAÇÃO DE API SEGUINDO OS LIMITES DE REQUISIÇÕES ESTABELECIDOS EM CONTRATO
        //APÓS AUTENTICAR, VAI DIRECIONAR PARA OUTRO METODO, QUE IRA CUIDAR DO PROCESSAMENTO DA API, METODO DE AUTENTICAÇÃO ESTA DEFINIDO COMO UMA MIDDLEWARE
        const authUser = application.app.middlewares.authUser;
        authUser.authenticate(req, res, next);
    }, application.app.controllers.processarApiController.index);

    application.get("/teste", function (req, res, next) {

    });
};