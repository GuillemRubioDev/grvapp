package com.grvapp.backend.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserProfileResponse {
  private String username;
  private String email;
  private String firstName;
  private String lastName;
}