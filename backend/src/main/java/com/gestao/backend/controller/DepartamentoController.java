package com.gestao.backend.controller;

import com.gestao.backend.model.Departamento;
import com.gestao.backend.service.DepartamentoService;
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
@RequestMapping("/api/departamentos")
@CrossOrigin(origins = "*")
@Tag(name = "Departamentos", description = "Cadastro, consulta e relatório de departamentos")
public class DepartamentoController {

  private final DepartamentoService departamentoService;

  public DepartamentoController(DepartamentoService departamentoService) {
    this.departamentoService = departamentoService;
  }

  @GetMapping
  @Operation(
      summary = "Listar departamentos",
      description = "Lista departamentos com paginação e filtros opcionais por código e descrição.")
  public Page<Departamento> listar(
      @RequestParam(required = false) String descricao,
      @RequestParam(required = false) String codigo,
      Pageable pageable) {
    return departamentoService.listar(descricao, codigo, pageable);
  }

  @PostMapping
  @Operation(summary = "Criar departamento")
  public Departamento criar(@Valid @RequestBody Departamento departamento) {
    return departamentoService.criar(departamento);
  }

  @GetMapping("/{id}")
  @Operation(summary = "Buscar departamento por ID")
  public Departamento buscarPorId(@PathVariable Long id) {
    return departamentoService.buscarPorId(id);
  }

  @PutMapping("/{id}")
  @Operation(summary = "Atualizar departamento")
  public Departamento editar(@PathVariable Long id, @Valid @RequestBody Departamento dados) {
    return departamentoService.editar(id, dados);
  }

  @DeleteMapping("/{id}")
  @Operation(
      summary = "Excluir departamento",
      description = "Exclui o departamento e retorna HTTP 204.")
  public ResponseEntity<Void> excluir(@PathVariable Long id) {
    departamentoService.excluir(id);
    return ResponseEntity.noContent().build();
  }
}
