CREATE TABLE cargo (
    id BIGINT NOT NULL AUTO_INCREMENT,
    codigo VARCHAR(255) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    CONSTRAINT pk_cargo PRIMARY KEY (id),
    CONSTRAINT uk_cargo_codigo UNIQUE (codigo)
);

CREATE TABLE departamento (
    id BIGINT NOT NULL AUTO_INCREMENT,
    codigo VARCHAR(255) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    CONSTRAINT pk_departamento PRIMARY KEY (id),
    CONSTRAINT uk_departamento_codigo UNIQUE (codigo)
);

CREATE TABLE funcionario (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(255) NOT NULL,
    CONSTRAINT pk_funcionario PRIMARY KEY (id),
    CONSTRAINT uk_funcionario_cpf UNIQUE (cpf)
);

CREATE TABLE vinculo (
    id BIGINT NOT NULL AUTO_INCREMENT,
    empresa VARCHAR(255) NOT NULL,
    matricula VARCHAR(255) NOT NULL,
    funcionario_id BIGINT NOT NULL,
    cargo_id BIGINT NOT NULL,
    departamento_id BIGINT NOT NULL,
    CONSTRAINT pk_vinculo PRIMARY KEY (id),
    CONSTRAINT uk_vinculo_matricula UNIQUE (matricula),
    CONSTRAINT fk_vinculo_funcionario FOREIGN KEY (funcionario_id) REFERENCES funcionario (id),
    CONSTRAINT fk_vinculo_cargo FOREIGN KEY (cargo_id) REFERENCES cargo (id),
    CONSTRAINT fk_vinculo_departamento FOREIGN KEY (departamento_id) REFERENCES departamento (id)
);

CREATE INDEX idx_vinculo_funcionario ON vinculo (funcionario_id);
CREATE INDEX idx_vinculo_cargo ON vinculo (cargo_id);
CREATE INDEX idx_vinculo_departamento ON vinculo (departamento_id);
