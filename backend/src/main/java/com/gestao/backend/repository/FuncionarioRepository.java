package com.gestao.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.gestao.backend.model.Funcionario;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    boolean existsByCpf(String cpf);

    boolean existsByCpfAndIdNot(String cpf, Long id);

    @Query("""
        SELECT DISTINCT f FROM Funcionario f
        LEFT JOIN f.vinculos v
        LEFT JOIN v.cargo c
        LEFT JOIN v.departamento d
        WHERE
            (:nome IS NULL OR LOWER(f.nome) LIKE LOWER(CONCAT('%', :nome, '%')))
            AND (:cpf IS NULL OR LOWER(f.cpf) LIKE LOWER(CONCAT('%', :cpf, '%')))
            AND (:matricula IS NULL OR LOWER(v.matricula) LIKE LOWER(CONCAT('%', :matricula, '%')))
            AND (:empresa IS NULL OR LOWER(v.empresa) LIKE LOWER(CONCAT('%', :empresa, '%')))
            AND (:cargo IS NULL OR LOWER(c.descricao) LIKE LOWER(CONCAT('%', :cargo, '%')) OR LOWER(c.codigo) LIKE LOWER(CONCAT('%', :cargo, '%')))
            AND (:departamento IS NULL OR LOWER(d.descricao) LIKE LOWER(CONCAT('%', :departamento, '%')) OR LOWER(d.codigo) LIKE LOWER(CONCAT('%', :departamento, '%')))
    """)
    Page<Funcionario> filtrar(
            String nome,
            String cpf,
            String matricula,
            String empresa,
            String cargo,
            String departamento,
            Pageable pageable
    );
}