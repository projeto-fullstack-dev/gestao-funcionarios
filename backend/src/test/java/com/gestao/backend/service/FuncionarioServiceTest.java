package com.gestao.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.gestao.backend.model.*;
import com.gestao.backend.repository.*;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.util.ReflectionTestUtils;

class FuncionarioServiceTest {
  private FuncionarioRepository funcionarios;
  private CargoRepository cargos;
  private DepartamentoRepository departamentos;
  private EmpresaRepository empresas;
  private VinculoRepository vinculos;
  private FuncionarioService service;

  @BeforeEach
  void setUp() {
    funcionarios = mock(FuncionarioRepository.class);
    cargos = mock(CargoRepository.class);
    departamentos = mock(DepartamentoRepository.class);
    empresas = mock(EmpresaRepository.class);
    vinculos = mock(VinculoRepository.class);
    service = new FuncionarioService(funcionarios, cargos, departamentos, empresas, vinculos);
  }

  private Funcionario valido() {
    var c = new Cargo();
    ReflectionTestUtils.setField(c, "id", 1L);
    c.setDescricao("Dev");
    var d = new Departamento();
    ReflectionTestUtils.setField(d, "id", 2L);
    d.setDescricao("TI");
    var v = new Vinculo();
    var e = new Empresa();
    ReflectionTestUtils.setField(e, "id", 3L);
    e.setNome("ACME");
    e.setRazaoSocial("ACME Ltda.");
    e.setCnpj("12.345.678/0001-90");
    v.setEmpresa(e);
    v.setMatricula("1001");
    v.setCargo(c);
    v.setDepartamento(d);
    var f = new Funcionario();
    f.setNome("Ana");
    f.setCpf("123.456.789-00");
    f.setVinculos(new java.util.ArrayList<>(List.of(v)));
    when(cargos.findById(1L)).thenReturn(Optional.of(c));
    when(departamentos.findById(2L)).thenReturn(Optional.of(d));
    when(empresas.findById(3L)).thenReturn(Optional.of(e));
    return f;
  }

  @Test
  void listaLimpandoFiltrosVazios() {
    var p = PageRequest.of(0, 10);
    service.listar(null, " ", "M", "E", "C", "D", p);
    verify(funcionarios).filtrar(null, null, "M", "E", "C", "D", p);
  }

  @Test
  void criaEAssociaVinculo() {
    var f = valido();
    when(funcionarios.save(f)).thenReturn(f);
    assertSame(f, service.criar(f));
    assertSame(f, f.getVinculos().get(0).getFuncionario());
  }

  @Test
  void rejeitaCpfInvalido() {
    var f = valido();
    f.setCpf("123");
    assertThrows(RuntimeException.class, () -> service.criar(f));
    f.setCpf(null);
    assertThrows(RuntimeException.class, () -> service.criar(f));
  }

  @Test
  void rejeitaCpfDuplicado() {
    var f = valido();
    when(funcionarios.existsByCpf(f.getCpf())).thenReturn(true);
    assertThrows(RuntimeException.class, () -> service.criar(f));
  }

  @Test
  void buscaEExclui() {
    var f = valido();
    when(funcionarios.findById(1L)).thenReturn(Optional.of(f));
    assertSame(f, service.buscarPorId(1L));
    service.excluir(1L);
    verify(funcionarios).delete(f);
  }

  @Test
  void rejeitaFuncionarioInexistente() {
    when(funcionarios.findById(1L)).thenReturn(Optional.empty());
    assertThrows(RuntimeException.class, () -> service.buscarPorId(1L));
  }

  @Test
  void editaFuncionarioEVinculos() {
    var atual = valido();
    atual.setVinculos(new java.util.ArrayList<>(List.of(atual.getVinculos().get(0))));
    var dados = valido();
    dados.setNome("Bea");
    dados.setCpf("987.654.321-00");
    when(funcionarios.findById(1L)).thenReturn(Optional.of(atual));
    when(funcionarios.save(atual)).thenReturn(atual);
    var salvo = service.editar(1L, dados);
    assertSame(atual, salvo);
    assertEquals("Bea", salvo.getNome());
    assertEquals("987.654.321-00", salvo.getCpf());
    assertSame(salvo, salvo.getVinculos().get(0).getFuncionario());
  }

  @Test
  void rejeitaCpfDuplicadoNaEdicao() {
    var atual = valido();
    var dados = valido();
    when(funcionarios.findById(1L)).thenReturn(Optional.of(atual));
    when(funcionarios.existsByCpfAndIdNot(dados.getCpf(), 1L)).thenReturn(true);
    assertThrows(RuntimeException.class, () -> service.editar(1L, dados));
  }

  @Test
  void validaAusenciaDeVinculos() {
    var f = valido();
    f.setVinculos(null);
    assertThrows(RuntimeException.class, () -> service.criar(f));
    f.setVinculos(List.of());
    assertThrows(RuntimeException.class, () -> service.criar(f));
  }

  @Test
  void validaCamposEReferenciasDoVinculo() {
    assertVinculoInvalido(v -> v.setEmpresa(null));
    assertVinculoInvalido(v -> v.setEmpresa(new Empresa()));
    assertVinculoInvalido(v -> v.setMatricula(null));
    assertVinculoInvalido(v -> v.setMatricula(" "));
    var duplicado = valido();
    when(vinculos.existsByMatricula("1001")).thenReturn(true);
    assertThrows(RuntimeException.class, () -> service.criar(duplicado));
    var f = valido();
    f.getVinculos().get(0).setId(9L);
    when(vinculos.existsByMatriculaAndIdNot("1001", 9L)).thenReturn(true);
    var comId = f;
    assertThrows(RuntimeException.class, () -> service.criar(comId));
    assertVinculoInvalido(
        v -> {
          var c = new Cargo();
          v.setCargo(c);
        });
    assertVinculoInvalido(
        v -> {
          var d = new Departamento();
          v.setDepartamento(d);
        });
    reset(vinculos);
    f = valido();
    when(cargos.findById(1L)).thenReturn(Optional.empty());
    var cargoAusente = f;
    assertThrows(RuntimeException.class, () -> service.criar(cargoAusente));
    f = valido();
    when(departamentos.findById(2L)).thenReturn(Optional.empty());
    var depAusente = f;
    assertThrows(RuntimeException.class, () -> service.criar(depAusente));

    f = valido();
    var primeiro = f.getVinculos().get(0);
    var segundo = new Vinculo();
    segundo.setEmpresa(primeiro.getEmpresa());
    segundo.setMatricula("1002");
    segundo.setCargo(primeiro.getCargo());
    segundo.setDepartamento(primeiro.getDepartamento());
    f.getVinculos().add(segundo);
    var vinculoAtivoDuplicado = f;
    assertThrows(RuntimeException.class, () -> service.criar(vinculoAtivoDuplicado));

    segundo.setAtivo(false);
    assertDoesNotThrow(() -> service.criar(vinculoAtivoDuplicado));
  }

  @Test
  void rejeitaCargoEDepartamentoAusentes() {
    var semCargo = valido();
    var vinculo = semCargo.getVinculos().get(0);
    vinculo.setCargo(null);
    assertThrows(RuntimeException.class, () -> service.criar(semCargo));

    var semDepartamento = valido();
    semDepartamento.getVinculos().get(0).setDepartamento(null);
    assertThrows(RuntimeException.class, () -> service.criar(semDepartamento));
  }

  @Test
  void rejeitaMatriculaNaoNumerica() {
    var f = valido();
    f.getVinculos().get(0).setMatricula("ABC123");

    var erro = assertThrows(RuntimeException.class, () -> service.criar(f));

    assertEquals("A matrícula deve conter apenas números.", erro.getMessage());
    verify(funcionarios, never()).save(any());
  }

  private void assertVinculoInvalido(Consumer<Vinculo> mudanca) {
    var f = valido();
    mudanca.accept(f.getVinculos().get(0));
    assertThrows(RuntimeException.class, () -> service.criar(f));
  }
}
