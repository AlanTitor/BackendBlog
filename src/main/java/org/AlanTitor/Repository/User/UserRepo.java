package org.AlanTitor.Repository.User;

import org.AlanTitor.Entity.User.UserEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends CrudRepository<UserEntity, Long> {
    UserEntity findById(long id);
    boolean existsByName(String name);
    UserEntity findByName(String name);

    boolean existsByEmail(String email);
    UserEntity findByEmail(String email);
}
