package com.gestao.backend.controller;

import com.gestao.backend.model.Empresa;
import com.gestao.backend.service.EmpresaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/empresas")
@CrossOrigin(origins = "*")
@Tag(name = "Empresas", description = "Cadastro das empresas utilizadas nos vínculos")
@ApiResponses({
  @ApiResponse(responseCode = "400", description = "Dados ou regra de negócio inválidos"),
  @ApiResponse(
      responseCode = "401",
      description = "Token JWT ausente ou inválido",
      content = @Content)
})
public class EmpresaController {
  private final EmpresaService empresaService;

  public EmpresaController(EmpresaService empresaService) {
    this.empresaService = empresaService;
  }

  @GetMapping
  @Operation(summary = "Listar empresas")
  @ApiResponse(responseCode = "200", description = "Página de empresas")
  public Page<Empresa> listar(
      @RequestParam(required = false) String nome,
      @RequestParam(required = false) String razaoSocial,
      @RequestParam(required = false) String cnpj,
      Pageable pageable) {
    return empresaService.listar(nome, razaoSocial, cnpj, pageable);
  }

  @PostMapping
  @Operation(summary = "Criar empresa")
  @ApiResponse(responseCode = "200", description = "Empresa criada")
  public Empresa criar(@Valid @RequestBody Empresa empresa) {
    return empresaService.criar(empresa);
  }

  @GetMapping("/{id}")
  @Operation(summary = "Buscar empresa por ID")
  public Empresa buscarPorId(@PathVariable Long id) {
    return empresaService.buscarPorId(id);
  }

  @PutMapping("/{id}")
  @Operation(summary = "Atualizar empresa")
  public Empresa editar(@PathVariable Long id, @Valid @RequestBody Empresa empresa) {
    return empresaService.editar(id, empresa);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Excluir empresa")
  @ApiResponse(responseCode = "204", description = "Empresa excluída", content = @Content)
  public ResponseEntity<Void> excluir(@PathVariable Long id) {
    empresaService.excluir(id);
    return ResponseEntity.noContent().build();
  }
}
