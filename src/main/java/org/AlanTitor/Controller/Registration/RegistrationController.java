package org.AlanTitor.Controller.Registration;

import org.AlanTitor.Entity.User.UserDTO;
import org.AlanTitor.Service.Register.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class RegistrationController {


    @Autowired
    UserService userService;

    // Эндпоинт регистрации юзера
    @PostMapping("/reg")
    public ResponseEntity<String> getUserDataToRegister(@RequestBody UserDTO userDTO){
        if(userDTO.getNickName() != null && userDTO.getPassword() != null){
            try{
                userService.saveUser(userDTO);
                return new ResponseEntity<>("Registered", HttpStatus.CREATED);
            } catch (Exception e) {
                return new ResponseEntity<>("User already exists", HttpStatus.CONFLICT);
            }
        }
        return new ResponseEntity<>("Incorrect data", HttpStatus.NOT_FOUND);
    }
    // Эндпоинт входа юзера (залогинивание)
    @PostMapping("/login")
    public ResponseEntity<String> getUserDataToLogin(@RequestBody UserDTO userDTO) {
        if(userDTO.getNickName() != null && userDTO.getPassword() != null){
            try{
                userService.getUser(userDTO);
                return new ResponseEntity<>("Logged", HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>("No such user!", HttpStatus.NOT_FOUND);
            }
        }
        return new ResponseEntity<>("Incorrect data", HttpStatus.CONFLICT);
    }
}
