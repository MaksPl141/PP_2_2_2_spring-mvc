package ru.kata.spring.boot_security.demo;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer {
    private final UserService userService;
    private final RoleService roleService;

    public DataInitializer(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostConstruct
    public void init() {
        try {
            if (userService. getAllUsers().isEmpty()) {
                Role roleAdmin = new Role("ROLE_ADMIN");
                Role roleUser = new Role("ROLE_USER");

                roleService.saveRole(roleAdmin);
                roleService.saveRole(roleUser);

                User admin = new User("admin", "admin", 29, "admin@admin.com");
                admin.setPassword("admin");
                Set<Role> adminRoles = new HashSet<>();
                adminRoles.add(roleAdmin);
                admin.setRoles(adminRoles);

                User user = new User("test_user", "test_user", 18, "test@test.com");
                user.setPassword("user");
                Set<Role> userRoles = new HashSet<>();
                userRoles.add(roleUser);
                user.setRoles(userRoles);

                userService.saveUser(admin);
                userService.saveUser(user);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}