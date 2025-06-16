package com.grv.grvapp.controllers;

import com.grv.grvapp.dtos.UserProfileUpdateRequestDto;
import com.grv.grvapp.models.User;
import com.grv.grvapp.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

/**
 * REST controller for managing user-related operations such as profile updates and image uploads.
 * Base path for all endpoints in this controller is /api/users.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    /**
     * Constructs a UserController with the necessary UserService.
     * @param userService The service handling user business logic.
     */
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Updates a user's profile information.
     * Accepts a DTO with fields to update.
     *
     * @param userId The ID of the user whose profile is to be updated.
     * @param requestDto The DTO containing updated data for the user's profile.
     * @return ResponseEntity containing the updated User object and HTTP status 200 (OK).
     *         If the user is not found, a global exception handler should handle ResourceNotFoundException (e.g., return 404).
     */
    @PutMapping("/{userId}/profile")
    public ResponseEntity<User> updateUserProfile(@PathVariable Long userId, @RequestBody UserProfileUpdateRequestDto requestDto) {
        User updatedUser = userService.updateUserProfile(userId, requestDto);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Uploads or updates a user's profile image.
     *
     * @param userId The ID of the user whose profile image is being uploaded.
     * @param imageFile The image file sent as part of a multipart request, under the name "image".
     * @return ResponseEntity containing the updated User object (HTTP 200 OK),
     *         or an error message with HTTP status 500 (Internal Server Error) if an IOException occurs during file processing.
     *         If the user is not found, a global exception handler should handle ResourceNotFoundException (e.g., return 404).
     */
    @PostMapping("/{userId}/image")
    public ResponseEntity<?> uploadProfileImage(@PathVariable Long userId, @RequestParam("image") MultipartFile imageFile) {
        try {
            User updatedUser = userService.uploadProfileImage(userId, imageFile);
            // Consider returning a more specific DTO if not all User fields are relevant to the client after upload.
            return ResponseEntity.ok(updatedUser);
        } catch (IOException e) {
            logger.error("Error uploading profile image for user ID {}: {}", userId, e.getMessage(), e);
            // It's good practice to return a generic error message to the client for security reasons,
            // while logging the detailed error on the server.
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while uploading the image.");
        }
        // Note: ResourceNotFoundException thrown by userService is expected to be handled by a global exception handler (e.g., @ControllerAdvice)
        // which would typically return a 404 Not Found response.
    }

    /**
     * Retrieves a user's profile image.
     *
     * @param userId The ID of the user whose profile image is to be retrieved.
     * @return ResponseEntity containing the image bytes with Content-Type header (e.g., image/jpeg) and HTTP status 200 (OK).
     *         Returns HTTP status 404 (Not Found) if the user or their image is not found.
     */
    @GetMapping("/{userId}/image")
    public ResponseEntity<byte[]> getProfileImage(@PathVariable Long userId) {
        byte[] imageBytes = userService.getProfileImage(userId);

        if (imageBytes != null && imageBytes.length > 0) {
            HttpHeaders headers = new HttpHeaders();
            // Defaulting to IMAGE_JPEG. For a production application, it's better to:
            // 1. Store the original media type of the image when uploaded.
            // 2. Or, use a library to detect the media type from the image bytes (e.g., Apache Tika).
            // For this example, IMAGE_JPEG is a common default.
            headers.setContentType(MediaType.IMAGE_JPEG);

            // Consider adding Cache-Control headers for better browser caching behavior, e.g.:
            // headers.setCacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic().getHeaderValue());

            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
        } else {
            // This handles cases where the user exists but has no profile image,
            // or if getProfileImage returns null for other reasons.
            return ResponseEntity.notFound().build();
        }
        // Note: If userService.getProfileImage throws ResourceNotFoundException (user ID itself not found),
        // it's expected to be handled by a global exception handler, returning 404.
    }
}
