package com.gestao.backend.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> tratarRuntimeException(RuntimeException ex) {
        Map<String, Object> erro = new HashMap<>();

        erro.put("timestamp", LocalDateTime.now());
        erro.put("status", 400);
        erro.put("erro", ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> tratarErroDeValidacao(MethodArgumentNotValidException ex) {
        Map<String, Object> erro = new HashMap<>();

        String mensagem = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(fieldError -> fieldError.getDefaultMessage())
                .orElse("Dados inválidos.");

        erro.put("timestamp", LocalDateTime.now());
        erro.put("status", 400);
        erro.put("erro", mensagem);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
    }
}