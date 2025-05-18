package org.AlanTitor.Entity;

public class UserDTO {
    //private Long id;
    private String nickName;
    private String password;

    public UserDTO(String nickName, String password){
        this.nickName = nickName;
        this.password = password;
    }
    public UserDTO(){}

    /*public Long getId() {
        return id;
    }*/

    public String getPassword() {
        return password;
    }

    public String getNickName() {
        return nickName;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setNick_name(String nick_name) {
        this.nickName = nick_name;
    }
}
