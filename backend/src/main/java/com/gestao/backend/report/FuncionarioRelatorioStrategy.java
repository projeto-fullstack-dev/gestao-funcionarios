package com.gestao.backend.report;

import com.gestao.backend.repository.FuncionarioRepository;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class FuncionarioRelatorioStrategy implements RelatorioStrategy {
  private final FuncionarioRepository repository;

  public FuncionarioRelatorioStrategy(FuncionarioRepository repository) {
    this.repository = repository;
  }

  @Override
  public List<Map<String, Object>> gerar() {
    List<Map<String, Object>> dados = new ArrayList<>();
    repository
        .findAll()
        .forEach(
            funcionario ->
                funcionario
                    .getVinculos()
                    .forEach(
                        vinculo -> {
                          Map<String, Object> linha = new LinkedHashMap<>();
                          linha.put("funcionarioId", funcionario.getId());
                          linha.put("nome", funcionario.getNome());
                          linha.put("cpf", funcionario.getCpf());
                          linha.put("empresa", vinculo.getEmpresa().getNome());
                          linha.put("cnpj", vinculo.getEmpresa().getCnpj());
                          linha.put("matricula", vinculo.getMatricula());
                          linha.put("ativo", vinculo.isAtivo());
                          linha.put(
                              "cargo",
                              vinculo.getCargo() == null ? "" : vinculo.getCargo().getDescricao());
                          linha.put(
                              "departamento",
                              vinculo.getDepartamento() == null
                                  ? ""
                                  : vinculo.getDepartamento().getDescricao());
                          dados.add(linha);
                        }));
    return dados;
  }
}
