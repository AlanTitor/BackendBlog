package org.AlanTitor.Repository.User;

import org.AlanTitor.Entity.User.UserEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends CrudRepository<UserEntity, Long> {
    UserEntity findById(long id);
    boolean existsByNickName(String name);
    UserEntity findByNickName(String name);
}
