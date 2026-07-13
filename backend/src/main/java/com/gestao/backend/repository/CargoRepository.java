package com.gestao.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.gestao.backend.model.Cargo;

public interface CargoRepository extends JpaRepository<Cargo, Long> {

    boolean existsByCodigo(String codigo);

    boolean existsByCodigoAndIdNot(String codigo, Long id);

    Page<Cargo> findByCodigoContainingIgnoreCaseAndDescricaoContainingIgnoreCase(
            String codigo,
            String descricao,
            Pageable pageable
    );
}