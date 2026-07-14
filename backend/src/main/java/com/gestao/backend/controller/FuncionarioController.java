package com.gestao.backend.controller;

import com.gestao.backend.model.Funcionario;
import com.gestao.backend.service.FuncionarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = "*")
@Tag(
    name = "Funcionários",
    description = "Cadastro, consulta e relatório de funcionários e seus vínculos")
@ApiResponses({
  @ApiResponse(responseCode = "400", description = "Dados ou regra de vínculo inválidos"),
  @ApiResponse(
      responseCode = "401",
      description = "Token JWT ausente ou inválido",
      content = @Content)
})
public class FuncionarioController {

  private final FuncionarioService funcionarioService;

  public FuncionarioController(FuncionarioService funcionarioService) {
    this.funcionarioService = funcionarioService;
  }

  @GetMapping
  @Operation(
      summary = "Listar funcionários",
      description = "Lista funcionários com paginação e filtros por dados pessoais e do vínculo.")
  public Page<Funcionario> listar(
      @RequestParam(required = false) String nome,
      @RequestParam(required = false) String cpf,
      @RequestParam(required = false) String matricula,
      @RequestParam(required = false) String empresa,
      @RequestParam(required = false) String cargo,
      @RequestParam(required = false) String departamento,
      Pageable pageable) {
    return funcionarioService.listar(nome, cpf, matricula, empresa, cargo, departamento, pageable);
  }

  @PostMapping
  @Operation(summary = "Criar funcionário")
  public Funcionario criar(@Valid @RequestBody Funcionario funcionario) {
    return funcionarioService.criar(funcionario);
  }

  @GetMapping("/{id}")
  @Operation(summary = "Buscar funcionário por ID")
  public Funcionario buscarPorId(@PathVariable Long id) {
    return funcionarioService.buscarPorId(id);
  }

  @PutMapping("/{id}")
  @Operation(summary = "Atualizar funcionário")
  public Funcionario editar(@PathVariable Long id, @Valid @RequestBody Funcionario dados) {
    return funcionarioService.editar(id, dados);
  }

  @DeleteMapping("/{id}")
  @Operation(
      summary = "Excluir funcionário",
      description = "Exclui o funcionário e seus vínculos e retorna HTTP 204.")
  public ResponseEntity<Void> excluir(@PathVariable Long id) {
    funcionarioService.excluir(id);
    return ResponseEntity.noContent().build();
  }
}
