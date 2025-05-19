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

    public void saveUser(UserDTO userDTO) throws Exception {
        if(userDTO.getNickName() != null && userDTO.getPassword() != null){
            if(userRepo.existsByNickName(userDTO.getNickName())){
                throw new Exception("Already exists!");
            }
            userRepo.save(new UserEntity(userDTO.getNickName(), userDTO.getPassword()));
        }
    }

    public void getUser(UserDTO userDTO) throws Exception {
        if(userDTO.getNickName() != null && userDTO.getPassword() != null){
            if(userRepo.existsByNickName(userDTO.getNickName())){
                UserEntity user = userRepo.findByNickName(userDTO.getNickName());
                if(user.getNickName().equals(userDTO.getNickName()) && user.getPassword().equals(userDTO.getPassword())){
                    return;
                }
                throw new Exception("Wrong data!");
            }
            throw new Exception("Incorrect data!");
        }
    }
}
