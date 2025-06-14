
package com.grvapp.backend.user.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.grvapp.backend.user.model.ConfirmationToken;
import com.grvapp.backend.user.model.User;
import com.grvapp.backend.user.repository.ConfirmationTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConfirmationTokenService {

    private final ConfirmationTokenRepository tokenRepository;

    public ConfirmationToken generate(User user) {
        ConfirmationToken token = ConfirmationToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusHours(24))
                .used(false)
                .build();

        return tokenRepository.save(token);
    }

    public Optional<ConfirmationToken> findByToken(String token) {
        return tokenRepository.findByToken(token);
    }

    public void markAsUsed(ConfirmationToken token) {
        token.setUsed(true);
        tokenRepository.save(token);
    }
}
