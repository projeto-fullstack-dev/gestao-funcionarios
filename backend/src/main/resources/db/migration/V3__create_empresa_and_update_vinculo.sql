CREATE TABLE empresa (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    razao_social VARCHAR(255) NOT NULL,
    cnpj VARCHAR(255) NOT NULL,
    CONSTRAINT pk_empresa PRIMARY KEY (id),
    CONSTRAINT uk_empresa_cnpj UNIQUE (cnpj)
);

INSERT INTO empresa (nome, razao_social, cnpj)
SELECT legado.empresa, legado.empresa,
       CONCAT('LEGADO-', LPAD(ROW_NUMBER() OVER (ORDER BY legado.empresa), 14, '0'))
FROM (SELECT DISTINCT empresa FROM vinculo) legado;

ALTER TABLE vinculo
    ADD COLUMN empresa_id BIGINT NULL,
    ADD COLUMN ativo BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE vinculo v
JOIN empresa e ON e.nome = v.empresa
SET v.empresa_id = e.id;

ALTER TABLE vinculo
    MODIFY empresa_id BIGINT NOT NULL,
    ADD CONSTRAINT fk_vinculo_empresa FOREIGN KEY (empresa_id) REFERENCES empresa (id),
    ADD INDEX idx_vinculo_empresa (empresa_id),
    DROP COLUMN empresa;

UPDATE vinculo v
JOIN (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY funcionario_id, empresa_id ORDER BY id DESC) AS ordem
    FROM vinculo
) duplicados ON duplicados.id = v.id
SET v.ativo = FALSE
WHERE duplicados.ordem > 1;

ALTER TABLE vinculo
    ADD COLUMN empresa_ativa_id BIGINT
        GENERATED ALWAYS AS (CASE WHEN ativo THEN empresa_id ELSE NULL END) STORED,
    ADD CONSTRAINT uk_vinculo_ativo_empresa
        UNIQUE (funcionario_id, empresa_ativa_id);
