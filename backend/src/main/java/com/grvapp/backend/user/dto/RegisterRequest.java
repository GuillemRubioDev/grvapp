package com.grvapp.backend.user.dto;

import jakarta.validation.constraints.*;
import com.grvapp.backend.enums.DocumentType;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank
    private String username;

    @Email
    @NotBlank
    private String email;

    @Size(min = 8)
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d).+$", message = "Debe contener al menos una mayúscula y un número")
    private String password;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotNull
    private DocumentType documentType;

    @NotBlank
    private String documentNumber;

    private String phone1;
    private String phone2;
    private String address;

    private LocalDate birthDate;
}
