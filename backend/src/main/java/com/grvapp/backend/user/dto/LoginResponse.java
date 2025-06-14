package com.grvapp.backend.user.dto;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class LoginResponse {
    private final String token;
    private Set<String> roles;
}
