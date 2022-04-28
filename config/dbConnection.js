"use strict";

// ----------------------------------------------------- //
// ----------------------------------------------------- //
// ----     Configurações de acesso ao MongoDB      ---- //
// ----------------------------------------------------- //
// ----------------------------------------------------- //
require('dotenv/config');

// Connection URL
const url = process.env.MONGODB_URL_API_GATEWAY;
const database = process.env.MONGODB_DATABASE_API_GATEWAY;

module.exports = function () {
	return { url, database };
};