package ru.kata.spring.boot_security.demo.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;


@Repository
public class UserRepositoryImpl implements UserRepository {

    private EntityManager entityManager;

    @PersistenceContext
    public void setEntityManager(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public List<User> getAllUsers() {
        return entityManager.createQuery("FROM User", User.class).getResultList();
    }

    @Override
    public void createUser(User user) {
        entityManager.persist(user);
    }

    @Override
    public void updateUser(User user) {
        entityManager.merge(user);
    }

    @Override
    public User readUser(Long id) {
        return entityManager.find(User.class, id);
    }


    @Override
    public void deleteUser(Long id) {
        User user = entityManager.find(User.class, id);
        if (user != null) {
            entityManager.remove(user);
        }
    }

        @Override
        public User findByEmail(String email) {

            return entityManager.createQuery("FROM User WHERE email = :email", User.class)
                    .setParameter("email", email)
                    .getSingleResult();
        }


    @Override
    public User findByUsername(String username) {
        return null;
    }
}