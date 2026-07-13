package com.gestao.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestao.backend.model.Cargo;
import com.gestao.backend.service.CargoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cargos")
@CrossOrigin(origins = "*")
public class CargoController {

    private final CargoService cargoService;

    public CargoController(CargoService cargoService) {
        this.cargoService = cargoService;
    }

    @GetMapping
    public Page<Cargo> listar(
            @RequestParam(required = false) String descricao,
            @RequestParam(required = false) String codigo,
            Pageable pageable
    ) {
        return cargoService.listar(descricao, codigo, pageable);
    }

    @PostMapping
    public Cargo criar(@Valid @RequestBody Cargo cargo) {
        return cargoService.criar(cargo);
    }

    @GetMapping("/{id}")
    public Cargo buscarPorId(@PathVariable Long id) {
        return cargoService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Cargo editar(@PathVariable Long id, @Valid @RequestBody Cargo dados) {
        return cargoService.editar(id, dados);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        cargoService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/relatorio")
    public ResponseEntity<String> gerarRelatorio() {
        String csv = cargoService.gerarRelatorioCsv();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=cargos.csv")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csv);
    }
}