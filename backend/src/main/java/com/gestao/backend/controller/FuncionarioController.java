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

import com.gestao.backend.model.Funcionario;
import com.gestao.backend.service.FuncionarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin(origins = "*")
public class FuncionarioController {

    private final FuncionarioService funcionarioService;

    public FuncionarioController(FuncionarioService funcionarioService) {
        this.funcionarioService = funcionarioService;
    }

    @GetMapping
    public Page<Funcionario> listar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cpf,
            @RequestParam(required = false) String matricula,
            @RequestParam(required = false) String empresa,
            @RequestParam(required = false) String cargo,
            @RequestParam(required = false) String departamento,
            Pageable pageable
    ) {
        return funcionarioService.listar(nome, cpf, matricula, empresa, cargo, departamento, pageable);
    }

    @PostMapping
    public Funcionario criar(@Valid @RequestBody Funcionario funcionario) {
        return funcionarioService.criar(funcionario);
    }

    @GetMapping("/{id}")
    public Funcionario buscarPorId(@PathVariable Long id) {
        return funcionarioService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Funcionario editar(@PathVariable Long id, @Valid @RequestBody Funcionario dados) {
        return funcionarioService.editar(id, dados);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        funcionarioService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/relatorio")
    public ResponseEntity<String> gerarRelatorio() {
        String csv = funcionarioService.gerarRelatorioCsv();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=funcionarios.csv")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csv);
    }
}