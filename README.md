# Sistema de Gestão de Funcionários

Sistema web para gerenciamento de funcionários, cargos, departamentos e vínculos empresariais.

O projeto foi desenvolvido como desafio técnico Full Stack, contemplando backend, frontend, banco de dados, validações, filtros, paginação, relatórios, documentação da API e execução via Docker.

---

## Tecnologias utilizadas

### Backend

- Java 21
- Spring Boot
- Spring Web
- Spring Data JPA
- Bean Validation
- H2 Database
- Swagger/OpenAPI
- Maven

### Frontend

- React
- Vite
- JavaScript
- Axios
- React Router DOM
- Lucide React
- CSS

### Execução

- Docker
- Docker Compose

---

## Funcionalidades

### Funcionários

- Cadastro de funcionários
- Edição de funcionários
- Exclusão de funcionários
- Listagem com paginação
- Filtros por nome, CPF, matrícula, empresa, cargo e departamento
- Cadastro de vínculos empresariais
- Relatório CSV

### Vínculos empresariais

Cada funcionário pode possuir um ou mais vínculos.

Cada vínculo possui:

- Empresa
- Matrícula
- Cargo
- Departamento

### Cargos

- Cadastro de cargos
- Edição de cargos
- Exclusão de cargos
- Listagem com paginação
- Filtros por descrição e código
- Relatório CSV

### Departamentos

- Cadastro de departamentos
- Edição de departamentos
- Exclusão de departamentos
- Listagem com paginação
- Filtros por descrição e código
- Relatório CSV

---

## Regras de negócio

- CPF de funcionário não pode ser duplicado.
- CPF deve seguir o formato `000.000.000-00`.
- Código de cargo não pode ser duplicado.
- Código de departamento não pode ser duplicado.
- Um funcionário precisa possuir pelo menos um vínculo empresarial.
- Cada vínculo precisa possuir empresa, matrícula, cargo e departamento.
- Matrícula de vínculo não pode ser duplicada.
- Cargo e departamento precisam estar previamente cadastrados para serem utilizados em um vínculo.

---

## Estrutura do projeto

```txt
gestao-funcionarios/
│
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   └── src/
│       ├── main/
│       │   ├── java/com/gestao/backend/
│       │   │   ├── config/
│       │   │   ├── controller/
│       │   │   ├── exception/
│       │   │   ├── model/
│       │   │   ├── repository/
│       │   │   └── service/
│       │   │
│       │   └── resources/
│       │       └── application.properties
│       │
│       └── test/
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
│
├── docker-compose.yml
└── README.md