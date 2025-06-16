package com.grvapp.backend.security.jwt;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtils {

    @Value("${grvapp.jwt.secret}")
    private String jwtSecret;

    @Value("${grvapp.jwt.expirationMs}")
    private int jwtExpirationMs;

    @PostConstruct
    public void printSecret() {
        System.out.println("[DEBUG] JWT_SECRET usado por backend: " + jwtSecret);
    }

    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()), SignatureAlgorithm.HS256)
                .compact();

    }

    public String getUsernameFromJwtToken(String token) {
        System.out.println("[DEBUG] getUsernameFromJwtToken - JWT_SECRET: " + jwtSecret);
        System.out.println("[DEBUG] getUsernameFromJwtToken - Token recibido: " + token);
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateJwtToken(String token) {
        System.out.println("[DEBUG] validateJwtToken - JWT_SECRET: " + jwtSecret);
        System.out.println("[DEBUG] validateJwtToken - Token recibido: " + token);
        try {
            Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            System.err.println("JWT Error: " + e.getMessage());
        }
        return false;
    }
}
