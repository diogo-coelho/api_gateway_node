/* VALIDAÇÃO DE ACESSO DE UM USUARIO/CLIENTE|APLICAÇÃO AOS SERVIÇOS DE APIs DA ITB*/
//IMPORTO UMA FUNÇÃO DE CONTROLE DE ERROS DE EXCESSÃO
const securityApi = require('../exceptions/securityApi');
//IMPORTAÇÃO DE MODELS
const { Usuarios } = require('../models/Usuarios');
const { Clientes } = require('../models/Clientes');
const { Requisicoes } = require('../models/Requisicoes');
const { Logs } = require('../helps/Logs');
const log = new Logs();

module.exports = application => {
    "use strict";
    const controller = {
        authenticate: async (req, res, next) => {
            /*METODO RESPONSAVEL POR AUTENTICAR UM USUARIO/CLIENTE|APLICAÇÃO*/
            let idGenerico = Math.floor(Math.random() * (99999999 - 1) + 1);
            log.logFile("Requisição Recebida, Metodo de Autenticação Iniciado, ID aleatorio gerado = " + idGenerico, idGenerico);
            //CHAMO UMA CONTROLLER QUE DEFINE UM PADRÃO DE RETORNO DE API
            const construtorRetorno = application.app.controllers.construtorRetornoController;
            let retornoMetodo = construtorRetorno.contrutorRetorno(req);
            //VARIAVEL QUE IRÁ DEFINIR SE ESTA AUTORIZADO PROSSEGUIR COM O PROCESSAMENTO
            var autorizado = false;
            try {
                //RECUPRO O apiToken -> USADO PARA DEFINIR QUAL API DESEJA ULTILIZAR
                const apiToken = req.query.api;
                //RECUPRO O authorizationToken -> USADO PARA DAR PERMISSÃO DE USO NA APLICAÇÃO(IDENTIFICA UM CLIENTE/USUARIO)
                const authorizationToken = req.headers.authorization;
                //CASO AS VARIAVEIS DE apiToken OU authorizationToken SEJAM NULL, IREI LANÇAR UM ERRO
                if (apiToken != null && authorizationToken != null) {
                    log.logFile("Tokens Informados -> apiToken = " + apiToken + " authorizationToken = " + authorizationToken, idGenerico);
                    //INSTANCIA A MODEL DE USUARIOS
                    let UsuariosFind = new Usuarios();
                    //FAZ A BUSCA DO USUARIO ATRAVEZ DE UM TOKEN, INFORMADO DO HEADAER AUTOHORIZATION DA REQUISIÇÃO
                    let usuarioEncontrado = await UsuariosFind.findUsuarioToken(authorizationToken);
                    if (usuarioEncontrado.status.status === true) {
                        log.logFile("Usuario Encontrado -> " + JSON.stringify(usuarioEncontrado.result.data), idGenerico);
                        //USUARIO ENCONTRADO, 
                        //VALIDA SE O USARIO TEM ACESSO A API INFROMADA VIA TOKEN
                        if (usuarioEncontrado.result.data.apis.indexOf(apiToken) !== -1) {
                            //USUARIO TEM ACESSO A API
                            //IREI BUSCAR O CLIENTE
                            //INSTANCIA A MODEL DE CLIENTES
                            let ClientesFind = new Clientes();
                            //BUSCA O CLIENTE ATRAVEZ DO CNPJ ENCONTRADO NO CADASTRO DO USUARIO
                            let clienteEncontrado = await ClientesFind.findClienteCnpj(usuarioEncontrado.result.data.cliente_cnpj);
                            if (clienteEncontrado.status.status === true) {
                                log.logFile("Cliente Encontrado -> " + JSON.stringify(clienteEncontrado.result.data), idGenerico);
                                //CLIENTE ENCONTRADO, IREI VALIDAR SE O NUMERO DE REQUISIÇÕES MENSAIS E DIARIAS NÃO PASSOU DO LIMITE
                                log.logFile("Limite de requisições mensais do cliente é : " + parseInt(clienteEncontrado.result.data.limite_requisicoes_mensais) + " até o momento foram feitas " + parseInt(clienteEncontrado.result.data.requisicoes_mensais) + " no mês", idGenerico);
                                log.logFile("Limite de requisições diarias do cliente é : " + parseInt(clienteEncontrado.result.data.limite_requisicoes_diarias) + " até o momento foram feitas " + parseInt(clienteEncontrado.result.data.requisicoes_diarias) + " neste dia", idGenerico);
                                if (parseInt(clienteEncontrado.result.data.requisicoes_mensais) < parseInt(clienteEncontrado.result.data.limite_requisicoes_mensais)) {
                                    log.logFile("Autorizado nas requisições mensais", idGenerico);
                                    if (parseInt(clienteEncontrado.result.data.requisicoes_diarias) < parseInt(clienteEncontrado.result.data.limite_requisicoes_diarias)) {
                                        log.logFile("Autorizado nas requisições diarias", idGenerico);
                                        //CRIAÇÃO DE REQUIÇÃO NA COLLECTION
                                        log.logFile("Criação na collections Requisicoes", idGenerico);
                                        let RequisicoesModel = new Requisicoes();
                                        let resultCreateRequsicoes = await RequisicoesModel.create({
                                            _id_cliente: clienteEncontrado.result.data._id,
                                            _id_usuario: usuarioEncontrado.result.data._id,
                                            api_token: apiToken,
                                            authorizationToken: authorizationToken,
                                            parameters: retornoMetodo.query.parameters,
                                        });
                                        if (resultCreateRequsicoes.status.status === true) {
                                            log.logFile("Requisicao Criada novo ID = " + resultCreateRequsicoes._id, idGenerico);
                                            //CRIO UM ATRIBUTO DO ID DA REQUISIÇÃO PARA RETORNO PARA O CLIENTE
                                            retornoMetodo.request_id = resultCreateRequsicoes.result.data._id;
                                            retornoMetodo.created_at = resultCreateRequsicoes.result.data.created_at;
                                            //DENTRO DO LIMITE, AUTORIZA A REQUISIÇÃO
                                            autorizado = true;
                                            //ATRIBUIÇÃO DO STATUS AUTORIZADO
                                            retornoMetodo.status = construtorRetorno.setStatus("Processamento autorizado", 200);
                                        } else {
                                            throw new securityApi(10);
                                        }

                                    } else {
                                        //LIMITE DE REQUISIÇÕES DIARIAS EXCEDIDO
                                        throw new securityApi(7);
                                    }
                                } else {
                                    //LIMITE DE REQUISIÇÕES MENSAIS EXCEDIDO
                                    throw new securityApi(6);
                                }

                            } else {
                                //CLIENTE NÃO ENCONTRADO OU INATIVADO
                                throw new securityApi(5);
                            }
                        } else {
                            //USUARIO NÃO ENCONTRADO OU INATIVADO
                            throw new securityApi(4);
                        }
                    } else {
                        //USUARIO NÃO ENCONTRADO OU INATIVADO
                        throw new securityApi(3);
                    }
                } else {
                    // TOKEN DA API OU HEADER AUTHORIZATION NÃO FORAM INFORMADOS
                    if (apiToken == null) {
                        throw new securityApi(1);
                    }
                    if (authorizationToken == null) {
                        throw new securityApi(2);
                    }

                }
            } catch (err) {
                //console.log("Middleware -> ",err);
                //CATCH PARA TRATATIVAS DE ERRO, A CLASSE ULTILIZADA É A /exceptions/securityApi
                log.logFile("Não autorizado falha gerada --> " + err.messageSuper() + " <--", idGenerico);
                autorizado = false;
                retornoMetodo.status.status_code = err.statusCodeHttp();
                retornoMetodo.status.message = err.messageSuper();
            }
            //VALIDO SE ESTA AUTORIZADO O PROCESSAMENTO DA API
            if (autorizado === false) {
                log.logFile("Não foi autorizado o processamento", idGenerico);
                //NÃO AUTORIZADO O PROCESSAMENTO DE API, RETORNA A RESPOSTA PARA O CLIENTE
                res.status(retornoMetodo.status.status_code).json(retornoMetodo);
            } else {
                log.logFile("Autorizado o processamento", idGenerico);
                log.logRename(idGenerico, retornoMetodo.request_id);
                //INSIRO NA REQUISIÇÃO O RETONO DE API, E CHAMO O METODO next() PARA AVANÇAR NO PROCESSAMENTO.
                req.retornoApi = retornoMetodo;
                //res.status(retornoMetodo.status.status_code).json(retornoMetodo);
                next();
            }

        },
    };
    return controller;
};