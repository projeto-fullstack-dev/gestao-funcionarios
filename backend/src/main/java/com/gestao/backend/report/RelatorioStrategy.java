package com.gestao.backend.report;

import java.util.List;
import java.util.Map;

public interface RelatorioStrategy {

  List<Map<String, Object>> gerar();
}
