package com.gestao.backend.service;

import com.gestao.backend.model.Funcionario;
import com.gestao.backend.model.Vinculo;
import com.gestao.backend.repository.CargoRepository;
import com.gestao.backend.repository.DepartamentoRepository;
import com.gestao.backend.repository.EmpresaRepository;
import com.gestao.backend.repository.FuncionarioRepository;
import com.gestao.backend.repository.VinculoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings("null")
public class FuncionarioService {

  private final FuncionarioRepository funcionarioRepository;
  private final CargoRepository cargoRepository;
  private final DepartamentoRepository departamentoRepository;
  private final EmpresaRepository empresaRepository;
  private final VinculoRepository vinculoRepository;

  public FuncionarioService(
      FuncionarioRepository funcionarioRepository,
      CargoRepository cargoRepository,
      DepartamentoRepository departamentoRepository,
      EmpresaRepository empresaRepository,
      VinculoRepository vinculoRepository) {
    this.funcionarioRepository = funcionarioRepository;
    this.cargoRepository = cargoRepository;
    this.departamentoRepository = departamentoRepository;
    this.empresaRepository = empresaRepository;
    this.vinculoRepository = vinculoRepository;
  }

  public Page<Funcionario> listar(
      String nome,
      String cpf,
      String matricula,
      String empresa,
      String cargo,
      String departamento,
      Pageable pageable) {
    return funcionarioRepository.filtrar(
        limparFiltro(nome),
        limparFiltro(cpf),
        limparFiltro(matricula),
        limparFiltro(empresa),
        limparFiltro(cargo),
        limparFiltro(departamento),
        pageable);
  }

  public Funcionario criar(Funcionario funcionario) {
    validarCpf(funcionario.getCpf());

    if (funcionarioRepository.existsByCpf(funcionario.getCpf())) {
      throw new RuntimeException("Já existe um funcionário cadastrado com este CPF.");
    }

    validarVinculos(funcionario);

    for (Vinculo vinculo : funcionario.getVinculos()) {
      vinculo.setFuncionario(funcionario);
    }

    return funcionarioRepository.save(funcionario);
  }

  public Funcionario buscarPorId(Long id) {
    return funcionarioRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("Funcionário não encontrado."));
  }

  public Funcionario editar(Long id, Funcionario dados) {
    Funcionario funcionario = buscarPorId(id);

    validarCpf(dados.getCpf());

    if (funcionarioRepository.existsByCpfAndIdNot(dados.getCpf(), id)) {
      throw new RuntimeException("Já existe outro funcionário cadastrado com este CPF.");
    }

    validarVinculos(dados);

    funcionario.setNome(dados.getNome());
    funcionario.setCpf(dados.getCpf());

    funcionario.getVinculos().clear();

    for (Vinculo vinculo : dados.getVinculos()) {
      vinculo.setFuncionario(funcionario);
      funcionario.getVinculos().add(vinculo);
    }

    return funcionarioRepository.save(funcionario);
  }

  public void excluir(Long id) {
    Funcionario funcionario = buscarPorId(id);
    funcionarioRepository.delete(funcionario);
  }

  private void validarCpf(String cpf) {
    if (cpf == null || !cpf.matches("\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}")) {
      throw new RuntimeException("CPF inválido. Use o formato 000.000.000-00.");
    }
  }

  private void validarVinculos(Funcionario funcionario) {
    if (funcionario.getVinculos() == null || funcionario.getVinculos().isEmpty()) {
      throw new RuntimeException("O funcionário precisa ter pelo menos um vínculo.");
    }

    java.util.Set<Long> empresasComVinculoAtivo = new java.util.HashSet<>();

    for (Vinculo vinculo : funcionario.getVinculos()) {
      if (vinculo.getEmpresa() == null || vinculo.getEmpresa().getId() == null) {
        throw new RuntimeException("O vínculo precisa ter uma empresa cadastrada.");
      }

      Long empresaId = vinculo.getEmpresa().getId();
      empresaRepository
          .findById(empresaId)
          .orElseThrow(() -> new RuntimeException("Empresa informada não existe."));

      if (vinculo.isAtivo() && !empresasComVinculoAtivo.add(empresaId)) {
        throw new RuntimeException("O funcionário só pode ter um vínculo ativo por empresa.");
      }

      if (vinculo.getMatricula() == null || vinculo.getMatricula().isBlank()) {
        throw new RuntimeException("O vínculo precisa ter uma matrícula.");
      }

      if (!vinculo.getMatricula().matches("\\d+")) {
        throw new RuntimeException("A matrícula deve conter apenas números.");
      }

      if (vinculo.getId() == null && vinculoRepository.existsByMatricula(vinculo.getMatricula())) {
        throw new RuntimeException("Já existe um vínculo cadastrado com esta matrícula.");
      }

      if (vinculo.getId() != null
          && vinculoRepository.existsByMatriculaAndIdNot(vinculo.getMatricula(), vinculo.getId())) {
        throw new RuntimeException("Já existe outro vínculo cadastrado com esta matrícula.");
      }

      if (vinculo.getCargo() == null || vinculo.getCargo().getId() == null) {
        throw new RuntimeException("O vínculo precisa ter um cargo.");
      }

      if (vinculo.getDepartamento() == null || vinculo.getDepartamento().getId() == null) {
        throw new RuntimeException("O vínculo precisa ter um departamento.");
      }

      cargoRepository
          .findById(vinculo.getCargo().getId())
          .orElseThrow(() -> new RuntimeException("Cargo informado não existe."));

      departamentoRepository
          .findById(vinculo.getDepartamento().getId())
          .orElseThrow(() -> new RuntimeException("Departamento informado não existe."));
    }
  }

  private String limparFiltro(String valor) {
    if (valor == null || valor.isBlank()) {
      return null;
    }

    return valor;
  }
}
