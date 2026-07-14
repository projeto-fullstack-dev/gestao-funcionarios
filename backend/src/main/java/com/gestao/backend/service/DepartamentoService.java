package com.gestao.backend.service;

import com.gestao.backend.model.Departamento;
import com.gestao.backend.repository.DepartamentoRepository;
import com.gestao.backend.repository.VinculoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings("null")
public class DepartamentoService {

  private final DepartamentoRepository departamentoRepository;
  private final VinculoRepository vinculoRepository;

  public DepartamentoService(
      DepartamentoRepository departamentoRepository, VinculoRepository vinculoRepository) {
    this.departamentoRepository = departamentoRepository;
    this.vinculoRepository = vinculoRepository;
  }

  public Page<Departamento> listar(String descricao, String codigo, Pageable pageable) {
    String descricaoFiltro = descricao == null ? "" : descricao;
    String codigoFiltro = codigo == null ? "" : codigo;

    return departamentoRepository.findByCodigoContainingIgnoreCaseAndDescricaoContainingIgnoreCase(
        codigoFiltro, descricaoFiltro, pageable);
  }

  public Departamento criar(Departamento departamento) {
    if (departamentoRepository.existsByCodigo(departamento.getCodigo())) {
      throw new RuntimeException("Já existe um departamento cadastrado com este código.");
    }

    return departamentoRepository.save(departamento);
  }

  public Departamento buscarPorId(Long id) {
    return departamentoRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("Departamento não encontrado."));
  }

  public Departamento editar(Long id, Departamento dados) {
    Departamento departamento = buscarPorId(id);

    if (departamentoRepository.existsByCodigoAndIdNot(dados.getCodigo(), id)) {
      throw new RuntimeException("Já existe outro departamento cadastrado com este código.");
    }

    departamento.setDescricao(dados.getDescricao());
    departamento.setCodigo(dados.getCodigo());

    return departamentoRepository.save(departamento);
  }

  public void excluir(Long id) {
    Departamento departamento = buscarPorId(id);
    if (vinculoRepository.existsByDepartamentoId(id)) {
      throw new RuntimeException(
          "Não é possível excluir o departamento porque ele possui funcionário vinculado.");
    }
    departamentoRepository.delete(departamento);
  }
}
