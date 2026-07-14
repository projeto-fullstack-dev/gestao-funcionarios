package com.gestao.backend.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.gestao.backend.dto.LoginRequest;
import com.gestao.backend.dto.LoginResponse;
import com.gestao.backend.service.AuthService;
import org.junit.jupiter.api.Test;

class AuthControllerTest {

  @Test
  void retornaTokenGeradoPeloService() {
    AuthService service = mock(AuthService.class);
    var request = new LoginRequest("login", "pass");
    var response = new LoginResponse("token", "Bearer", 3600);
    when(service.login(request)).thenReturn(response);

    var entity = new AuthController(service).login(request);

    assertEquals(200, entity.getStatusCode().value());
    assertSame(response, entity.getBody());
  }
}
