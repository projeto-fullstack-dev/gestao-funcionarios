package com.gestao.backend.report;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.gestao.backend.controller.RelatorioController;
import com.gestao.backend.model.*;
import com.gestao.backend.repository.*;
import com.gestao.backend.service.RelatorioService;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

class RelatorioTest {

  @Test
  void selecionaTodasAsStrategiesPeloEnum() {
    var cargos = mock(CargoRelatorioStrategy.class);
    var departamentos = mock(DepartamentoRelatorioStrategy.class);
    var empresas = mock(EmpresaRelatorioStrategy.class);
    var funcionarios = mock(FuncionarioRelatorioStrategy.class);
    var service = new RelatorioService(cargos, departamentos, empresas, funcionarios);

    when(cargos.gerar()).thenReturn(List.of(Map.of("tipo", "cargo")));
    when(departamentos.gerar()).thenReturn(List.of(Map.of("tipo", "departamento")));
    when(empresas.gerar()).thenReturn(List.of(Map.of("tipo", "empresa")));
    when(funcionarios.gerar()).thenReturn(List.of(Map.of("tipo", "funcionario")));

    assertEquals("cargo", service.gerar(TelaRelatorio.CARGOS).dados().get(0).get("tipo"));
    assertEquals(
        "departamento", service.gerar(TelaRelatorio.DEPARTAMENTOS).dados().get(0).get("tipo"));
    assertEquals("empresa", service.gerar(TelaRelatorio.EMPRESAS).dados().get(0).get("tipo"));
    assertEquals(
        "funcionario", service.gerar(TelaRelatorio.FUNCIONARIOS).dados().get(0).get("tipo"));
  }

  @Test
  void controllerRetornaRespostaDoService() {
    var service = mock(RelatorioService.class);
    var response = new RelatorioResponse(TelaRelatorio.CARGOS, List.of());
    when(service.gerar(TelaRelatorio.CARGOS)).thenReturn(response);
    var entity = new RelatorioController(service).gerar(TelaRelatorio.CARGOS);
    assertEquals(200, entity.getStatusCode().value());
    assertSame(response, entity.getBody());
  }

  @Test
  void strategiesMapeiamDadosDasTelas() {
    var cargoRepository = mock(CargoRepository.class);
    var departamentoRepository = mock(DepartamentoRepository.class);
    var empresaRepository = mock(EmpresaRepository.class);
    var funcionarioRepository = mock(FuncionarioRepository.class);

    var cargo = new Cargo();
    ReflectionTestUtils.setField(cargo, "id", 1L);
    cargo.setCodigo("DEV");
    cargo.setDescricao("Desenvolvedor");
    var departamento = new Departamento();
    ReflectionTestUtils.setField(departamento, "id", 2L);
    departamento.setCodigo("TI");
    departamento.setDescricao("Tecnologia");
    var empresa = new Empresa();
    ReflectionTestUtils.setField(empresa, "id", 3L);
    empresa.setNome("ACME");
    empresa.setRazaoSocial("ACME Ltda.");
    empresa.setCnpj("12.345.678/0001-90");
    var vinculo = new Vinculo();
    vinculo.setEmpresa(empresa);
    vinculo.setMatricula("M1");
    vinculo.setCargo(cargo);
    vinculo.setDepartamento(departamento);
    var funcionario = new Funcionario();
    ReflectionTestUtils.setField(funcionario, "id", 4L);
    funcionario.setNome("Ana");
    funcionario.setCpf("123.456.789-00");
    funcionario.setVinculos(List.of(vinculo));

    when(cargoRepository.findAll()).thenReturn(List.of(cargo));
    when(departamentoRepository.findAll()).thenReturn(List.of(departamento));
    when(empresaRepository.findAll()).thenReturn(List.of(empresa));
    when(funcionarioRepository.findAll()).thenReturn(List.of(funcionario));

    assertEquals("DEV", new CargoRelatorioStrategy(cargoRepository).gerar().get(0).get("codigo"));
    assertEquals(
        "TI",
        new DepartamentoRelatorioStrategy(departamentoRepository).gerar().get(0).get("codigo"));
    assertEquals(
        "ACME", new EmpresaRelatorioStrategy(empresaRepository).gerar().get(0).get("nome"));
    var linha = new FuncionarioRelatorioStrategy(funcionarioRepository).gerar().get(0);
    assertEquals("Ana", linha.get("nome"));
    assertEquals(true, linha.get("ativo"));
    assertEquals("Tecnologia", linha.get("departamento"));
  }
}
