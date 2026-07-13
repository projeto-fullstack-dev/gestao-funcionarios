package com.gestao.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.gestao.backend.model.Cargo;
import com.gestao.backend.repository.CargoRepository;

@Service
@SuppressWarnings("null")
public class CargoService {

    private final CargoRepository cargoRepository;

    public CargoService(CargoRepository cargoRepository) {
        this.cargoRepository = cargoRepository;
    }

    public Page<Cargo> listar(String descricao, String codigo, Pageable pageable) {
        String descricaoFiltro = descricao == null ? "" : descricao;
        String codigoFiltro = codigo == null ? "" : codigo;

        return cargoRepository.findByCodigoContainingIgnoreCaseAndDescricaoContainingIgnoreCase(
                codigoFiltro,
                descricaoFiltro,
                pageable
        );
    }

    public Cargo criar(Cargo cargo) {
        if (cargoRepository.existsByCodigo(cargo.getCodigo())) {
            throw new RuntimeException("Já existe um cargo cadastrado com este código.");
        }

        return cargoRepository.save(cargo);
    }

    public Cargo buscarPorId(Long id) {
        return cargoRepository.findById(id)
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
        cargoRepository.delete(cargo);
    }

    public String gerarRelatorioCsv() {
        StringBuilder csv = new StringBuilder();

        csv.append("\uFEFF");
        csv.append("Código;Descrição\n");

        for (Cargo cargo : cargoRepository.findAll()) {
            csv.append(cargo.getCodigo())
                    .append(";")
                    .append(cargo.getDescricao())
                    .append("\n");
        }

        return csv.toString();
    }
}