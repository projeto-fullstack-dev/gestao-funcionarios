package com.gestao.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Entity
@Schema(description = "Vínculo de um funcionário com uma empresa")
public class Vinculo {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Schema(accessMode = Schema.AccessMode.READ_ONLY)
  private Long id;

  @NotNull(message = "A empresa é obrigatória")
  @ManyToOne
  @JoinColumn(name = "empresa_id", nullable = false)
  private Empresa empresa;

  @Column(nullable = false)
  @Schema(description = "Indica se este é um vínculo ativo", example = "true")
  private boolean ativo = true;

  @NotBlank(message = "A matrícula é obrigatória")
  @Pattern(regexp = "\\d+", message = "A matrícula deve conter apenas números")
  @Column(nullable = false, unique = true)
  private String matricula;

  @ManyToOne
  @JoinColumn(name = "funcionario_id", nullable = false)
  @JsonBackReference
  private Funcionario funcionario;

  @NotNull(message = "O cargo é obrigatório")
  @ManyToOne
  @JoinColumn(name = "cargo_id", nullable = false)
  private Cargo cargo;

  @NotNull(message = "O departamento é obrigatório")
  @ManyToOne
  @JoinColumn(name = "departamento_id", nullable = false)
  private Departamento departamento;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Empresa getEmpresa() {
    return empresa;
  }

  public void setEmpresa(Empresa empresa) {
    this.empresa = empresa;
  }

  public boolean isAtivo() {
    return ativo;
  }

  public void setAtivo(boolean ativo) {
    this.ativo = ativo;
  }

  public String getMatricula() {
    return matricula;
  }

  public void setMatricula(String matricula) {
    this.matricula = matricula;
  }

  public Funcionario getFuncionario() {
    return funcionario;
  }

  public void setFuncionario(Funcionario funcionario) {
    this.funcionario = funcionario;
  }

  public Cargo getCargo() {
    return cargo;
  }

  public void setCargo(Cargo cargo) {
    this.cargo = cargo;
  }

  public Departamento getDepartamento() {
    return departamento;
  }

  public void setDepartamento(Departamento departamento) {
    this.departamento = departamento;
  }
}
