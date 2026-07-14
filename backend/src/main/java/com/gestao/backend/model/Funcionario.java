package com.gestao.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Funcionario {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank(message = "O nome do funcionário é obrigatório")
  @Column(nullable = false)
  private String nome;

  @NotBlank(message = "O CPF do funcionário é obrigatório")
  @Column(nullable = false, unique = true)
  private String cpf;

  @Valid
  @OneToMany(mappedBy = "funcionario", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference
  private List<Vinculo> vinculos = new ArrayList<>();

  public Long getId() {
    return id;
  }

  public String getNome() {
    return nome;
  }

  public void setNome(String nome) {
    this.nome = nome;
  }

  public String getCpf() {
    return cpf;
  }

  public void setCpf(String cpf) {
    this.cpf = cpf;
  }

  public List<Vinculo> getVinculos() {
    return vinculos;
  }

  public void setVinculos(List<Vinculo> vinculos) {
    this.vinculos = vinculos;
  }
}
