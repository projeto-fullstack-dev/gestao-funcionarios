package com.gestao.backend.controller;

import com.gestao.backend.model.Cargo;
import com.gestao.backend.service.CargoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

@RestController
@RequestMapping("/api/cargos")
@CrossOrigin(origins = "*")
@Tag(name = "Cargos", description = "Cadastro, consulta e relatório de cargos")
public class CargoController {

  private final CargoService cargoService;

  public CargoController(CargoService cargoService) {
    this.cargoService = cargoService;
  }

  @GetMapping
  @Operation(
      summary = "Listar cargos",
      description = "Lista cargos com paginação e filtros opcionais por código e descrição.")
  public Page<Cargo> listar(
      @RequestParam(required = false) String descricao,
      @RequestParam(required = false) String codigo,
      Pageable pageable) {
    return cargoService.listar(descricao, codigo, pageable);
  }

  @PostMapping
  @Operation(summary = "Criar cargo")
  public Cargo criar(@Valid @RequestBody Cargo cargo) {
    return cargoService.criar(cargo);
  }

  @GetMapping("/{id}")
  @Operation(summary = "Buscar cargo por ID")
  public Cargo buscarPorId(@PathVariable Long id) {
    return cargoService.buscarPorId(id);
  }

  @PutMapping("/{id}")
  @Operation(summary = "Atualizar cargo")
  public Cargo editar(@PathVariable Long id, @Valid @RequestBody Cargo dados) {
    return cargoService.editar(id, dados);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Excluir cargo", description = "Exclui o cargo e retorna HTTP 204.")
  public ResponseEntity<Void> excluir(@PathVariable Long id) {
    cargoService.excluir(id);
    return ResponseEntity.noContent().build();
  }
}
