//IMPORTO UMA FUNÇÃO DE CONTROLE DE ERROS DE EXCESSÃO
const securityApi = require('../exceptions/securityApi');
//IMPORTAÇÃO DE MODELS
const { Apis } = require('../models/Apis');
const { Requisicoes } = require('../models/Requisicoes');
const { Logs } = require('../helps/Logs');
const log = new Logs();
const require_promisse = require('request-promise');

module.exports = application => {
    "use strict";
    const controller = {
        index: async (req, res) => {
            //METODO PRINCPAL QUE FAZ O PROCESSAMENTO DA REQUISIÇÃO
            let retornoApi = req.retornoApi;
            log.logFile("Processamento da Requisição " + retornoApi.request_id + " Iniciado", retornoApi.request_id);
            //INSTANCIA A MODEL REQUISICOES
            let RequisicoesModel = new Requisicoes(application.MongoDB);
            try {
                //INSTANCIA A MODEL APIs, E FAZ A BUSCA DA API SOLICITADA NA REQUISICAO
                let ApisFind = new Apis(application.MongoDB);
                let apiEncontrada = await ApisFind.findApiToken(retornoApi.query.parameters.api);
                if (apiEncontrada.status.status === true && apiEncontrada.result.total === 1) {
                    log.logFile("Api Encontrada atravez do Token " + JSON.stringify(apiEncontrada.result.data), retornoApi.request_id);
                    //API ENCONTRADA E SERVIÇO ATIVO
                    //VAI BUSCAR END POINTS PARA FAZER A REQUISIÇÃO
                    let apiEndPoint = await ApisFind.findApiTokenEndPoint(retornoApi.query.parameters.api);
                    if (apiEndPoint.status.status === true) {
                        //ENDPOINT DA API LOCALIZADO, IRÁ RECUPERAR O PRIMEIRO REGISTRO
                        apiEndPoint = apiEndPoint.result.data.shift();
                        log.logFile("End Point com menos requisições encontrado " + JSON.stringify(apiEndPoint), retornoApi.request_id);
                        //FAZ ATUALIZAÇÃO NA COLLECTION REQUISIÇÃO DE QUAL ENDPOINT SERÁ USADO
                        RequisicoesModel.update(retornoApi.request_id, { _api_id: apiEncontrada.result.data._id, _endpoint_id: apiEndPoint.endpoints._id });
                        //FAZ O INCRMENTO DO TOTAL DE REQUISIÇÕES NO ENDPOINT

                        let resultadofinal = await ApisFind.incrementarRequisicaoEndpointApi(apiEndPoint.endpoints._id).then(() => {
                            log.logFile("Atualizado o numero de requisições do endpoint", retornoApi.request_id);
                            log.logFile("Fazendo requisição na API", retornoApi.request_id);
                            //CHAMA UM MEDOTO QUE VAI VERFICAR QUAL API SERÁ ACIONADA, SÃO PASSADOS PARAMETROS DO USUARIO + A API LOCALIZADA
                            let resultadoApi = controller.requestServiceApi(retornoApi.query.parameters, apiEndPoint).then((resultRequestApi) => {
                                log.logFile("API respondeu com " + JSON.stringify(resultRequestApi), retornoApi.request_id);
                                //AO FINALIZAR A REQUISIÇÃO PARA A API, DECREMENTA 1 REQUISIÇÃO DO ENDPOINT
                                ApisFind.decrementarRequisicaoEndpointApi(apiEndPoint.endpoints._id);
                                return resultRequestApi;
                            });
                            return resultadoApi;
                        });
                        log.logFile("Tratativas de Retorno", retornoApi.request_id);
                        //SETA O RESULTADO DA API NO RETORNO PRINCIPAL PAR AO CLIENTE 

                        if (resultadofinal.status.status_code === 200) {
                            retornoApi.result = resultadofinal.resultado;
                            retornoApi.status.status_code = resultadofinal.status.status_code;
                            retornoApi.status.message = resultadofinal.status.mensagem;
                            //retornoApi.status.message = "Success";
                        } else {
                            retornoApi.result = {};
                            retornoApi.status.status_code = resultadofinal.status.status_code;
                            retornoApi.status.message = resultadofinal.status.mensagem;
                        }
                    } else {
                        //NÃO LOCALIZADO NENHUM ENDPOINT DISPONIVEL
                        throw new securityApi(9);
                    }
                } else {
                    //API PARECE NÃO ESTAR DISPONIVEL OU NÃO FOI LOCALIZDA
                    throw new securityApi(8);
                }
            } catch (err) {
                console.log("Falha gerada em " + retornoApi.request_id + "--> " + err);
                log.logFile("Falha gerada --> " + err.messageSuper() + " <--", retornoApi.request_id);
                retornoApi.result = null;
                retornoApi.status.status_code = err.statusCodeHttp();
                retornoApi.status.message = err.messageSuper();

            }
            log.logFile("Finalizando requisição...", retornoApi.request_id);
            //FAÇO UM CALCULO PARA SABER QUANTO TEMPO A REQUISIÇÃO DEMOROU
            let startDate = new Date(retornoApi.created_at);
            let endDate = new Date();
            let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
            //FAZ ATUALIZAÇÃO FINAL NA COLLECTION REQUISIÇÃO
            delete retornoApi.created_at;
            RequisicoesModel.update(retornoApi.request_id, { retorno_cliente: retornoApi, retorno_api_endpoint: retornoApi.result, finalizado: true, tempo_processamento: seconds });
            log.logFile("Retorno enviado ao cliente" + JSON.stringify(retornoApi), retornoApi.request_id);
            res.status(retornoApi.status.status_code).json(retornoApi);

        },

        requestServiceApi: async (parameters, api) => {
            delete parameters.api;
            let resultApiRequest = false;
            try {
                resultApiRequest = await require_promisse({
                    url: api.endpoints.endpoint,
                    qs: parameters,
                    method: 'GET'
                }).catch((err) => {
                    console.log("Erro de Requisição -> ", err);
                    return err.response.body;
                });
                return JSON.parse(resultApiRequest);
            } catch (err) {
                resultApiRequest = false;
            }
            return resultApiRequest;
        }

    };
    return controller;


};