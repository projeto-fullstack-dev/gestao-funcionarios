package com.gestao.backend.report;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Tela que originou a solicitação do relatório")
public enum TelaRelatorio {
  CARGOS,
  DEPARTAMENTOS,
  EMPRESAS,
  FUNCIONARIOS
}
