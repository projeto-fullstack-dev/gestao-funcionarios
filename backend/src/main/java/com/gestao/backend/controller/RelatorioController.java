package com.gestao.backend.controller;

import com.gestao.backend.report.RelatorioResponse;
import com.gestao.backend.report.TelaRelatorio;
import com.gestao.backend.service.RelatorioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/relatorios")
@Tag(name = "Relatórios", description = "Dados estruturados para geração de PDF no frontend")
public class RelatorioController {
  private final RelatorioService relatorioService;

  public RelatorioController(RelatorioService relatorioService) {
    this.relatorioService = relatorioService;
  }

  @GetMapping("/{tela}")
  @Operation(
      summary = "Gerar dados de relatório",
      description = "Selecione a tela CARGOS, DEPARTAMENTOS, EMPRESAS ou FUNCIONARIOS.")
  @ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "Dados do relatório",
        content = @Content(schema = @Schema(implementation = RelatorioResponse.class))),
    @ApiResponse(responseCode = "400", description = "Tela inválida", content = @Content),
    @ApiResponse(
        responseCode = "401",
        description = "Token JWT ausente ou inválido",
        content = @Content)
  })
  public ResponseEntity<RelatorioResponse> gerar(@PathVariable TelaRelatorio tela) {
    return ResponseEntity.ok(relatorioService.gerar(tela));
  }
}
