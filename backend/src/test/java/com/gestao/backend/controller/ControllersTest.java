package com.gestao.backend.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.gestao.backend.model.*;
import com.gestao.backend.service.*;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

class ControllersTest {
  @Test
  void cargoDelegaTodasOperacoes() {
    var s = mock(CargoService.class);
    var c = new CargoController(s);
    var item = new Cargo();
    var p = PageRequest.of(0, 10);
    var page = new PageImpl<>(java.util.List.of(item));
    when(s.listar("d", "c", p)).thenReturn(page);
    when(s.criar(item)).thenReturn(item);
    when(s.buscarPorId(1L)).thenReturn(item);
    when(s.editar(1L, item)).thenReturn(item);
    assertSame(page, c.listar("d", "c", p));
    assertSame(item, c.criar(item));
    assertSame(item, c.buscarPorId(1L));
    assertSame(item, c.editar(1L, item));
    assertEquals(204, c.excluir(1L).getStatusCode().value());
  }

  @Test
  void departamentoDelegaTodasOperacoes() {
    var s = mock(DepartamentoService.class);
    var c = new DepartamentoController(s);
    var item = new Departamento();
    var p = PageRequest.of(0, 10);
    var page = new PageImpl<>(java.util.List.of(item));
    when(s.listar("d", "c", p)).thenReturn(page);
    when(s.criar(item)).thenReturn(item);
    when(s.buscarPorId(1L)).thenReturn(item);
    when(s.editar(1L, item)).thenReturn(item);
    assertSame(page, c.listar("d", "c", p));
    assertSame(item, c.criar(item));
    assertSame(item, c.buscarPorId(1L));
    assertSame(item, c.editar(1L, item));
    assertEquals(204, c.excluir(1L).getStatusCode().value());
  }

  @Test
  void funcionarioDelegaTodasOperacoes() {
    var s = mock(FuncionarioService.class);
    var c = new FuncionarioController(s);
    var item = new Funcionario();
    var p = PageRequest.of(0, 10);
    var page = new PageImpl<>(java.util.List.of(item));
    when(s.listar("n", "cpf", "m", "e", "c", "d", p)).thenReturn(page);
    when(s.criar(item)).thenReturn(item);
    when(s.buscarPorId(1L)).thenReturn(item);
    when(s.editar(1L, item)).thenReturn(item);
    assertSame(page, c.listar("n", "cpf", "m", "e", "c", "d", p));
    assertSame(item, c.criar(item));
    assertSame(item, c.buscarPorId(1L));
    assertSame(item, c.editar(1L, item));
    assertEquals(204, c.excluir(1L).getStatusCode().value());
  }
}
