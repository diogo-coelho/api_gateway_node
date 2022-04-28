"use strict";
//.ENV
require('dotenv/config');
const path = require('path');
const fs = require('fs');
const clc = require('cli-color');
const { Scheduler } = require('./app/scheduler/Scheduler');

/*INTANCIA DO SERVIDOR*/
//IMPORTA AS CONFIGURAÇÕES DO EXPRESS CONFORME AMBIENTE SETADO NO .ENV;
const application = require(path.join(__dirname, process.env.APP_ENV === 'production' ? 'build' : '', './config/express_server'));
const https = require('https');
const http = require('http');

//CONFIGURAÇÕES PARA O CERTIFICADO SSL

let options = {
    key: fs.readFileSync('./config/certificado_ssl/apis.itb360.com.br.key'),
    cert: fs.readFileSync('./config/certificado_ssl/apis.itb360.com.br.crt'),
    ca: [
        fs.readFileSync('./config/certificado_ssl/apis.itb360.com.br_0.ca'),
        fs.readFileSync('./config/certificado_ssl/apis.itb360.com.br_1.ca'),
    ]
};

let serverSecure = https.createServer(options, application).listen(application.get('port_secure'), function () {
    console.log('\n\r');
    console.log("Aplicação " + clc.yellow(process.env.APP_NAME) + ' Iniciada');
    console.log(clc.green('Server Up - Port ' + application.get('port_secure')));
    console.log("Aplicação em modo " + clc.yellow(process.env.APP_ENV.toUpperCase()));

    //NO MOMENTO QUE SUBO O SERVIDOR, FAÇO O DISPARO DAS TAREFAS DO SCHEDULER
    let schedulerObj = new Scheduler();
    schedulerObj.start();
});


let serverUnSecure = http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'].replace(application.get('port_unsecure'), application.get('port_secure')) + req.url });
    console.log(clc.yellowBright("Requisição HTTP recebida na porta " + application.get('port_unsecure') + "...redirecionando... para " + application.get('port_secure') + " >> ", "https://" + req.headers['host'].replace(application.get('port_unsecure'), application.get('port_secure')) + req.url));
    res.end();
}).listen(application.get('port_unsecure'));


module.exports = { serverSecure, serverUnSecure };