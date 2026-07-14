package com.gestao.backend;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.gestao.backend.config.OpenApiConfig;
import com.gestao.backend.exception.GlobalExceptionHandler;
import com.gestao.backend.model.*;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;

class ModelAndConfigTest {
  @Test
  void acessoresDosModelos() {
    var c = new Cargo();
    c.setCodigo("C");
    c.setDescricao("Cargo");
    assertNull(c.getId());
    assertEquals("C", c.getCodigo());
    assertEquals("Cargo", c.getDescricao());
    var d = new Departamento();
    d.setCodigo("D");
    d.setDescricao("Dep");
    assertNull(d.getId());
    assertEquals("D", d.getCodigo());
    assertEquals("Dep", d.getDescricao());
    var f = new Funcionario();
    f.setNome("Ana");
    f.setCpf("123");
    var v = new Vinculo();
    v.setId(1L);
    var e = new Empresa();
    e.setNome("ACME");
    v.setEmpresa(e);
    v.setMatricula("M");
    v.setFuncionario(f);
    v.setCargo(c);
    v.setDepartamento(d);
    f.setVinculos(List.of(v));
    assertNull(f.getId());
    assertEquals("Ana", f.getNome());
    assertEquals("123", f.getCpf());
    assertSame(v, f.getVinculos().get(0));
    assertEquals(1L, v.getId());
    assertSame(e, v.getEmpresa());
    assertEquals("M", v.getMatricula());
    assertSame(f, v.getFuncionario());
    assertSame(c, v.getCargo());
    assertSame(d, v.getDepartamento());
  }

  @Test
  void configuraOpenApi() {
    var api = new OpenApiConfig().gestaoFuncionariosOpenAPI();
    assertEquals("1.0.0", api.getInfo().getVersion());
    assertTrue(api.getInfo().getTitle().contains("Gest"));
    assertNotNull(api.getInfo().getDescription());
  }

  @Test
  void trataRuntimeException() {
    var r = new GlobalExceptionHandler().tratarRuntimeException(new RuntimeException("erro"));
    assertEquals(400, r.getStatusCode().value());
    assertEquals("erro", r.getBody().get("erro"));
    assertNotNull(r.getBody().get("timestamp"));
  }

  @Test
  void trataPrimeiroErroDeValidacao() {
    var binding = mock(BindingResult.class);
    var ex = mock(MethodArgumentNotValidException.class);
    when(ex.getBindingResult()).thenReturn(binding);
    when(binding.getFieldErrors())
        .thenReturn(
            List.of(new org.springframework.validation.FieldError("obj", "campo", "inválido")));
    var r = new GlobalExceptionHandler().tratarErroDeValidacao(ex);
    assertEquals("inválido", r.getBody().get("erro"));
  }

  @Test
  void usaMensagemPadraoSemErroDeValidacao() {
    var binding = mock(BindingResult.class);
    var ex = mock(MethodArgumentNotValidException.class);
    when(ex.getBindingResult()).thenReturn(binding);
    when(binding.getFieldErrors()).thenReturn(List.of());
    assertNotNull(new GlobalExceptionHandler().tratarErroDeValidacao(ex).getBody().get("erro"));
  }
}
