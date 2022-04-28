
  

# API GATEWAY

  

Versão 2.0.1

  

### Índice

  

*  [Sobre o projeto e configuração](#markdown-header-sobre-o-projeto-e-configuracao)

  

*  [Migrations e Seeders](#markdown-header-migrations-e-seeders)

  

*  [Build](#markdown-header-build)

  

*  [Testes](#markdown-header-testes)

  

*  [APIs disponíveis e estrutura de retorno](#markdown-header-apis-disponiveis-e-estrutura-de-retorno)

  

*  [API de Geolocalização](#markdown-header-api-de-geolocalizacao)

  

*  [API de Contatos](#markdown-header-api-de-contatos)

  

*  [API M2](#markdown-header-api-m2)

  
  

### Sobre o projeto e configuração

  

O projeto **API Gateway**, que está em sua versão 2.0.1, tem como objetivo controlar o volume de requisições e balancear a carga para diversos servidores que possuem o API Center 3.0 Node JS de propriedade da ITB360 que são baseadas na linguagem NodeJS.

  

### Migrations e Seeders

  

  

O projeto API Center está configurado com scripts automáticos de migrations e seeders para o banco de dados MongoDB, com o intuito de facilitar a padronização nas criações de Collections com seus respectivos Schemas e Índices.

  

Os arquivos de migration e seeding gerados encontram-se dentro da pasta `./database/mongodb/migrations` e `./database/mongodb/seeders`, respectivamente.

  

### Comandos de Migrations e Seeders

  
  

-  `npm run mongo_make:migration <nome-da-migration>`

  

Cria uma nova migration com o nome passado por parâmetro. Esse parâmetro é obrigatório.

  

-  `npm run mongo_delete:migration <nome-da-migration | all>`

  

Apaga a migration com o nome passado por parâmetro. Caso queira apagar todas as migrations, deve-se passar o parâmetro `all`.

  

  

-  `npm run mongo_up`

  

Sobe todas as migrations para o banco de dados, configurando as collections com os parâmetros setados nos arquivos.

  

  

-  `npm run mongo_down`

  

Apaga todas as migrations no banco de dados.

  

  

-  `npm run mongo_make:seeder <nome-da-seeder>`

  

Cria uma nova seeder com o nome passado por parâmetro. Esse parâmetro é obrigatório.

  

  

-  `npm run mongo_delete:seeder <nome-da-migration | all>`

  

Apaga a seeder com o nome passado por parâmetro. Caso queira apagar todas as seeders, deve-se passar o parâmetro `all`.

  

  

-  `npm run mongo_seed`

  

Sobe todas as seeders no banco de dados.

  

### Build

  

Para dar build no projeto e gerar o diretório com os arquivos minificados, é necessário setar o atributo **APP_ENV** como **production** no arquivo `.env` e, em seguida, rodar o comando `npm run build`.

  

### Testes

  

Os arquivos de teste estão situados no diretório ***./test***. Para criar um novo teste, deve ser criado um arquivo configurado como `<nome-do-arquivo>.test.js`.

  

  

Os testes estão configurados usando o framework Mocha e a biblioteca de asserts Chai. Consulte a documentação oficial dos pacotes clicando [aqui](https://mochajs.org/#getting-started) e [aqui](https://www.chaijs.com/guide/).

  

  

Para rodar os testes já configurados, basta rodar o comando `npm test`.

  
  
  
  

### APIs disponíveis e estrutura de retorno

#### Endpoint do Gateway

  

`Method GET - http://191.232.190.105/v1`

  

A autenticaçao do Gateway é feita atraves de um **token** que deve ser informado no parametro **Authorization** do **header**

  
  

A estrutura de resposta padrão das APIs é a seguinte:

  

```

{

"status": {

"status_code": ,

"message": ""

},

"result": {

},

"query": {

"parameters": {

},

"url": "",

"method": "GET"

},

"request_id": "5efdf09eed88aa8064ee3dbe"

}

```

  

-  **status** : `objeto` - Objeto que retorna os atributos de status da resposta HTTP

-  **status_code**:`inteiro` - Código HTTP da resposta do servidor;

  

-  **message**: `string` - Mensagem de resposta do servidor;

  

-  **result** : `objeto` - Objeto que retorna os atributos encontrados na resposta da API

-  **query** : `objeto` - Objeto que retorna os atributos enviados por na requisição HTTP

-  **parameters**:`objeto` - Contém atributos enviados pelo cliente para a requisição na API

  

-  **request_id** : `string` - Contém um identificador único da requisição gerada no servidor

  
  

No **API Gateway** estão habilitadas as seguintes **APIs**:

  

Além do **Authorization** do **header** é nescessario informar a **API** a qual deseja fazer requisições, atraves do parametro de url **?api=<token_indentificacao_api>**

  

`Method GET - http://191.232.190.105/v1?api=<token_indentificacao_api>`

### API de Geolocalização

  

Este método realiza um *webcrawler* em sites de geolocalização, passando como parâmetros o nome da empresa, o país e a cidade onde está situada, e retornando na busca as informações de endereço, telefone e website.

  

#### Parâmetros de consulta

  

-  **empresa** : `obrigatório` - O nome da empresa que se pretende pesquisar;

  

-  **pais** : `obrigatório` - O código [ISO 3166-1 alfa-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements) (código de duas letras) do país onde a empresa reside;

  

-  **cidade** : `opcional` - O nome da cidade onde a empresa reside;

  

#### Endpoint

  

`Method GET - http://191.232.190.105/v1?api=<token_indentificacao_api>&empresa=<parametro-de-empresa>&pais=<parametro-de-pais>&cidade=<parametro-de-cidade>`

  

#### Estrutura de retorno

  

```

"result": {

	"nome_comercial": "itb360",

	"endereco": "Cubo Itaú - Alameda Vicente Pinzon, 54 - Vila Olímpia, São Paulo - SP, 04547-130, Brazil",

	"website": "itbroker.com.br",

	"telefone_online": "551139956300"

}

```

  

-  **result** : `objeto` - Objeto que retorna os atributos encontrados na resposta da API

-  **nome_comercial** : `string` - Nome encontrado na página web;

  

-  **telefone_online** : `string` - Telefone encontrado na página web;

  

-  **endereco** : `string` - Endereço encontrado na página web;

  

-  **website** : `string` - Website encontrado na página web;

  
  
  

### API de Contatos

  

Este método tem por objetivo fazer a captação de informações de contatos das empresas no site do LinkedIn.

  

#### Parâmetros de consulta

  

  

Você deve passar a chave composta de empresa e pais ou a informação de website.

  

-  **empresa** : `obrigatório` - O nome da empresa que se pretende pesquisar;

  

-  **pais** : `obrigatório` - O código [ISO 3166-1 alfa-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements) (código de duas letras) do país onde a empresa reside;

  

-  **website** : `opcional` - O websiteeonde da empresa;

  

  

#### Endpoint

  

`Method GET http://191.232.190.105/v1?api=<token_indentificacao_api>&empresa=<parametro-de-empresa>&pais=<parametro-de-pais>`

  

ou

  

`Method GET http://191.232.190.105/v1?api=<token_indentificacao_api>&website=<parametro-de-website>`

  

#### Estrutura de retorno da API de Contatos

  

```

"result": {
        "empresa": {
            "url_linkedin": "https://www.linkedin.com/company/intelligencetoolsforbusiness",
            "especializacoes": "Demand Generation, Market Research, Sales Consultancy, Business Intelligence, Marketing, Telemarketing, Digital Marketing, Sales Outsourcing, Business Consultancy, Sales Management, Sales Automation, Sales Processs, CRM, Database Development, Big Data Analytics, and B2B Marketing and Sales",
            "fundada_em": "2013",
            "logo": "https://media-exp1.licdn.com/dms/image/C4E0BAQHSVJ5x-gVeyg/company-logo_200_200/0?e=1601510400&v=beta&t=jChJCII-LQPRAyhBLkrGx1V59XwhStIlewbRpz47TKo",
            "nome_linkedin": "ITB",
            "sede": "São Paulo, São Paulo",
            "setor": "Information Technology & Services",
            "site": "http://www.itb360.com.br",
            "sobre": "\n    ITBroker was born as a qualified demand generation company for the IT industry.  Since the start, we prioritized specialized professionals.\n\nHowever, we still missed the supply of relevant and valid data of easy access for  better performance and efficiency, so we decided to develop our own tools. \n\nAs our tools presented exceedingly great results, we realized that they had the power to solve problems from various businesses and industries. \n\nTherefore, we launched to the market our Business Intelligence platform, ITB360, that is now the core of our services and solutions, with the purpose of boosting the growth of companies around the world. \n\nNow, as ITB, we intend to increase our visibility, market share and sales reach to elevate the company to its full potential and accomplish our mission.\n\n\n  ",
            "tamanho_empresa": "51-200 employees",
            "telefone": "(11) 3995-6300",
            "tipo": "Privately Held"
        },
        "contatos": [
            {
                "profile_url": "https://www.linkedin.com/in/andre-reiter-4a794521/",
                "cargo": "CHIEF EXECUTIVE OFFICER APEX INTERNATIONAL CO.",
                "nome": "ANDRE REITER"
            },
            {
                "profile_url": "https://www.linkedin.com/in/larissa-ierich-383940187/",
                "cargo": "LEAD DEVELOPMENT REPRESENTATIVE NA ITB | ESTUDANTE DE MARKETING",
                "nome": "LARISSA IERICH"
            },
            {
                "profile_url": "https://www.linkedin.com/in/diogo-coelho-428b27aa/",
                "cargo": "POS-GRADUACAO | PONTIFICIA UNIVERSIDADE CATOLICA DE MINAS GERAIS",
                "nome": "DIOGO COELHO"
            },
            {
                "profile_url": "https://www.linkedin.com/in/natanreiter/",
                "cargo": "CEO & FOUNDER AT ITB | BUSINESS MENTOR | BUSINESS TRANSFORMATION AND INNOVATION ENTHUSIAST",
                "nome": "NATAN REITER"
            },
            {
                "profile_url": "https://www.linkedin.com/in/cleiton-costa/",
                "cargo": "TEAM LEADER OF DATA SERVICES NA ITB",
                "nome": "CLEITON COSTA"
            },
            {
                "profile_url": "https://www.linkedin.com/in/marvinfiori/",
                "cargo": "CTO AND FOUNDER",
                "nome": "MARVIN N FIORI"
            },
            {
                "profile_url": "https://www.linkedin.com/in/franciellyfeijo/",
                "cargo": "HEAD OF GROWTH AT ITB",
                "nome": "FRANCIELLY FEIJO"
            },
            {
                "profile_url": "https://www.linkedin.com/in/lucas-david-andrade-a25604b9/",
                "cargo": "BUSINESS INTELLIGENCE ANALYST",
                "nome": "LUCAS DAVID ANDRADE"
            },
            {
                "profile_url": "https://www.linkedin.com/in/leticia-gaschi-555846181/",
                "cargo": "RECURSOS HUMANOS | ADMINISTRATIVO | FINANCEIRO | ITB",
                "nome": "LETICIA GASCHI"
            },
            {
                "profile_url": "https://www.linkedin.com/in/carla-gutierrez-rosas-896252162/",
                "cargo": "SALES DEVELOPMENT REPRESENTATIVE (SDR)",
                "nome": "CARLA GUTIERREZ ROSAS"
            },
            {
                "profile_url": "https://www.linkedin.com/in/diogo-coelho-1159aa170/",
                "cargo": "DESENVOLVEDOR NA ITBROKER",
                "nome": "DIOGO COELHO"
            },
            {
                "profile_url": "https://www.linkedin.com/in/henriquejesuslv/",
                "cargo": "ANALISTA DE INTELIGENCIA DE MERCADO | ITB",
                "nome": "HENRIQUE SILVA"
            },
            {
                "profile_url": "https://www.linkedin.com/in/ca%C3%ADque-ara%C3%BAjo-de-paula-404338a1/",
                "cargo": "ANALISTA DE INFORMACAO NA ITB",
                "nome": "CAIQUE ARAUJO DE PAULA"
            },
            {
                "profile_url": "https://www.linkedin.com/in/janaina-carvalho-lima-teodoro-68838771/",
                "cargo": "ANALISTA DE OPERACOES NA ITB",
                "nome": "JANAINA CARVALHO LIMA TEODORO"
            },
            {
                "profile_url": "https://www.linkedin.com/in/vin%C3%ADcius-mattos-della-agostini-87940533/",
                "cargo": "WEB DESIGNER I MARKETING I UX/UI DESIGNER",
                "nome": "VINICIUS MATTOS DELLA AGOSTINI"
            },
            {
                "profile_url": "https://www.linkedin.com/in/laura-adamo-172a2a163/",
                "cargo": "LEAD DEVELOPMENT REPRESENTATIVE NA ITBROKER",
                "nome": "LAURA ADAMO"
            },
            {
                "profile_url": "https://www.linkedin.com/in/ericaalanoca/",
                "cargo": "SALES BUSINESS DEVELOPMENT",
                "nome": "ERICA ALANOCA"
            },
            {
                "profile_url": "https://www.linkedin.com/in/hugo-azevedo-b3149664/",
                "cargo": "CUSTOMER SUCCESS EXECUTIVE AT ITB",
                "nome": "HUGO AZEVEDO"
            },
            {
                "profile_url": "https://www.linkedin.com/in/lucascperes/",
                "cargo": "SALES DEVELOPMENT REPRESENTATIVE NA ITB",
                "nome": "LUCAS PERES"
            },
            {
                "profile_url": "https://www.linkedin.com/in/bruno-feliciano-de-godoi-166a4390/",
                "cargo": "ANALISTA DE DESENVOLVIMENTO NA ITB",
                "nome": "BRUNO FELICIANO DE GODOI"
            },
            {
                "profile_url": "https://www.linkedin.com/in/rafael-gustavo-furlan-4a9aa44a/",
                "cargo": "SR. DATA SPECIALIST NA ITB",
                "nome": "RAFAEL GUSTAVO FURLAN"
            },
            {
                "profile_url": "https://www.linkedin.com/in/jordana-guerra-poli-233a1747/",
                "cargo": "BUSINESS COORDINATOR NA ITB",
                "nome": "JORDANA GUERRA POLI"
            },
            {
                "profile_url": "https://www.linkedin.com/in/ahnad-budiman-898215183/",
                "cargo": "OWNER AT ITBROKER BRASIL",
                "nome": "AHNAD BUDIMAN"
            },
            {
                "profile_url": "https://www.linkedin.com/in/fabio-piovenzano-220a8361/",
                "cargo": "LINUX CHAMPION NA ITBROKER BRASIL",
                "nome": "FABIO PIOVENZANO"
            },
            {
                "profile_url": "https://www.linkedin.com/in/camila-cardozo-38b295120/",
                "cargo": "ASSISTENTE ADMINISTRATIVO NA ITBROKER BRASIL",
                "nome": "CAMILA CARDOZO"
            },
            {
                "profile_url": "https://www.linkedin.com/in/marcelo-lucas-8b3568145/",
                "cargo": "REPRESENTANTE DE DESENVOLVIMENTO DE NEGOCIOS NA ITBROKER BRASIL",
                "nome": "MARCELO LUCAS"
            },
            {
                "profile_url": "https://www.linkedin.com/in/fernandamizzin/",
                "cargo": "CONTENT MARKETING MANAGER (LATAM) NA EVENTBRITE",
                "nome": "FERNANDA FERREIRA MIZZIN"
            },
            {
                "profile_url": "https://www.linkedin.com/in/andre-reiter/",
                "cargo": "EXECUTIVE DIRECTOR BUSINESS DEVELOPMENT",
                "nome": "ANDRE REITER"
            }
        ]
}

```

### API M2

Este método acessa a API SerpApi para realizar a captação de informações das empresas, como telefone, website e endereço, além de alguns e-mails disponibilizados pela API AnyLeads;

 

#### Parâmetros de consulta


-  **company** : `obrigatório` - O nome da empresa que se pretende pesquisar;
-  **country** : `obrigatório` - O código [ISO 3166-1 alfa-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements) (código de duas letras) do país onde a empresa reside; 
-  **city** : `opcional` - O nome da cidade onde a empresa reside;

 
#### Endpoint 

`Method GET - http://191.232.190.105/v1?api=<token_indentificacao_api>&company=<parametro-de-empresa>&country=<parametro-de-pais>&city=<parametro-de-cidade>` 

#### Estrutura de retorno

```
"result": {
        "data": {
            "company_name": "POSTO PETROBRAS",
            "address": "São Paulo - State of São Paulo, Brazil",
            "website": "http://www.petrobras.com.br/pt/"
        },
        "contacts": [
            {
                "email": "masetti@petrobras.com.br",
                "type": "generic"
            },
            {
                "email": "webmohr@petrobras.com.br",
                "type": "generic"
            },
            {
                "email": "liporace@petrobras.com.br",
                "type": "generic"
            },
            {
                "email": "carlosoest@petrobras.com.br",
                "type": "generic"
            },
            {
                "email": "andersongomes@petrobras.com.br",
                "type": "generic"
            },
            {
                "email": "solangelima@petrobras.com.br",
                "type": "generic"
            },
            {
                "email": "josericardorosa@petrobras.com.br",
                "type": "generic"
            },
            {
                "email": "lidinei@petrobras.com.br",
                "type": "generic"
            },
            {
                "email": "monicacustodio.brq@petrobras.com.br",
                "type": "generic"
            },
            {
                "email": "terabe@petrobras.com.br",
                "type": "generic"
            }
        ]
    }
```

-  **result** : `objeto` - Objeto que retorna os atributos encontrados na resposta da API 
- **data** : `objeto` - Objeto com os dados da empresa;
- **company_name** : `string` - Nome da empresa;
- **address** : `string` - Endereço da empresa;
- **telephone** : `string` - Telefone da empresa;
- **website** : `string` - Website da empresa;
- **contacts** : `array` - Array com os emails de contato;
- **email** : `string` - Endereço de e-mail;
- **type** : `string`- tipo do e-mail;