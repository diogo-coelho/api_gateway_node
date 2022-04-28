"use strict";
/* IMPORT DE PACOTES */
require('dotenv/config'); // PACOTE PARA LER .ENV
const express = require('express'); // FRAMEWORK EXPRESS 
const fs = require('fs'); // BIBLIOTECA FILE SYSTEM
const path = require('path'); // BIBLIOTECA PATH
const bodyParser = require('body-parser'); // BODY-PARSE PARA FORMATAÇÃO NAS REQUEST
const consign = require('consign'); // CONSIGN PARA LOAD DE CONTROLLERS, MODELS E MAIS MODULOS
const request_promise = require('request-promise'); // REQUEST-PROMISSE PARA FAZER REQUSIÇÕES A OUTRAS APIS 
const cors = require('cors');                       // CORS PARA AUTORIZAÇÃO DE DOMINIO
const moment = require('moment'); // PARA FORMATAR DATAS, POIS O Date DO JS NÃO TEM MUITAS OPÇÕES
const application = express(); //INSTANCIA O EXPRESS

/* APLICAÇAÕ DE ALGUMAS VARIAVEIS NO application */
application.set("fs", fs);//ADCIONA O fs AO AMBIENTE
application.set("path", path); //ADCIONA O path AO AMBIENTE
application.set('view engine', 'ejs'); // DEFINIÇÃO DA CONFIGURAÇÃO DE REDERIZAÇÃO DE VIEWS
application.set('views', './app/views/'); //DFENIÇÃO DA PASTA DE VIEWS
application.set('port_secure', process.env.PORT_SECURE || 443); //CONFIGURA QUAL PORTA O SERVIDOR IRÁ ESCUTAR (PORTA SEGURA)
application.set('port_unsecure', process.env.PORT_UNSECURE || 81); //CONFIGURA QUAL PORTA O SERVIDOR IRÁ ESCUTAR (PORTA PADRÃO SEM SEGURANÇA SSL)
application.set('request_promise', request_promise);
application.set('moment', moment);

application.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); // MIDDLEWARE QUE CONFIGURA AS REQUESTS
application.use(bodyParser.json()); // MIDDLEWARE QUE CONFIGURA AS REQUESTS EM JSON
application.use(cors());

// consign FAZ O LOAD AUTOMÁTICO DE MODELS, CONTROLLERS, ROUTES...
var consign_path = process.env.NODE_ENV === 'production' ? 'build' : process.cwd();
consign({ cwd: consign_path })
    .include('app/controllers')
    .then('app/helps/')
    .then('app/middlewares')
    .then('app/routes/')
    .then('app/crons/')
    .into(application);

module.exports = application;