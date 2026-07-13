package com.gestao.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestao.backend.model.Vinculo;

public interface VinculoRepository extends JpaRepository<Vinculo, Long> {

    boolean existsByMatricula(String matricula);

    boolean existsByMatriculaAndIdNot(String matricula, Long id);
}