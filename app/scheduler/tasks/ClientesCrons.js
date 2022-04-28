"use strict";

const { Clientes } = require('../../models/Clientes');
const { Requisicoes } = require('../../models/Requisicoes');
const { Logs } = require('../../helps/Logs');
let log;
class ClientesCrons {
    constructor() {
        log = new Logs();
    }

    async updateRequisicoesDiarias() {
        log.logFile("Atualização das Requisições Diarias de Clientes Iniciada as " + new Date(), "cron_requisicoes_diarias");
        let ClientesFind = new Clientes();
        let ClientesUpdate = new Clientes();
        let RequisicoesCount = new Requisicoes();
        let clientesEncontrados = await ClientesFind.findClientes();
        let promises;
        if (clientesEncontrados.status.status === true && clientesEncontrados.result.total > 0) {
            promises = clientesEncontrados.result.data.map(async (cliente) => {
                await RequisicoesCount.countRequisicoesDiarias(cliente._id).then(async (totalDiaria) => {
                    if (totalDiaria.status.status === true) {
                        await ClientesUpdate.update(cliente._id, { "requisicoes_diarias": totalDiaria.result.total, updated_at: new Date() }).then((result) => {
                            if (result.status.status === true && result.result.update === true) {
                                log.logFile("Cliente " + cliente.cnpj + " - " + cliente.razao_social + " atualizado para " + totalDiaria.result.total + " requisições diarias", "cron_requisicoes_diarias");
                            } else {
                                log.logFile("Cliente " + cliente.cnpj + " - " + cliente.razao_social + " NÃO foi atualizado para " + totalDiaria.result.total + " requisições diarias", "cron_requisicoes_diarias");
                            }
                        });
                    }
                });
            });
        }
        await Promise.all(promises);
        log.logFile("Atualização das Requisições Diarias de Clientes Encerrada as " + new Date(), "cron_requisicoes_diarias");
    }

    async updateRequisicoesMensais() {
        log.logFile("Atualização das Requisições Mensais de Clientes Iniciada as " + new Date(), "cron_requisicoes_mensais");
        let ClientesFind = new Clientes();
        let ClientesUpdate = new Clientes();
        let RequisicoesCount = new Requisicoes();
        let clientesEncontrados = await ClientesFind.findClientes();
        let promises;
        if (clientesEncontrados.status.status === true && clientesEncontrados.result.total > 0) {
            promises = clientesEncontrados.result.data.map(async (cliente) => {
                await RequisicoesCount.countRequisicoesMensal(cliente._id).then(async (totalMensal) => {
                    if (totalMensal.status.status === true) {
                        await ClientesUpdate.update(cliente._id, { "requisicoes_mensais": totalMensal.result.total, updated_at: new Date() }).then((result) => {
                            if (result.status.status === true && result.result.update === true) {
                                log.logFile("Cliente " + cliente.cnpj + " - " + cliente.razao_social + " atualizado para " + totalMensal.result.total + " requisições mensais", "cron_requisicoes_mensais");
                            } else {
                                log.logFile("Cliente " + cliente.cnpj + " - " + cliente.razao_social + " NÃO foi atualizado para " + totalMensal.result.total + " requisições mensais", "cron_requisicoes_mensais");
                            }
                        });
                    }
                });
            });
        }
        await Promise.all(promises);
        log.logFile("Atualização das Requisições Mensais de Clientes Encerrada as " + new Date(), "cron_requisicoes_mensais");
    }


}
module.exports = { ClientesCrons };