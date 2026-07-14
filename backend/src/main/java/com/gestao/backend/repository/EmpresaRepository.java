package com.gestao.backend.repository;

import com.gestao.backend.model.Empresa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {

  boolean existsByCnpj(String cnpj);

  boolean existsByCnpjAndIdNot(String cnpj, Long id);

  Page<Empresa>
      findByNomeContainingIgnoreCaseAndRazaoSocialContainingIgnoreCaseAndCnpjContainingIgnoreCase(
          String nome, String razaoSocial, String cnpj, Pageable pageable);
}
