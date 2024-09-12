# 💸 Projeto Minhas Finanças - Frontend (minhas-financas-app) 

## 📝 Descrição

O projeto Minhas Finanças é uma aplicação desenvolvida com React JS que oferece uma interface amigável e intuitiva para gerenciar suas finanças pessoais. Este front-end interage com a Minhas Finanças API para permitir o controle detalhado de ganhos e gastos, proporcionando uma experiência fluida e dinâmica para o usuário.

🌐 [Projeto Backend](https://dev.azure.com/muralisti/Programa%20de%20Est%C3%A1gio%20da%20Muralis/_git/pem-paulo-henrique-front?path=%2F&version=GBdevelop&_a=contents)

## 🚀 Tecnologias Utilizadas

- React 16.10.1
- Axios 0.19.0
- Bootswatch 4.3.1
- Jsonwebtoken 9.0.2
- Primeicons 7.0.0
- Primereact 10.8.2
- Toastr 2.1.4
- Node.js 10.24.1

## 📄 Pré-requisitos

- Node.js 10.24.1

## 🔧 Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://muralisti@dev.azure.com/muralisti/Programa%20de%20Est%C3%A1gio%20da%20Muralis/_git/pem-paulo-henrique-front
   ```

2. **Navegue até o diretório do projeto:**

   ```bash
   cd diretorio-do-projeto
   ```

3. **Instale as dependências:**

   Com npm:
   ```bash
   npm install
   ```

   Com yarn:
   ```bash
   yarn install
   ```

4. **Configure as variáveis de ambiente:**

   Crie um arquivo `.env` na raiz do projeto e adicione as configurações necessárias, como a URL do backend:

   ```
   REACT_APP_API_URL=http://localhost:8080
   ```

5. **Inicie o projeto:**

   Com npm:
   ```bash
   npm start
   ```

   Com yarn:
   ```bash
   yarn start
   ```

   O aplicativo estará disponível em `http://localhost:3000`.

## 🗃️ Estrutura do Projeto
```
my-app/
├── package.json
├── README.md
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
└── src/
    ├── custom.css
    ├── index.js
    ├── app/
    │   ├── apiservice.js
    │   └── service/
    │       ├── authService.js
    │       ├── lancamentoService.js
    │       ├── localstorageService.js
    │       └── usuarioService.js
    │   └── service/exception/
    │       └── ErroValidacao.js
    ├── components/
    │   ├── card.js
    │   ├── form-group.js
    │   ├── navbar.js
    │   ├── navbarItem.js
    │   ├── selectMenu.js
    │   └── toastr.js
    ├── main/
    │   ├── App.js
    │   ├── provedorAutenticacao.js
    │   └── rotas.js
    └── views/
        ├── cadastroUsuario.js
        ├── home.js
        ├── landingPage.js
        ├── login.js
        └── lancamentos/
            ├── cadastro-lancamentos.js
            ├── consulta-lancamentos.js
            └── lancamentosTable.js
```

## `public/`
- **Propósito**: Contém arquivos estáticos que são servidos diretamente pelo servidor. Esses arquivos não são processados pelo Webpack e incluem o HTML principal e recursos como ícones e manifestos.

## `src/`
- **Propósito**: Contém o código-fonte da aplicação React. Aqui você encontrará todos os arquivos relacionados ao desenvolvimento da aplicação, incluindo componentes, estilos e lógica de negócios.

  ### `app/`
  - **Propósito**: Contém serviços e lógica para interagir com APIs e gerenciar dados da aplicação. Esta pasta inclui arquivos que lidam com a comunicação com o back-end e a manipulação de dados.

    #### `service/`
    - **Propósito**: Subpasta dentro de `app/` dedicada a diferentes serviços que encapsulam a lógica de negócios e a comunicação com APIs.

    #### `service/exception/`
    - **Propósito**: Subpasta dentro de `service/` para tratar erros e validações específicas da aplicação.

  ### `components/`
  - **Propósito**: Contém componentes reutilizáveis da interface do usuário. Estes são pequenos blocos de construção que podem ser usados em várias partes da aplicação, como botões, formulários e barras de navegação.

  ### `main/`
  - **Propósito**: Contém arquivos principais que configuram e definem a estrutura básica da aplicação. Isso inclui o componente principal da aplicação e arquivos de configuração para autenticação e rotas.

  ### `views/`
  - **Propósito**: Contém páginas ou vistas da aplicação que representam diferentes seções da interface do usuário. Cada vista pode ser uma página completa ou uma parte significativa da interface, como formulários de login ou páginas de perfil.

    #### `lancamentos/`
    - **Propósito**: Subpasta dentro de `views/` dedicada a páginas e componentes específicos para a gestão de lançamentos financeiros.