package com.grvapp.backend.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.grvapp.backend.user.dto.UserProfileResponse;
import com.grvapp.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @GetMapping("/{username}")
  public ResponseEntity<UserProfileResponse> getUserProfile(
      @PathVariable String username,
      Authentication authentication) {

    String loggedUser = authentication.getName();
    boolean isAdmin = authentication.getAuthorities().stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

    System.out.println(
        "[USER ENDPOINT] loggedUser: " + loggedUser + " | path username: " + username + " | isAdmin: " + isAdmin);

    if (!loggedUser.equals(username) && !isAdmin) {
      System.out.println("[USER ENDPOINT] Acceso denegado.");
      return ResponseEntity.status(403).build();
    }

    UserProfileResponse response = userService.getUserProfile(username);
    System.out.println("[USER ENDPOINT] Acceso permitido. Devolviendo perfil de usuario.");
    return ResponseEntity.ok(response);
  }
}