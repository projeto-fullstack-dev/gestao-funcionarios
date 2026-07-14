package com.gestao.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.gestao.backend.model.Cargo;
import com.gestao.backend.repository.CargoRepository;
import com.gestao.backend.repository.VinculoRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

class CargoServiceTest {
  private CargoRepository repository;
  private VinculoRepository vinculos;
  private CargoService service;

  @BeforeEach
  void setUp() {
    repository = mock(CargoRepository.class);
    vinculos = mock(VinculoRepository.class);
    service = new CargoService(repository, vinculos);
  }

  private Cargo cargo(String codigo, String descricao) {
    var c = new Cargo();
    c.setCodigo(codigo);
    c.setDescricao(descricao);
    return c;
  }

  @Test
  void listaComFiltrosNulos() {
    var pageable = PageRequest.of(0, 10);
    var page = new PageImpl<>(List.of(cargo("DEV", "Dev")));
    when(repository.findByCodigoContainingIgnoreCaseAndDescricaoContainingIgnoreCase(
            "", "", pageable))
        .thenReturn(page);
    assertSame(page, service.listar(null, null, pageable));
  }

  @Test
  void listaComFiltros() {
    var pageable = PageRequest.of(0, 10);
    service.listar("Dev", "D", pageable);
    verify(repository)
        .findByCodigoContainingIgnoreCaseAndDescricaoContainingIgnoreCase("D", "Dev", pageable);
  }

  @Test
  void cria() {
    var c = cargo("DEV", "Dev");
    when(repository.save(c)).thenReturn(c);
    assertSame(c, service.criar(c));
  }

  @Test
  void rejeitaCodigoDuplicadoAoCriar() {
    var c = cargo("DEV", "Dev");
    when(repository.existsByCodigo("DEV")).thenReturn(true);
    assertThrows(RuntimeException.class, () -> service.criar(c));
  }

  @Test
  void busca() {
    var c = cargo("DEV", "Dev");
    when(repository.findById(1L)).thenReturn(Optional.of(c));
    assertSame(c, service.buscarPorId(1L));
  }

  @Test
  void rejeitaIdInexistente() {
    when(repository.findById(1L)).thenReturn(Optional.empty());
    assertThrows(RuntimeException.class, () -> service.buscarPorId(1L));
  }

  @Test
  void edita() {
    var atual = cargo("A", "Antigo");
    var dados = cargo("N", "Novo");
    when(repository.findById(1L)).thenReturn(Optional.of(atual));
    when(repository.save(atual)).thenReturn(atual);
    assertSame(atual, service.editar(1L, dados));
    assertEquals("N", atual.getCodigo());
    assertEquals("Novo", atual.getDescricao());
  }

  @Test
  void rejeitaCodigoDuplicadoAoEditar() {
    when(repository.findById(1L)).thenReturn(Optional.of(cargo("A", "A")));
    when(repository.existsByCodigoAndIdNot("N", 1L)).thenReturn(true);
    assertThrows(RuntimeException.class, () -> service.editar(1L, cargo("N", "N")));
  }

  @Test
  void exclui() {
    var c = cargo("A", "A");
    when(repository.findById(1L)).thenReturn(Optional.of(c));
    service.excluir(1L);
    verify(repository).delete(c);
  }

  @Test
  void rejeitaExclusaoDeCargoComFuncionarioVinculado() {
    var cargo = cargo("A", "A");
    when(repository.findById(1L)).thenReturn(Optional.of(cargo));
    when(vinculos.existsByCargoId(1L)).thenReturn(true);

    var erro = assertThrows(RuntimeException.class, () -> service.excluir(1L));

    assertEquals(
        "Não é possível excluir o cargo porque ele possui funcionário vinculado.",
        erro.getMessage());
    verify(repository, never()).delete(any());
  }
}
