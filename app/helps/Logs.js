//FAZ A ESCRITA DE LOGS DO SITSTEMA
const fs = require('fs'); // BIBLIOTECA FILE SYSTEM
const path = require('path');
class Logs {
    constructor() {

        this.dirDefault = path.join(__dirname, '../../', process.env.APP_ENV === 'production' ? 'build' : '', '/logs/');
    }

    async logPadrao(message) {
        //CRIA UM LOG CONFORME A  message INFROMADA NO file INFORMADO
        try {
            fs.appendFileSync(this.dirDefault + "log.txt", `[ ${new Date().toLocaleTimeString()} ]: ${message} \r\n`, { encoding: 'utf-8' }, { 'flags': 'a+' });
        } catch (err) {
            //FALHA AO ESCREVER LOG
            return false;
        }
    }

    async logFile(message, file) {
        //CRIA UM LOG DE AUTENTICAÇÃO DA REQUISIÇÃO COM BASE NO idGenerico
        try {
            fs.appendFileSync(this.dirDefault + file + ".txt", `[ ${new Date().toLocaleTimeString()} ]: ${message} \r\n`, { encoding: 'utf-8' }, { 'flags': 'a+' });
        } catch (err) {
            //FALHA AO ESCREVER LOG
            return false;
        }
    }

    async logRename(id, newId) {
        //RENOMEIA UM LOG de id = genereico PARA O ID DA REQUISIÇÃO CIRADA NA COLLECTION
        try {
            let dirDefault = this.dirDefault;
            fs.rename(this.dirDefault + id + ".txt", this.dirDefault + newId + ".txt", function (err) {
                if (err) console.log('ERROR: ' + err);
                //INSEIR UMA MENSAGEM NO ARQUIVO RENOMEADO PARA INFROMAR QUE HOUVE RENOMEAÇÃO
                fs.appendFileSync(dirDefault + newId + ".txt", `[ ${new Date().toLocaleTimeString()} ]: Arquivo ${id}.txt alterado para ${newId}.txt \r\n\r\n`, { encoding: 'utf-8' }, { 'flags': 'a+' });
            });
        } catch (err) {
            //FALHA AO ESCREVER LOG
            return false;

        }
    }

}
module.exports = { Logs };
