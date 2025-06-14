package com.grvapp.backend.user.model;

import java.time.Duration;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
