package com.grvapp.backend.user.controller;

import com.grvapp.backend.common.dto.ApiResponse;
import com.grvapp.backend.security.jwt.JwtUtils;
import com.grvapp.backend.user.dto.LoginRequest;
import com.grvapp.backend.user.dto.LoginResponse;
import com.grvapp.backend.user.dto.RegisterRequest;
import com.grvapp.backend.user.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            Set<String> roles = userDetails.getAuthorities().stream()
                    .map(auth -> auth.getAuthority())
                    .collect(Collectors.toSet());

            String jwt = jwtUtils.generateJwtToken(authentication);

            return ResponseEntity.ok(new LoginResponse(jwt, roles));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(new ApiResponse("usuarioOContrasenyaIncorrecto"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(new ApiResponse("registroOkVerificaMail"));
    }

    @GetMapping("/confirm")
    public ResponseEntity<?> confirmEmail(@RequestParam("token") String token) {
        ApiResponse response = authService.confirmToken(token);
        return ResponseEntity.ok(response);
    }

}
