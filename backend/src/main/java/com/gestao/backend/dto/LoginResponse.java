package com.gestao.backend.dto;

public record LoginResponse(String token, String tipo, long expiresIn) {}
