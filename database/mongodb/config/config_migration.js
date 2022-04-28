"use strict";

// ----------------------------------------------------- //
// ----------------------------------------------------- //
// -----            Criando Migrations              ---- //
// ----------------------------------------------------- //
// ----------------------------------------------------- //

require('dotenv/config');
const fs = require('fs');
const path = require('path');

module.exports.make = () => {
    try {
        var nameFile = process.argv[1]; // Pega o argumento passado por parametro e seta como nome do arquivo
        var content = fs.readFileSync(path.join(__dirname, '../../../archives/mongodb/migration.txt'));

        if (nameFile) {
            // Cria o arquivo de migration dentro da referida pasta
            fs.writeFile(path.join(__dirname, `../migrations/${ nameFile }.js`), content, (err) => {
                if (err) {
                    throw new Error(err);
                }

                // Configura o arquivo migrate que vai rodar todas as migrações
                fs.readdir(path.join(__dirname,'../migrations'), (err, files) => {
                    if (err) {
                        throw new Error(err);
                    }

                    var imports = `"use strict";\r\n\r\n// ---- Imports ---- //\r\n`;

                    var module_exports_up = `module.exports.up = () => { \r\n`;
                    var module_exports_down = `module.exports.down = () => { \r\n`;

                    // Faz o require de cada um dos arquivos e configura o método up e down
                    files.forEach((file) => {
                        imports += `var ${ file.replace('.js', '') } = require('./migrations/${ file.replace('.js', '') }'); \r\n`;
                        module_exports_up += `  ${ file.replace('.js', '') }.up(); \r\n`;
                        module_exports_down += `    ${ file.replace('.js', '') }.down(); \r\n`;
                    });

                    imports += `\r\n\r\n`;
                    module_exports_up += `};\r\n\r\n`;
                    module_exports_down += `};\r\n\r\n`;

                    var contentMigrate = imports + module_exports_up + module_exports_down;
                    fs.writeFileSync(path.join(__dirname,'../migrate.js'), contentMigrate);

                    console.log(`[ ${ new Date().toLocaleTimeString() } ] : Migration ${ nameFile } criada com sucesso`);
                });
            });
        } else {
            throw new Error('É preciso dar um nome para o arquivo de migração');
        }
    } catch (err) {
        console.log(`[ ${ new Date().toLocaleTimeString() } ] : Ocorreu um erro : `, err);
    }
};

module.exports.delete = () => {
    try {
        var nameFile = process.argv[1]; // Pega o argumento passado por parametro e seta como nome do arquivo

        if (nameFile != 'all') {
            // Apaga o arquivo migrate passado por parâmetro
            fs.unlink(path.join(__dirname, `../migrations/${ nameFile }.js`), (err) => {
                if (err) {
                    throw new Error(err);
                }

                // Reconfigura o arquivo migrate, que vai rodar os comandos up e down
                fs.readdir(path.join(__dirname,'../migrations'), (err, files) => {
                    if (err) {
                        throw new Error(err);
                    }

                    var imports = `"use strict";\r\n\r\n// ---- Imports ---- //\r\n`;

                    var module_exports_up = `module.exports.up = () => { \r\n`;
                    var module_exports_down = `module.exports.down = () => { \r\n`;

                    // Faz o require de cada um dos arquivos e configura o método up e down
                    files.forEach((file) => {
                        imports += `var ${ file.replace('.js', '') } = require('./migrations/${ file.replace('.js', '') }'); \r\n`;
                        module_exports_up += `  ${ file.replace('.js', '') }.up(); \r\n`;
                        module_exports_down += `    ${ file.replace('.js', '') }.down(); \r\n`;
                    });

                    imports += `\r\n\r\n`;
                    module_exports_up += `};\r\n\r\n`;
                    module_exports_down += `};\r\n\r\n`;

                    var contentMigrate = imports + module_exports_up + module_exports_down;
                    fs.writeFileSync(path.join(__dirname,'../migrate.js'), contentMigrate);

                    console.log(`[ ${ new Date().toLocaleTimeString() } ] : Migration ${ nameFile } apagada com sucesso`);
                });
            });
        } else if (nameFile === 'all') {
            // Configura o arquivo migrate que vai rodar todas as migrações
            fs.readdir(path.join(__dirname,'../migrations'), (err, files) => {
                if (err) {
                    throw new Error(err);
                }

                files.forEach((file) => {
                    // Apaga cada um dos arquivos no diretório migrations
                    fs.unlink(path.join(__dirname, `../migrations/${ file }`), (err) => {
                        if (err) {
                            throw new Error(err);
                        }
                    });
                });

                fs.unlinkSync(path.join(__dirname,'../migrate.js'));
                console.log(`[ ${ new Date().toLocaleTimeString() } ] : Todas as migrations foram apagadas`);
            });
        } else {
            throw new Error('É preciso informar o nome do arquivo de migração que será apagado');
        }
    } catch (err) {
        console.log(`[ ${ new Date().toLocaleTimeString() } ] : Ocorreu um erro : `, err);
    }
};