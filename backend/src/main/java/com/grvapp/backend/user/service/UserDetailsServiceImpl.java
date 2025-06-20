package com.grvapp.backend.user.service;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.grvapp.backend.user.model.User;
import com.grvapp.backend.user.repository.UserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

        @Autowired
        private UserRepository userRepository;

        @Override
        public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
                System.out.println("[USER DETAILS SERVICE] Buscando usuario: " + usernameOrEmail);
                User user = userRepository
                                .findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                                .orElseThrow(() -> new UsernameNotFoundException(
                                                "Usuario no encontrado: " + usernameOrEmail));
                System.out.println("[USER DETAILS SERVICE] Usuario encontrado: " + user.getUsername());

                return new org.springframework.security.core.userdetails.User(
                                user.getUsername(),
                                user.getPassword(),
                                user.getRoles().stream()
                                                .map(role -> new SimpleGrantedAuthority(role.getName()))
                                                .collect(Collectors.toList()));
        }
}
