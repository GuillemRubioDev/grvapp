package com.grvapp.backend.user.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.grvapp.backend.common.dto.ApiResponse;
import com.grvapp.backend.common.dto.ApiResponseLoginTrys;
import com.grvapp.backend.common.exception.CustomException;
import com.grvapp.backend.enums.DocumentType;
import com.grvapp.backend.security.jwt.JwtUtils;
import com.grvapp.backend.user.dto.LoginRequest;
import com.grvapp.backend.user.dto.LoginResponse;
import com.grvapp.backend.user.dto.RegisterRequest;
import com.grvapp.backend.user.dto.RegisterResponse;
import com.grvapp.backend.user.model.ConfirmationToken;
import com.grvapp.backend.user.model.Role;
import com.grvapp.backend.user.model.User;
import com.grvapp.backend.user.repository.ConfirmationTokenRepository;
import com.grvapp.backend.user.repository.RoleRepository;
import com.grvapp.backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    public static final String ANSI_BLUE = "\u001B[34m";
    public static final String ANSI_RESET = "\u001B[0m";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;

    private final PasswordEncoder passwordEncoder;
    private final ConfirmationTokenService confirmationTokenService;
    private final EmailService emailService;

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

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

        DocumentType docType = null;
        if (request.getDocumentType() != null && !request.getDocumentType().isBlank()) {
            try {
                docType = DocumentType.valueOf(request.getDocumentType());
            } catch (IllegalArgumentException e) {
                throw new CustomException("tipoDocumentoInvalido");
            }
        }

        // 2. Crear entidad User
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .documentType(docType)
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

    public ResponseEntity<?> login(LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(new ApiResponse("usuarioOContrasenyaIncorrecto"));
        }
        User user = userOpt.get();

        // 1. ¿Está bloqueado?
        if (isUserLocked(user)) {
            long minutes = getMinutesToUnlock(user);
            return ResponseEntity.status(423)
                    .body(new ApiResponseLoginTrys("usuarioBloqueadoEspere", 0));
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            // Login correcto, resetear intentos
            resetFailedAttempts(user.getUsername());

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            Set<String> roles = userDetails.getAuthorities().stream()
                    .map(auth -> auth.getAuthority())
                    .collect(Collectors.toSet());
            String jwt = jwtUtils.generateJwtToken(authentication);

            return ResponseEntity.ok(new LoginResponse(jwt, roles));
        } catch (Exception e) {
            // Login incorrecto, sumar intentos
            increaseFailedAttempts(user.getUsername());
            User updatedUser = userRepository.findByUsername(user.getUsername()).get();
            int remaining = getRemainingAttempts(updatedUser);
            if (remaining == 0) {
                long minutes = getMinutesToUnlock(updatedUser);
                return ResponseEntity.status(423)
                        .body(new ApiResponseLoginTrys("usuarioBloqueadoEspere", 0));
            } else {
                return ResponseEntity.status(401)
                        .body(new ApiResponseLoginTrys("usuarioOContrasenyaIncorrecto", remaining));
            }
        }
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

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final long LOCK_TIME_DURATION = 15; // minutos

    public void increaseFailedAttempts(String username) {
        userRepository.findByUsername(username).ifPresent(user -> {
            System.out.println(ANSI_BLUE + "[LOGIN] intentos BD " + user.getFailedAttempts() + ANSI_RESET);
            int newAttempts = user.getFailedAttempts() + 1;
            user.setFailedAttempts(newAttempts);
            System.out.println(ANSI_BLUE + "[LOGIN] Intento fallido para usuario: " + username +
                    " | Intentos: " + newAttempts + ANSI_RESET);
            if (newAttempts >= 5) {
                user.setAccountNonLocked(false);
                user.setLockTime(LocalDateTime.now());
                System.out.println(ANSI_BLUE + "[LOGIN] Usuario bloqueado: " + username + ANSI_RESET);
            }
            userRepository.save(user);
        });
    }

    public void resetFailedAttempts(String username) {
        userRepository.findByUsername(username).ifPresent(user -> {
            user.setFailedAttempts(0);
            user.setAccountNonLocked(true);
            user.setLockTime(null);
            System.out
                    .println(ANSI_BLUE + "[LOGIN] Intentos fallidos reseteados para usuario: " + username + ANSI_RESET);
            userRepository.save(user);
        });
    }

    public boolean unlockWhenTimeExpired(User user) {
        if (user.getLockTime() == null)
            return false;
        LocalDateTime unlockTime = user.getLockTime().plusMinutes(LOCK_TIME_DURATION);
        if (LocalDateTime.now().isAfter(unlockTime)) {
            user.setAccountNonLocked(true);
            user.setLockTime(null);
            user.setFailedAttempts(0);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public boolean isUserLocked(User user) {
        if (!user.isAccountNonLocked()) {
            // Si ha pasado el tiempo de bloqueo, desbloquea
            if (user.getLockTime() != null &&
                    user.getLockTime().plusMinutes(15).isBefore(LocalDateTime.now())) {
                user.setAccountNonLocked(true);
                user.setLockTime(null);
                user.setFailedAttempts(0);
                userRepository.save(user);
                return false;
            }
            return true;
        }
        return false;
    }

    public int getRemainingAttempts(User user) {
        return Math.max(0, 5 - user.getFailedAttempts());
    }

    public long getMinutesToUnlock(User user) {
        if (user.getLockTime() == null)
            return 0;
        long minutes = java.time.Duration.between(LocalDateTime.now(), user.getLockTime().plusMinutes(15)).toMinutes();
        return Math.max(0, minutes);
    }

}
