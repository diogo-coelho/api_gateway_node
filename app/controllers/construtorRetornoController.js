//DEFINE UMA ESTRURA PADRÃO PARA RESPOSTA DA API
module.exports = application => {
    "use strict";
    const controller = {
        contrutorRetorno: (req) => {
            //CONSTROI UM RETORNO PADRÃO
            if (req) {
                const retornoMetodo = {
                    status: {
                        status_code: 200,
                        message: null
                    },
                    result: {

                    },
                    query: {

                    }
                };
                //AQUI FAÇO UM MERGE DO QUE VEM POR QUERY E CASO VENHA ALGO NO BODY DE REQUEST
                retornoMetodo.query.parameters = Object.assign(req.body, req.query);
                /*//URL INFORMADA
                retornoMetodo.query.url = req.url;
                //METODO DA REQUISIÇÃO INFORMADA
                retornoMetodo.query.method = req.method;*/
                return retornoMetodo;
            } else {
                return false;
            }

        },
        setStatus: (message, status_code) => {
            //METODO PARA SETAR INFORMÇÃO DO STATUS DA REQUISIÇÃO
            return {
                status_code: status_code,
                message: message,
            };

        }
    };
    return controller;


};