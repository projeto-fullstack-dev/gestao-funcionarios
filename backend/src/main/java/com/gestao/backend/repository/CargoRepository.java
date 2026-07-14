package com.gestao.backend.repository;

import com.gestao.backend.model.Cargo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CargoRepository extends JpaRepository<Cargo, Long> {

  boolean existsByCodigo(String codigo);

  boolean existsByCodigoAndIdNot(String codigo, Long id);

  Page<Cargo> findByCodigoContainingIgnoreCaseAndDescricaoContainingIgnoreCase(
      String codigo, String descricao, Pageable pageable);
}
