package com.grvapp.backend.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.grvapp.backend.user.dto.UserProfileResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
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

  @PostMapping("/me/profile-picture")
  public ResponseEntity<?> uploadProfilePicture(
      @RequestParam("file") MultipartFile file,
      Authentication authentication) {

    if (authentication == null || !authentication.isAuthenticated()) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
    }
    String username = authentication.getName();

    if (file.isEmpty()) {
      return ResponseEntity.badRequest().body("File cannot be empty");
    }

    // Optional: Add file size/type validation here
    // e.g. if (file.getSize() > MAX_FILE_SIZE) { ... }
    // e.g. if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) { ... }

    try {
      String fileUrl = userService.updateProfilePicture(username, file);
      Map<String, String> response = new HashMap<>();
      response.put("profilePictureUrl", fileUrl);
      return ResponseEntity.ok(response);
    } catch (IOException e) {
      // Log the exception (e.g., using a logger)
      // logger.error("Failed to upload profile picture for user {}: {}", username, e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Failed to upload profile picture: " + e.getMessage());
    } catch (RuntimeException e) { // Catch user not found or other runtime issues
      // Log the exception
      // logger.error("Error during profile picture upload for user {}: {}", username, e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
  }
}