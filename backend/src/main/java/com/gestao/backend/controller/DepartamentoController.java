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

import com.gestao.backend.model.Departamento;
import com.gestao.backend.service.DepartamentoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/departamentos")
@CrossOrigin(origins = "*")
public class DepartamentoController {

    private final DepartamentoService departamentoService;

    public DepartamentoController(DepartamentoService departamentoService) {
        this.departamentoService = departamentoService;
    }

    @GetMapping
    public Page<Departamento> listar(
            @RequestParam(required = false) String descricao,
            @RequestParam(required = false) String codigo,
            Pageable pageable
    ) {
        return departamentoService.listar(descricao, codigo, pageable);
    }

    @PostMapping
    public Departamento criar(@Valid @RequestBody Departamento departamento) {
        return departamentoService.criar(departamento);
    }

    @GetMapping("/{id}")
    public Departamento buscarPorId(@PathVariable Long id) {
        return departamentoService.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Departamento editar(@PathVariable Long id, @Valid @RequestBody Departamento dados) {
        return departamentoService.editar(id, dados);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        departamentoService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/relatorio")
    public ResponseEntity<String> gerarRelatorio() {
        String csv = departamentoService.gerarRelatorioCsv();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=departamentos.csv")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csv);
    }
}