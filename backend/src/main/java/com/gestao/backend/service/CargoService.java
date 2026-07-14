package com.gestao.backend.service;

import com.gestao.backend.model.Cargo;
import com.gestao.backend.repository.CargoRepository;
import com.gestao.backend.repository.VinculoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@SuppressWarnings("null")
public class CargoService {

  private final CargoRepository cargoRepository;
  private final VinculoRepository vinculoRepository;

  public CargoService(CargoRepository cargoRepository, VinculoRepository vinculoRepository) {
    this.cargoRepository = cargoRepository;
    this.vinculoRepository = vinculoRepository;
  }

  public Page<Cargo> listar(String descricao, String codigo, Pageable pageable) {
    String descricaoFiltro = descricao == null ? "" : descricao;
    String codigoFiltro = codigo == null ? "" : codigo;

    return cargoRepository.findByCodigoContainingIgnoreCaseAndDescricaoContainingIgnoreCase(
        codigoFiltro, descricaoFiltro, pageable);
  }

  public Cargo criar(Cargo cargo) {
    if (cargoRepository.existsByCodigo(cargo.getCodigo())) {
      throw new RuntimeException("Já existe um cargo cadastrado com este código.");
    }

    return cargoRepository.save(cargo);
  }

  public Cargo buscarPorId(Long id) {
    return cargoRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("Cargo não encontrado."));
  }

  public Cargo editar(Long id, Cargo dados) {
    Cargo cargo = buscarPorId(id);

    if (cargoRepository.existsByCodigoAndIdNot(dados.getCodigo(), id)) {
      throw new RuntimeException("Já existe outro cargo cadastrado com este código.");
    }

    cargo.setDescricao(dados.getDescricao());
    cargo.setCodigo(dados.getCodigo());

    return cargoRepository.save(cargo);
  }

  public void excluir(Long id) {
    Cargo cargo = buscarPorId(id);
    if (vinculoRepository.existsByCargoId(id)) {
      throw new RuntimeException(
          "Não é possível excluir o cargo porque ele possui funcionário vinculado.");
    }
    cargoRepository.delete(cargo);
  }
}
