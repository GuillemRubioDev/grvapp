package com.grvapp.backend.user.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Duration;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_session_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSessionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User user;

    private LocalDateTime loginAt;
    private LocalDateTime logoutAt;

    private boolean expired; // true si se desconectó por token vencido

    @Column(length = 50)
    private String ipAddress;

    @Column(length = 100)
    private String userAgent;

    public Duration getSessionDuration() {
        if (loginAt != null && logoutAt != null) {
            return Duration.between(loginAt, logoutAt);
        }
        return Duration.ZERO;
    }
}
