package com.gestao.backend.report;

import com.gestao.backend.repository.EmpresaRepository;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class EmpresaRelatorioStrategy implements RelatorioStrategy {
  private final EmpresaRepository repository;

  public EmpresaRelatorioStrategy(EmpresaRepository repository) {
    this.repository = repository;
  }

  @Override
  public List<Map<String, Object>> gerar() {
    return repository.findAll().stream()
        .map(
            empresa ->
                Map.<String, Object>of(
                    "id",
                    empresa.getId(),
                    "nome",
                    empresa.getNome(),
                    "razaoSocial",
                    empresa.getRazaoSocial(),
                    "cnpj",
                    empresa.getCnpj()))
        .toList();
  }
}
