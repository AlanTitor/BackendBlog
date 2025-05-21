package org.AlanTitor.Entity.User;

public class UserDTO {
    private long id;
    private String name;
    private String lastName;
    private String email;
    private String password;


    public UserDTO(String name, String lastName, String email, String password){
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
    public UserDTO(){}

    public long getId() {
        return id;
    }

    public String getPassword() {
        return password;
    }
    public String getName() {
        return name;
    }
    public String getLastName() {
        return lastName;
    }
    public String getEmail() {
        return email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public void setEmail(String email) {
        this.email = email;
    }
}
