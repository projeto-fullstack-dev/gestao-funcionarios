package com.gestao.backend.service;

import com.gestao.backend.model.Empresa;
import com.gestao.backend.repository.EmpresaRepository;
import com.gestao.backend.repository.VinculoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings("null")
public class EmpresaService {

  private final EmpresaRepository empresaRepository;
  private final VinculoRepository vinculoRepository;

  public EmpresaService(EmpresaRepository empresaRepository, VinculoRepository vinculoRepository) {
    this.empresaRepository = empresaRepository;
    this.vinculoRepository = vinculoRepository;
  }

  public Page<Empresa> listar(String nome, String razaoSocial, String cnpj, Pageable pageable) {
    return empresaRepository
        .findByNomeContainingIgnoreCaseAndRazaoSocialContainingIgnoreCaseAndCnpjContainingIgnoreCase(
            filtro(nome), filtro(razaoSocial), filtro(cnpj), pageable);
  }

  public Empresa criar(Empresa empresa) {
    if (empresaRepository.existsByCnpj(empresa.getCnpj())) {
      throw new RuntimeException("Já existe uma empresa cadastrada com este CNPJ.");
    }
    return empresaRepository.save(empresa);
  }

  public Empresa buscarPorId(Long id) {
    return empresaRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("Empresa não encontrada."));
  }

  public Empresa editar(Long id, Empresa dados) {
    Empresa empresa = buscarPorId(id);
    if (empresaRepository.existsByCnpjAndIdNot(dados.getCnpj(), id)) {
      throw new RuntimeException("Já existe outra empresa cadastrada com este CNPJ.");
    }
    empresa.setNome(dados.getNome());
    empresa.setRazaoSocial(dados.getRazaoSocial());
    empresa.setCnpj(dados.getCnpj());
    return empresaRepository.save(empresa);
  }

  public void excluir(Long id) {
    Empresa empresa = buscarPorId(id);
    if (vinculoRepository.existsByEmpresaId(id)) {
      throw new RuntimeException(
          "Não é possível excluir a empresa porque ela possui funcionário vinculado.");
    }
    empresaRepository.delete(empresa);
  }

  private String filtro(String valor) {
    return valor == null ? "" : valor;
  }
}
