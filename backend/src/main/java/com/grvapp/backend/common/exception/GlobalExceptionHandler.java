package com.grvapp.backend.common.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.grvapp.backend.common.dto.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // @ExceptionHandler(MethodArgumentNotValidException.class)
    // public ResponseEntity<ApiResponse>
    // handleValidationErrors(MethodArgumentNotValidException ex) {
    // String errorMessage = ex.getBindingResult().getFieldErrors().stream()
    // .map(e -> e.getField() + ": " + e.getDefaultMessage())
    // .collect(Collectors.joining("; "));
    // return ResponseEntity.badRequest().body(new ApiResponse(errorMessage));
    // }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getDefaultMessage())
                .distinct()
                .findFirst()
                .orElse("validacionKO");
        return ResponseEntity.badRequest().body(new ApiResponse(errorMessage));
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse> handleCustomException(CustomException ex) {
        return ResponseEntity.badRequest().body(new ApiResponse(ex.getMessage()));
    }
}