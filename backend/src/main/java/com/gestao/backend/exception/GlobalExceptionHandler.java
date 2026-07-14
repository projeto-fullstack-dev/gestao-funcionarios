package com.gestao.backend.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<Map<String, Object>> tratarRuntimeException(RuntimeException ex) {
    log.atError()
        .setMessage("Erro de negócio ao processar requisição")
        .addKeyValue("errorType", ex.getClass().getSimpleName())
        .addKeyValue("status", HttpStatus.BAD_REQUEST.value())
        .addKeyValue("errorMessage", ex.getMessage())
        .setCause(ex)
        .log();

    Map<String, Object> erro = new HashMap<>();
    erro.put("timestamp", LocalDateTime.now());
    erro.put("status", HttpStatus.BAD_REQUEST.value());
    erro.put("erro", ex.getMessage());

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> tratarErroDeValidacao(
      MethodArgumentNotValidException ex) {
    String mensagem =
        ex.getBindingResult().getFieldErrors().stream()
            .findFirst()
            .map(fieldError -> fieldError.getDefaultMessage())
            .orElse("Dados inválidos.");

    log.atError()
        .setMessage("Erro de validação ao processar requisição")
        .addKeyValue("errorType", ex.getClass().getSimpleName())
        .addKeyValue("status", HttpStatus.BAD_REQUEST.value())
        .addKeyValue("errorMessage", mensagem)
        .addKeyValue("validationErrorCount", ex.getBindingResult().getFieldErrorCount())
        .log();

    Map<String, Object> erro = new HashMap<>();
    erro.put("timestamp", LocalDateTime.now());
    erro.put("status", HttpStatus.BAD_REQUEST.value());
    erro.put("erro", mensagem);

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
  }
}
