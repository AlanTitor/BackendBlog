package org.AlanTitor.Service.Register;

import org.AlanTitor.Entity.User.UserDTO;
import org.AlanTitor.Entity.User.UserEntity;
import org.AlanTitor.Repository.User.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    UserRepo userRepo;

    // Сохранение всех данных юзера
    public void saveUser(UserDTO userDTO) throws Exception {
        if(!userDTO.getName().isEmpty() && !userDTO.getLastName().isEmpty() && !userDTO.getEmail().isEmpty() && !userDTO.getPassword().isEmpty()){
            if(userRepo.existsByEmail(userDTO.getEmail())){
                throw new Exception("Already exists!");
            }
            userRepo.save(new UserEntity(userDTO.getName(), userDTO.getLastName(), userDTO.getEmail(), userDTO.getPassword()));
        }
    }

    // Получение имейла и пароля и их сравнение с БД
    public void getUser(UserDTO userDTO) throws Exception {
        if(!userDTO.getEmail().isEmpty() && !userDTO.getPassword().isEmpty()){
            if(userRepo.existsByEmail(userDTO.getEmail())){
                UserEntity user = userRepo.findByEmail(userDTO.getEmail());
                if(user.getEmail().equals(userDTO.getEmail()) && user.getPassword().equals(userDTO.getPassword())){
                    return;
                }
                throw new Exception("Wrong data!");
            }
            throw new Exception("Incorrect data!");
        }
    }
}
