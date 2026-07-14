# Gestão de Funcionários

Sistema para organizar funcionários e seus vínculos com empresas.

Além dos funcionários, o sistema mantém os cadastros de empresas, cargos e departamentos. Esses dados são usados na criação dos vínculos: cada vínculo relaciona uma matrícula a uma empresa, um cargo e um departamento.

O projeto tem um backend em Spring Boot, um frontend em React e usa MySQL. O ambiente completo pode ser iniciado com Docker Compose.

## Rodando o projeto

Você precisa ter o Docker Desktop aberto. Na raiz do projeto, execute:

```bash
docker compose up -d --build
```

Na primeira execução pode demorar um pouco, pois as imagens e dependências serão baixadas. Para acompanhar a inicialização:

```bash
docker compose logs -f
```

Quando os três serviços estiverem saudáveis, acesse:

- Aplicação: http://localhost:5173
- Swagger: http://localhost:8080/swagger-ui.html

O acesso inicial é:

```text
Usuário: login
Senha: pass
```

Para verificar os containers:

```bash
docker compose ps
```

Para encerrar o ambiente:

```bash
docker compose down
```

Os dados do MySQL ficam salvos em um volume. Caso queira apagar o banco e começar do zero, use `docker compose down -v`.

## O que existe no sistema

O frontend possui telas para:

- entrar e sair do sistema;
- listar, filtrar, cadastrar, editar e excluir funcionários;
- cadastrar empresas, cargos e departamentos;
- adicionar um ou mais vínculos a cada funcionário;
- validar CPF e CNPJ, incluindo máscara e dígitos verificadores;
- visualizar erros diretamente nas listagens e formulários;
- utilizar o sistema em telas desktop e mobile.

As rotas da API são protegidas por JWT. Depois do login, o frontend inclui o token automaticamente nas requisições e encerra a sessão quando ele expira ou deixa de ser válido.

## Usando o Swagger

O Swagger está em http://localhost:8080/swagger-ui.html.

Para chamar os endpoints protegidos:

1. Abra `POST /api/auth/login`.
2. Use `login` e `pass` no corpo da requisição.
3. Copie o campo `token` da resposta.
4. Clique em **Authorize** e cole o token.

A especificação OpenAPI em JSON está disponível em http://localhost:8080/api-docs.

## Rodando o frontend fora do Docker

Com o backend e o MySQL ativos:

```bash
cd frontend
npm ci
npm run dev
```

Outros comandos úteis:

```bash
npm run lint
npm run build
```

## Testes com Cypress

Os testes E2E cobrem login, sessão, validações, erros de listagem, responsividade e o cadastro de empresas.

Com a aplicação e a API em execução, entre na pasta do frontend:

```bash
cd frontend
```

Para abrir o Cypress e acompanhar os testes no navegador:

```bash
npm run test:e2e:open
```

Escolha **E2E Testing**, selecione um navegador e clique no cenário que deseja executar.

Para executar todos os testes sem abrir a interface:

```bash
npm run test:e2e
```

## Testes do backend

No Windows:

```powershell
cd backend
.\mvnw.cmd verify
```

O relatório de cobertura é gerado em `backend/target/site/jacoco/index.html`.

## Configuração

Os valores usados pelo Docker estão no arquivo `.env.example`. Se precisar trocar banco, senha, duração do token ou endereço da API, copie esse arquivo para `.env` e ajuste os valores.

As principais tecnologias usadas são:

- Java 21 e Spring Boot;
- Spring Security e JWT;
- Spring Data JPA, Flyway e MySQL;
- React, Redux Toolkit e React Hook Form;
- Cypress, JUnit e JaCoCo;
- Docker e Docker Compose.
