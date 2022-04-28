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
        var nameFile = process.argv[1]; // Pega o argumento passado por parâmetro e seta como nome do arquivo
        var content = fs.readFileSync(path.join(__dirname, '../../../archives/mongodb/seeder.txt'));

        if (nameFile) {
            // Cria o arquivo de seeder dentro da referida pasta
            fs.writeFile(path.join(__dirname, `../seeders/${ nameFile }.js`), content, (err) => {
                if (err) {
                    throw new Error(err);
                }

                // Configura o arquivo seeder que vai rodar todas as funções
                fs.readdir(path.join(__dirname,'../seeders'), (err, files) => {
                    if (err) {
                        throw new Error(err);
                    }

                    var imports = `"use strict";\r\n\r\n// ---- Imports ---- //\r\n`;

                    var module_exports_seed = `module.exports.seed = () => { \r\n`;

                    // Faz o require de cada um dos arquivos e configura o método seed
                    files.forEach((file) => {
                        imports += `var ${ file.replace('.js', '') } = require('./seeders/${ file.replace('.js', '') }'); \r\n`;
                        module_exports_seed += `  ${ file.replace('.js', '') }.seeder(); \r\n`;
                    });

                    imports += `\r\n\r\n`;
                    module_exports_seed += `};\r\n\r\n`;

                    var contentSeeder = imports + module_exports_seed;
                    fs.writeFileSync(path.join(__dirname,'../seed.js'), contentSeeder);

                    console.log(`[ ${ new Date().toLocaleTimeString() } ] : Seeder ${ nameFile } criada com sucesso`);
                });
            });
        } else {
            throw new Error('É preciso dar um nome para o arquivo de seed');
        }
    } catch (err) {
        console.log(`[ ${ new Date().toLocaleTimeString() } ] : Ocorreu um erro : `, err);
    }
};

module.exports.delete = () => {
    try {
        var nameFile = process.argv[1]; // Pega o argumento passado por parâmetro e seta como nome do arquivo

        if (nameFile != 'all') {
            // Apaga o arquivo seeder passado por parâmetro
            fs.unlink(path.join(__dirname, `../seeders/${ nameFile }.js`), (err) => {
                if (err) {
                    throw new Error(err);
                }

                // Reconfigura o arquivo seed, que vai rodar o comando seed
                fs.readdir(path.join(__dirname,'../seeders'), (err, files) => {
                    if (err) {
                        throw new Error(err);
                    }

                    var imports = `"use strict";\r\n\r\n// ---- Imports ---- //\r\n`;

                    var module_exports_seed = `module.exports.seed = () => { \r\n`;

                    // Faz o require de cada um dos arquivos e configura o método up e down
                    files.forEach((file) => {
                        imports += `var ${ file.replace('.js', '') } = require('./migrations/${ file.replace('.js', '') }'); \r\n`;
                        module_exports_seed += `  ${ file.replace('.js', '') }.seeder(); \r\n`;
                    });

                    imports += `\r\n\r\n`;
                    module_exports_seed += `};\r\n\r\n`;

                    var contentSeeder = imports + module_exports_seed;
                    fs.writeFileSync(path.join(__dirname,'../seed.js'), contentSeeder);

                    console.log(`[ ${ new Date().toLocaleTimeString() } ] : Seeder ${ nameFile } apagada com sucesso`);
                });
            });
        } else if (nameFile === 'all') {
            // Configura o arquivo seeder que vai rodar todas as seeders
            fs.readdir(path.join(__dirname,'../seeders'), (err, files) => {
                if (err) {
                    throw new Error(err);
                }

                files.forEach((file) => {
                    // Apaga cada um dos arquivos no diretório seeders
                    fs.unlink(path.join(__dirname, `../seeders/${ file }`), (err) => {
                        if (err) {
                            throw new Error(err);
                        }
                    });
                });

                fs.unlinkSync(path.join(__dirname,'../seed.js'));
                console.log(`[ ${ new Date().toLocaleTimeString() } ] : Todas as seeders foram apagadas`);
            });
        } else {
            throw new Error('É preciso informar o nome do arquivo de migração que será apagado');
        }
    } catch (err) {
        console.log(`[ ${ new Date().toLocaleTimeString() } ] : Ocorreu um erro : `, err);
    }
};