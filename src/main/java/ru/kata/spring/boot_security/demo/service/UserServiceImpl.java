package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.dto.RoleDto;
import ru.kata.spring.boot_security.demo.dto.UserDto;
import ru.kata.spring.boot_security.demo.repository.UserRepository;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.model.Role;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user Id:" + id));
    }

    @Override
    public void saveUser(UserDto userDto) {
        User user = convertToEntity(userDto);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Override
    public void updateUser(Long id, UserDto userDto) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User with Id: " + id + " not found"));

        existingUser.setUsername(userDto.getUsername());
        existingUser.setLastname(userDto.getLastname());
        existingUser.setEmail(userDto.getEmail());
        existingUser.setAge(userDto.getAge());

        if (userDto.getPassword() != null && !userDto.getPassword().isBlank()) {
            if (!passwordEncoder.matches(userDto.getPassword(), existingUser.getPassword())) {
                existingUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
            }
        }

        Set<Role> managedRoles = fetchRolesFromDto(userDto.getRoles());
        existingUser.setRoles(managedRoles);

        userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.getRoles().clear();
        userRepository.delete(user);
    }

    @Override
    public UserDto findByUsername(String username) {
        return Optional.ofNullable(userRepository.findByUsername(username))
                .map(this::convertToDto)
                .orElse(null);
    }

    // ----- DTO ↔ ENTITY conversion -----

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setLastname(user.getLastname());
        dto.setEmail(user.getEmail());
        dto.setAge(user.getAge());
        dto.setPassword(null); // never expose password
        dto.setRoles(user.getRoles().stream()
                .map(role -> new RoleDto(role.getId(), role.getName()))
                .collect(Collectors.toSet()));
        return dto;
    }

    private User convertToEntity(UserDto dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setLastname(dto.getLastname());
        user.setEmail(dto.getEmail());
        user.setAge(dto.getAge());
        user.setPassword(dto.getPassword());
        user.setRoles(fetchRolesFromDto(dto.getRoles()));
        return user;
    }

    private Set<Role> fetchRolesFromDto(Set<RoleDto> roleDtos) {
        if (roleDtos == null || roleDtos.isEmpty()) {
            throw new IllegalArgumentException("User must have at least one role");
        }
        return roleDtos.stream()
                .map(dto -> roleRepository.findById(dto.getId())
                        .orElseThrow(() -> new IllegalArgumentException("Role with id " + dto.getId() + " not found")))
                .collect(Collectors.toSet());
    }
}