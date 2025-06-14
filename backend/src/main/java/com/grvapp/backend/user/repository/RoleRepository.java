package com.grvapp.backend.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.grvapp.backend.user.model.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(String name);
}
