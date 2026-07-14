DELETE FROM vinculo
WHERE cargo_id IS NULL OR departamento_id IS NULL;

DELETE FROM funcionario
WHERE NOT EXISTS (
    SELECT 1 FROM vinculo WHERE vinculo.funcionario_id = funcionario.id
);

ALTER TABLE vinculo
    MODIFY cargo_id BIGINT NOT NULL,
    MODIFY departamento_id BIGINT NOT NULL;
