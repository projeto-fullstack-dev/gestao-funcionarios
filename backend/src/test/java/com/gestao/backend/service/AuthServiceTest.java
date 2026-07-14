package com.gestao.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.gestao.backend.dto.LoginRequest;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtEncoder;

class AuthServiceTest {

  @Test
  void autenticaEGeraToken() {
    AuthenticationManager authenticationManager = mock(AuthenticationManager.class);
    JwtEncoder jwtEncoder = mock(JwtEncoder.class);
    var authentication = new UsernamePasswordAuthenticationToken("login", "pass");
    Jwt jwt = mock(Jwt.class);
    when(authenticationManager.authenticate(any())).thenReturn(authentication);
    when(jwtEncoder.encode(any())).thenReturn(jwt);
    when(jwt.getTokenValue()).thenReturn("jwt-token");

    var response =
        new AuthService(authenticationManager, jwtEncoder, 3600)
            .login(new LoginRequest("login", "pass"));

    assertEquals("jwt-token", response.token());
    assertEquals("Bearer", response.tipo());
    assertEquals(3600, response.expiresIn());
    verify(authenticationManager).authenticate(any());
    verify(jwtEncoder).encode(any());
  }
}
