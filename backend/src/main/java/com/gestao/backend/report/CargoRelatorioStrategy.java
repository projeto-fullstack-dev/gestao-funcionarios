package com.gestao.backend.report;

import com.gestao.backend.repository.CargoRepository;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class CargoRelatorioStrategy implements RelatorioStrategy {
  private final CargoRepository repository;

  public CargoRelatorioStrategy(CargoRepository repository) {
    this.repository = repository;
  }

  @Override
  public List<Map<String, Object>> gerar() {
    return repository.findAll().stream()
        .map(
            cargo ->
                Map.<String, Object>of(
                    "id",
                    cargo.getId(),
                    "codigo",
                    cargo.getCodigo(),
                    "descricao",
                    cargo.getDescricao()))
        .toList();
  }
}
