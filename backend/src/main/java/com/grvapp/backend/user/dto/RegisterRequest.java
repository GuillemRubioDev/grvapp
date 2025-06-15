package com.grvapp.backend.user.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank
    private String username;

    @Email
    @NotBlank
    private String email;

    @Size(min = 8, message = "contenerMayONum")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d).+$", message = "contenerMayONum")
    private String password;

    private String firstName;
    private String lastName;
    private String documentType;
    private String documentNumber;
    private String phone1;
    private String phone2;
    private String address;

    private LocalDate birthDate;
}
