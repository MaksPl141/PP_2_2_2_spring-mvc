package ru.kata.spring.boot_security.demo.service;

import ru.kata.spring.boot_security.demo.dto.UserDto;
import ru.kata.spring.boot_security.demo.model.User;
import java.util.List;


public interface UserService {
    List<UserDto> getAllUsers();

    UserDto getUserById(Long id);

    void saveUser(UserDto userDto);

    void updateUser(Long id, UserDto userDto);

    void deleteUser(Long id);

    UserDto findByUsername(String username);
}