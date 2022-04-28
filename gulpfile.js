// ----------------------------------------------------- //
// ----------------------------------------------------- //
// -----      Configurações de tarefas do Gulp      ---- //
// ----------------------------------------------------- //
// ----------------------------------------------------- //

const gulp = require('gulp'); // import do pacote Gulp
const jshint = require('gulp-jshint'); // import do pacote Gulp-JSHint
const terser = require('gulp-terser'); // import pacote terser
const minifyejs = require('gulp-minify-ejs'); // import pacote Gulp-Minify-EJS

// ---- Função que verifica os padrões de código da ferramenta ---- //
function verificaCodigo(cb) {
    gulp.src([
        './server.js',
        './config/*.js',
        './app/**/*.js',
        /*'./database/mongodb/*.js',
        './database/mongodb/migrations/*.js',
        './database/mongodb/seeders/*.js',
        './database/mongodb/config/*.js',*/
    ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', { verbose: true }));

    cb();
}

// ---- Função que minifica a pasta de configurações ---- //
function configuracoes(cb) {
    gulp.src('./config/*.js')
        .pipe(terser())
        .pipe(gulp.dest('./build/config'));

    cb();
}

// ---- Função que minifica a pasta de app ---- //
function application(cb) {
    gulp.src('./app/**/*.js')
        .pipe(terser())
        .pipe(gulp.dest('./build/app'));

    cb();
}

function templates(cb) {
    gulp.src([
        './app/**/**/*.ejs',
    ])
        .pipe(minifyejs())
        .pipe(gulp.dest('./build/app'));

    cb();
}

// ---- Função que minifica a pasta de erros ---- //
function erros(cb) {
    gulp.src('./logs/')
        .pipe(gulp.dest('./build/logs'));

    cb();
}

exports.jshint = verificaCodigo;
exports.build = gulp.series(
    verificaCodigo,
    configuracoes,
    application,
    templates,
    erros
);
