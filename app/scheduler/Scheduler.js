//IMPLEMENTAÇÃO DE UM schedule EM NODE JS
let schedule = require('node-schedule');
const clc = require('cli-color');

//IMPORTO O SCHEDULER REFERENTE A CLIENTES
const { ClientesCrons } = require('./tasks/ClientesCrons');

class Scheduler {
    constructor() {

    }

    async start() {
        console.log(clc.green('Disparando Crons...'));
        let cronsClientes = new ClientesCrons();
        //A CADA 10 SEGUNDOS DISPARA ATUALIZAÇÃO DE CONTAGEM DIARIA DAS REQUSIÇÕES
        schedule.scheduleJob('*/60 * * * * *', function (fireDate) {
            //AUTALIZAÇÃO DAS REQUISIÇÕES DIARIAS
            cronsClientes.updateRequisicoesDiarias();
        });

        //A CADA 30 SEGUNDOS DISPARA ATUALIZAÇÃO DE CONTAGEM MENSAIS DAS REQUSIÇÕES
        schedule.scheduleJob('*/60 * * * * *', function () {
            //AUTALIZAÇÃO DAS REQUISIÇÕES MENSAIS
            cronsClientes.updateRequisicoesMensais();
        });
    }


}
module.exports = { Scheduler };



//IMPORTO O SCHEDULER REFERENTE A CLIENTES



