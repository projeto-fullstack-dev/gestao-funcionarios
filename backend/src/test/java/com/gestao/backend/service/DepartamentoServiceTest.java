package com.gestao.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.gestao.backend.model.Departamento;
import com.gestao.backend.repository.DepartamentoRepository;
import com.gestao.backend.repository.VinculoRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

class DepartamentoServiceTest {
  private DepartamentoRepository repository;
  private VinculoRepository vinculos;
  private DepartamentoService service;

  @BeforeEach
  void setUp() {
    repository = mock(DepartamentoRepository.class);
    vinculos = mock(VinculoRepository.class);
    service = new DepartamentoService(repository, vinculos);
  }

  private Departamento dep(String codigo, String descricao) {
    var d = new Departamento();
    d.setCodigo(codigo);
    d.setDescricao(descricao);
    return d;
  }

  @Test
  void listaComFiltrosNulos() {
    var p = PageRequest.of(0, 10);
    var pagina = new PageImpl<>(List.of(dep("TI", "Tecnologia")));
    when(repository.findByCodigoContainingIgnoreCaseAndDescricaoContainingIgnoreCase("", "", p))
        .thenReturn(pagina);
    assertSame(pagina, service.listar(null, null, p));
  }

  @Test
  void listaComFiltros() {
    var p = PageRequest.of(0, 10);
    service.listar("Tec", "TI", p);
    verify(repository)
        .findByCodigoContainingIgnoreCaseAndDescricaoContainingIgnoreCase("TI", "Tec", p);
  }

  @Test
  void cria() {
    var d = dep("TI", "Tecnologia");
    when(repository.save(d)).thenReturn(d);
    assertSame(d, service.criar(d));
  }

  @Test
  void rejeitaDuplicadoAoCriar() {
    var d = dep("TI", "Tecnologia");
    when(repository.existsByCodigo("TI")).thenReturn(true);
    assertThrows(RuntimeException.class, () -> service.criar(d));
  }

  @Test
  void busca() {
    var d = dep("TI", "Tecnologia");
    when(repository.findById(1L)).thenReturn(Optional.of(d));
    assertSame(d, service.buscarPorId(1L));
  }

  @Test
  void rejeitaIdInexistente() {
    when(repository.findById(1L)).thenReturn(Optional.empty());
    assertThrows(RuntimeException.class, () -> service.buscarPorId(1L));
  }

  @Test
  void edita() {
    var d = dep("A", "Antigo");
    var dados = dep("N", "Novo");
    when(repository.findById(1L)).thenReturn(Optional.of(d));
    when(repository.save(d)).thenReturn(d);
    assertSame(d, service.editar(1L, dados));
    assertEquals("N", d.getCodigo());
    assertEquals("Novo", d.getDescricao());
  }

  @Test
  void rejeitaDuplicadoAoEditar() {
    when(repository.findById(1L)).thenReturn(Optional.of(dep("A", "A")));
    when(repository.existsByCodigoAndIdNot("N", 1L)).thenReturn(true);
    assertThrows(RuntimeException.class, () -> service.editar(1L, dep("N", "N")));
  }

  @Test
  void exclui() {
    var d = dep("TI", "T");
    when(repository.findById(1L)).thenReturn(Optional.of(d));
    service.excluir(1L);
    verify(repository).delete(d);
  }

  @Test
  void rejeitaExclusaoDeDepartamentoComFuncionarioVinculado() {
    var departamento = dep("TI", "T");
    when(repository.findById(1L)).thenReturn(Optional.of(departamento));
    when(vinculos.existsByDepartamentoId(1L)).thenReturn(true);

    var erro = assertThrows(RuntimeException.class, () -> service.excluir(1L));

    assertEquals(
        "Não é possível excluir o departamento porque ele possui funcionário vinculado.",
        erro.getMessage());
    verify(repository, never()).delete(any());
  }
}
