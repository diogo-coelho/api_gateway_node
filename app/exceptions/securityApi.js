
"use strict";
// -------------------------------------------------------------------- //
// -------------------------------------------------------------------- //
// ----------------------- Classe de Erros ---------------------------- //
// -------------------------------------------------------------------- //
// -------------------------------------------------------------------- //
class securityApi extends Error {
    //DEFINIÇÃO DE POSSIVEIS ERROS NO MOOMENTO DE VALIDAÇÃO DE ACESSO AOS SERVIÇOS DE APIs
    constructor(code) {
        super(message);
        this.name = this.constructor.name;
        var message;
        var status_code_http;
        switch (code) {
            case 1:
                message = "API token was not informed";
                status_code_http = 401;
                break;
            case 2:
                message = "Token Authorization was not informed";
                status_code_http = 401;
                break;
            case 3:
                message = "User not found";
                status_code_http = 403;
                break;
            case 4:
                message = "User is not enabled to use this service";
                status_code_http = 403;
                break;
            case 5:
                message = "Customer is not qualified to use this service";
                status_code_http = 403;
                break;
            case 6:
                message = "Monthly requisition limit exceeded";
                status_code_http = 403;
                break;
            case 7:
                message = "Daily requests limit exceeded";
                status_code_http = 403;
                break;
            case 8:
                message = "Resource currently unavailable";
                status_code_http = 503;
                break;
            case 9:
                message = "Resource found currently unavailable";
                status_code_http = 503;
                break;
            case 10:
                message = "Server request failed";
                status_code_http = 500;
                break;

            default:
                message = "Unidentified error, contact the Administrator";
                status_code_http = 500;
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

module.exports = securityApi;