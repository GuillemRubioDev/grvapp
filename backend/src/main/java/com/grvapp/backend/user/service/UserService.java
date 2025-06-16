package com.grvapp.backend.user.service;

import org.springframework.stereotype.Service;

import com.grvapp.backend.user.dto.UserProfileResponse;
import com.grvapp.backend.user.model.User;
import com.grvapp.backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  public UserProfileResponse getUserProfile(String username) {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("usuarioNoEncontrado"));
    return new UserProfileResponse(
        user.getUsername(),
        user.getEmail(),
        user.getFirstName(),
        user.getLastName());
  }
}