package com.gestao.backend.service;

import com.gestao.backend.report.*;
import org.springframework.stereotype.Service;

@Service
public class RelatorioService {
  private final CargoRelatorioStrategy cargoStrategy;
  private final DepartamentoRelatorioStrategy departamentoStrategy;
  private final EmpresaRelatorioStrategy empresaStrategy;
  private final FuncionarioRelatorioStrategy funcionarioStrategy;

  public RelatorioService(
      CargoRelatorioStrategy cargoStrategy,
      DepartamentoRelatorioStrategy departamentoStrategy,
      EmpresaRelatorioStrategy empresaStrategy,
      FuncionarioRelatorioStrategy funcionarioStrategy) {
    this.cargoStrategy = cargoStrategy;
    this.departamentoStrategy = departamentoStrategy;
    this.empresaStrategy = empresaStrategy;
    this.funcionarioStrategy = funcionarioStrategy;
  }

  public RelatorioResponse gerar(TelaRelatorio tela) {
    RelatorioStrategy strategy =
        switch (tela) {
          case CARGOS -> cargoStrategy;
          case DEPARTAMENTOS -> departamentoStrategy;
          case EMPRESAS -> empresaStrategy;
          case FUNCIONARIOS -> funcionarioStrategy;
        };
    return new RelatorioResponse(tela, strategy.gerar());
  }
}
