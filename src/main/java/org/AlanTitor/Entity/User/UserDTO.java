package org.AlanTitor.Entity.User;

public class UserDTO {
    private long id;
    private String nickName;
    private String password;


    public UserDTO(String nickName, String password){
        this.nickName = nickName;
        this.password = password;
    }
    public UserDTO(){}

    public long getId() {
        return id;
    }

    public String getPassword() {
        return password;
    }
    public String getNickName() {
        return nickName;
    }


    public void setPassword(String password) {
        this.password = password;
    }
    public void setNickName(String nickName) {
        this.nickName = nickName;
    }
}
