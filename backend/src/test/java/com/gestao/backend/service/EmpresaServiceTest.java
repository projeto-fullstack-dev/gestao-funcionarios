package com.gestao.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.gestao.backend.model.Empresa;
import com.gestao.backend.repository.EmpresaRepository;
import com.gestao.backend.repository.VinculoRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageRequest;

class EmpresaServiceTest {
  private EmpresaRepository repository;
  private VinculoRepository vinculos;
  private EmpresaService service;

  @BeforeEach
  void setUp() {
    repository = mock(EmpresaRepository.class);
    vinculos = mock(VinculoRepository.class);
    service = new EmpresaService(repository, vinculos);
  }

  private Empresa empresa(String cnpj) {
    var empresa = new Empresa();
    empresa.setNome("ACME");
    empresa.setRazaoSocial("ACME Ltda.");
    empresa.setCnpj(cnpj);
    return empresa;
  }

  @Test
  void listaComFiltrosNormalizados() {
    var pageable = PageRequest.of(0, 10);
    service.listar(null, null, null, pageable);
    verify(repository)
        .findByNomeContainingIgnoreCaseAndRazaoSocialContainingIgnoreCaseAndCnpjContainingIgnoreCase(
            "", "", "", pageable);
  }

  @Test
  void criaEmpresa() {
    var empresa = empresa("1");
    when(repository.save(empresa)).thenReturn(empresa);
    assertSame(empresa, service.criar(empresa));
  }

  @Test
  void rejeitaCnpjDuplicado() {
    var empresa = empresa("1");
    when(repository.existsByCnpj("1")).thenReturn(true);
    assertThrows(RuntimeException.class, () -> service.criar(empresa));
  }

  @Test
  void buscaEditaEExclui() {
    var atual = empresa("1");
    var dados = empresa("2");
    dados.setNome("Nova");
    when(repository.findById(1L)).thenReturn(Optional.of(atual));
    when(repository.save(atual)).thenReturn(atual);
    assertSame(atual, service.buscarPorId(1L));
    assertSame(atual, service.editar(1L, dados));
    assertEquals("Nova", atual.getNome());
    service.excluir(1L);
    verify(repository).delete(atual);
  }

  @Test
  void rejeitaEmpresaInexistenteECnpjDuplicadoNaEdicao() {
    when(repository.findById(1L)).thenReturn(Optional.empty());
    assertThrows(RuntimeException.class, () -> service.buscarPorId(1L));
    var atual = empresa("1");
    when(repository.findById(1L)).thenReturn(Optional.of(atual));
    when(repository.existsByCnpjAndIdNot("2", 1L)).thenReturn(true);
    assertThrows(RuntimeException.class, () -> service.editar(1L, empresa("2")));
  }

  @Test
  void rejeitaExclusaoDeEmpresaComFuncionarioVinculado() {
    var empresa = empresa("1");
    when(repository.findById(1L)).thenReturn(Optional.of(empresa));
    when(vinculos.existsByEmpresaId(1L)).thenReturn(true);

    var erro = assertThrows(RuntimeException.class, () -> service.excluir(1L));

    assertEquals(
        "Não é possível excluir a empresa porque ela possui funcionário vinculado.",
        erro.getMessage());
    verify(repository, never()).delete(any());
  }
}
