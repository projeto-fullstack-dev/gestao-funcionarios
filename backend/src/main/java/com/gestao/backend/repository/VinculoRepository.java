package com.gestao.backend.repository;

import com.gestao.backend.model.Vinculo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VinculoRepository extends JpaRepository<Vinculo, Long> {

  boolean existsByMatricula(String matricula);

  boolean existsByMatriculaAndIdNot(String matricula, Long id);

  boolean existsByEmpresaId(Long empresaId);

  boolean existsByCargoId(Long cargoId);

  boolean existsByDepartamentoId(Long departamentoId);
}
