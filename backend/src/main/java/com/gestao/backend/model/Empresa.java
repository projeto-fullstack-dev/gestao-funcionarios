package com.gestao.backend.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;

@Entity
@Schema(description = "Empresa disponível para vínculos de funcionários")
public class Empresa {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Schema(accessMode = Schema.AccessMode.READ_ONLY, example = "1")
  private Long id;

  @NotBlank(message = "O nome da empresa é obrigatório")
  @Column(nullable = false)
  @Schema(example = "Dixi Tecnologia")
  private String nome;

  @NotBlank(message = "A razão social da empresa é obrigatória")
  @Column(name = "razao_social", nullable = false)
  @Schema(example = "Dixi Tecnologia Ltda.")
  private String razaoSocial;

  @NotBlank(message = "O CNPJ da empresa é obrigatório")
  @Column(nullable = false, unique = true)
  @Schema(example = "12.345.678/0001-90")
  private String cnpj;

  public Long getId() {
    return id;
  }

  public String getNome() {
    return nome;
  }

  public void setNome(String nome) {
    this.nome = nome;
  }

  public String getRazaoSocial() {
    return razaoSocial;
  }

  public void setRazaoSocial(String razaoSocial) {
    this.razaoSocial = razaoSocial;
  }

  public String getCnpj() {
    return cnpj;
  }

  public void setCnpj(String cnpj) {
    this.cnpj = cnpj;
  }
}
