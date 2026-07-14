package com.gestao.backend.report;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.Map;

@Schema(description = "Dados estruturados utilizados pelo frontend para gerar o PDF")
public record RelatorioResponse(TelaRelatorio tela, List<Map<String, Object>> dados) {}
