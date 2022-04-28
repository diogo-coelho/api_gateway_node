/*ROTA PADRÃO DE DE ACESSO VIA BROWSER, APENAS PARA REDERIZAR UMA VIEW*/
"use strict";
module.exports = function (application) {
    application.get('/', function (req, res) {
        res.render('index');
    });

};