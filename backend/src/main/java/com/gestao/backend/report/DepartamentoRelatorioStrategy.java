package com.gestao.backend.report;

import com.gestao.backend.repository.DepartamentoRepository;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class DepartamentoRelatorioStrategy implements RelatorioStrategy {
  private final DepartamentoRepository repository;

  public DepartamentoRelatorioStrategy(DepartamentoRepository repository) {
    this.repository = repository;
  }

  @Override
  public List<Map<String, Object>> gerar() {
    return repository.findAll().stream()
        .map(
            departamento ->
                Map.<String, Object>of(
                    "id",
                    departamento.getId(),
                    "codigo",
                    departamento.getCodigo(),
                    "descricao",
                    departamento.getDescricao()))
        .toList();
  }
}
