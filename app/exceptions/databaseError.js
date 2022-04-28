
"use strict";
// -------------------------------------------------------------------- //
// -------------------------------------------------------------------- //
// ----------------------- Classe de Erros ---------------------------- //
// -------------------------------------------------------------------- //
// -------------------------------------------------------------------- //
class databaseError extends Error {
    constructor(messageError, code) {
        super(message);
        this.name = this.constructor.name;
        var message;
        var status_code_http;

        if ((typeof code === "object" || typeof code === 'function')) {
            message = "\n\r" + " ErrorCode: " + code.code + "\n" + " ErrorMessage: " + code.message + "\n" + " Trace: " + "\n" + code.stack;
            status_code_http = 504;
        } else {
            if (messageError !== undefined) {
                message = messageError;
                status_code_http = code;
            } else {
                switch (code) {
                    case 1:
                        message = "Falha de Conexão com o banco de dados";
                        status_code_http = 504;
                        break;

                    default:
                        message = "Erro não identificado, contate o Desenvolvedor";
                        status_code_http = 500;
                }
            }

        }

        this.message = message;
        this.status_code_http = status_code_http;
    }

    statusCodeHttp() {
        return this.status_code_http;
    }

    messageSuper() {
        return this.message;
    }
    message() {
        return this.message;
    }
}

module.exports = databaseError;