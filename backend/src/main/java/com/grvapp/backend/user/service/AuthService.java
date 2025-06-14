package com.grvapp.backend.user.service;

import com.grvapp.backend.common.dto.ApiResponse;
import com.grvapp.backend.common.exception.CustomException;
import com.grvapp.backend.user.dto.RegisterRequest;
import com.grvapp.backend.user.dto.RegisterResponse;
import com.grvapp.backend.user.model.ConfirmationToken;
import com.grvapp.backend.user.model.Role;
import com.grvapp.backend.user.model.User;
import com.grvapp.backend.user.repository.ConfirmationTokenRepository;
import com.grvapp.backend.user.repository.RoleRepository;
import com.grvapp.backend.user.repository.UserRepository;
import com.grvapp.backend.util.PasswordHasher;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordHasher passwordHasher;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;

    private final PasswordEncoder passwordEncoder;
    private final ConfirmationTokenService confirmationTokenService;
    private final EmailService emailService;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        // 1. Verificar duplicados
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException("emailYaRegistrado");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new CustomException("usuarioYaExiste");
        }
        if (userRepository.existsByDocumentNumber(request.getDocumentNumber())) {
            throw new CustomException("documentoYaRegistrado");
        }

        Role defaultRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new CustomException("rolUserNoEncontradoEnBD"));

        // 2. Crear entidad User
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .documentType(request.getDocumentType())
                .documentNumber(request.getDocumentNumber())
                .phone1(request.getPhone1())
                .phone2(request.getPhone2())
                .address(request.getAddress())
                .birthDate(request.getBirthDate())
                .emailVerified(false)
                .enabled(true)
                .accountNonLocked(true)
                .roles(Set.of(defaultRole))
                .build();

        userRepository.save(user);

        // 3. Generar token de confirmación
        ConfirmationToken token = confirmationTokenService.generate(user);

        // 4. Enviar correo con link
        emailService.sendConfirmationEmail(user.getEmail(), token.getToken());

        return new RegisterResponse("userRegisterRevisionMail");
    }

    @Transactional
    public ApiResponse confirmToken(String token) {
        ConfirmationToken confirmationToken = confirmationTokenRepository.findByToken(token)
                .orElseThrow(() -> new CustomException("tokenValidadoKO"));

        if (confirmationToken.isUsed()) {
            return new ApiResponse("tokenValidadoOK");
        }

        if (confirmationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new CustomException("tokenValidadoKO");
        }

        User user = confirmationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        confirmationToken.setUsed(true);
        confirmationTokenRepository.save(confirmationToken);

        return new ApiResponse("tokenValidadoOK");
    }

}
