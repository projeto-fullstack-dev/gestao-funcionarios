package com.gestao.backend.repository;

import com.gestao.backend.model.Departamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartamentoRepository extends JpaRepository<Departamento, Long> {

  boolean existsByCodigo(String codigo);

  boolean existsByCodigoAndIdNot(String codigo, Long id);

  Page<Departamento> findByCodigoContainingIgnoreCaseAndDescricaoContainingIgnoreCase(
      String codigo, String descricao, Pageable pageable);
}
