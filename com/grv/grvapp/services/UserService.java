package com.grv.grvapp.services;

import com.grv.grvapp.dtos.UserProfileUpdateRequestDto;
import com.grv.grvapp.exceptions.ResourceNotFoundException;
import com.grv.grvapp.models.User;
import com.grv.grvapp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * Service class for user-related operations.
 * Handles business logic for managing user profiles and profile images.
 */
@Service
public class UserService {

    private final UserRepository userRepository;

    /**
     * Constructs a new UserService with the given UserRepository.
     * @param userRepository The repository for accessing user data.
     */
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Updates the profile information (e.g., first name, last name) for a given user.
     * Fields in {@code requestDto} that are null will be ignored.
     *
     * @param userId The ID of the user to update.
     * @param requestDto DTO containing the updated profile information.
     * @return The updated User entity.
     * @throws ResourceNotFoundException if no user is found with the given ID.
     */
    @Transactional
    public User updateUserProfile(Long userId, UserProfileUpdateRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Update fields only if they are provided in the DTO
        if (requestDto.getFirstName() != null) {
            user.setFirstName(requestDto.getFirstName());
        }
        if (requestDto.getLastName() != null) {
            user.setLastName(requestDto.getLastName());
        }

        return userRepository.save(user);
    }

    /**
     * Uploads or updates the profile image for a given user.
     * If {@code imageFile} is null or empty, the existing image is not changed by default.
     *
     * @param userId The ID of the user whose profile image is to be updated.
     * @param imageFile The new profile image file.
     * @return The updated User entity with the new profile image.
     * @throws ResourceNotFoundException if no user is found with the given ID.
     * @throws IOException if an error occurs during file processing.
     */
    @Transactional
    public User uploadProfileImage(Long userId, MultipartFile imageFile) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (imageFile != null && !imageFile.isEmpty()) {
            user.setProfileImage(imageFile.getBytes());
        } else {
            // If imageFile is null or empty, current behavior is to not change the existing image.
            // To clear the image, explicit logic would be needed here, e.g., user.setProfileImage(null);
            // For now, we assume a valid, non-empty file is expected for an update action.
        }

        return userRepository.save(user);
    }

    /**
     * Retrieves the profile image for a given user.
     *
     * @param userId The ID of the user whose profile image is to be retrieved.
     * @return A byte array containing the image data, or null if the user has no profile image.
     * @throws ResourceNotFoundException if no user is found with the given ID.
     */
    @Transactional(readOnly = true) // Good practice for read-only operations
    public byte[] getProfileImage(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Returns the byte array directly. Could be null if no image was ever set.
        // Consider creating a specific ImageNotFoundException if a null/empty image needs distinct error handling upstream.
        return user.getProfileImage();
    }
}
