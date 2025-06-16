package com.grv.grvapp.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception to indicate that a requested resource was not found.
 * This exception, when thrown from a Spring MVC controller method or service layer
 * and not caught elsewhere, will result in an HTTP 404 Not Found response.
 * This is due to the {@link ResponseStatus} annotation.
 */
@ResponseStatus(value = HttpStatus.NOT_FOUND) // Marks this exception to return HTTP 404
public class ResourceNotFoundException extends RuntimeException {

    /**
     * Constructs a new ResourceNotFoundException with the specified detail message.
     * @param message The detail message (which is saved for later retrieval by the {@link #getMessage()} method).
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
