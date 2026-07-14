package com.gestao.backend.service;

import com.gestao.backend.dto.LoginRequest;
import com.gestao.backend.dto.LoginResponse;
import java.time.Instant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

  private final AuthenticationManager authenticationManager;
  private final JwtEncoder jwtEncoder;
  private final long expirationSeconds;

  public AuthService(
      AuthenticationManager authenticationManager,
      JwtEncoder jwtEncoder,
      @Value("${security.jwt.expiration-seconds}") long expirationSeconds) {
    this.authenticationManager = authenticationManager;
    this.jwtEncoder = jwtEncoder;
    this.expirationSeconds = expirationSeconds;
  }

  public LoginResponse login(LoginRequest request) {
    var authentication =
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.login(), request.senha()));

    Instant issuedAt = Instant.now();
    JwtClaimsSet claims =
        JwtClaimsSet.builder()
            .issuer("gestao-funcionarios")
            .issuedAt(issuedAt)
            .expiresAt(issuedAt.plusSeconds(expirationSeconds))
            .subject(authentication.getName())
            .claim("scope", "USER")
            .build();
    JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
    String token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();

    return new LoginResponse(token, "Bearer", expirationSeconds);
  }
}
