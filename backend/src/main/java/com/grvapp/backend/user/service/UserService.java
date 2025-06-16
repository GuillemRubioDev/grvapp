package com.grvapp.backend.user.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.grvapp.backend.user.dto.UserProfileResponse;
import com.grvapp.backend.user.model.User;
import com.grvapp.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
// import org.springframework.beans.factory.annotation.Value; // Optional for now

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  // TODO: Make UPLOAD_DIR configurable via application.properties
  private final String UPLOAD_DIR = "./uploads/profile-pictures/";
  // Or use: @Value("${upload.profile.picture.path:./uploads/profile-pictures/}") private String UPLOAD_DIR;


  public UserProfileResponse getUserProfile(String username) {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    return new UserProfileResponse(
        user.getUsername(),
        user.getEmail(),
        user.getFirstName(),
        user.getLastName(),
        user.getProfilePictureUrl()); // Add this argument
  }

  public String updateProfilePicture(String username, MultipartFile file) throws IOException {
    User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

    // Ensure upload directory exists
    Path uploadPath = Paths.get(UPLOAD_DIR);
    if (!Files.exists(uploadPath)) {
        Files.createDirectories(uploadPath);
    }

    // Generate unique filename
    String originalFileName = file.getOriginalFilename();
    String fileExtension = "";
    if (originalFileName != null && originalFileName.contains(".")) {
        fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
    }
    String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

    Path filePath = uploadPath.resolve(uniqueFileName);
    Files.copy(file.getInputStream(), filePath);

    // This URL path should be relative to how files are served.
    // For example, if files in UPLOAD_DIR are served from "/profile-images", then:
    // String fileUrl = "/profile-images/" + uniqueFileName;
    // For now, assuming a direct mapping or a later configuration will handle it.
    String fileUrl = "/uploads/profile-pictures/" + uniqueFileName;
    user.setProfilePictureUrl(fileUrl);
    userRepository.save(user);

    return fileUrl;
  }
}