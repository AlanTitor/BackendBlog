package org.AlanTitor.Entity;

import jakarta.persistence.*;

@Entity
@Table(name="userReg")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name")
    private String nickName;
    @Column(name = "password")
    private String password;

    public UserEntity(String nickName, String password){
        this.nickName = nickName;
        this.password = password;
    }

    public UserEntity(){
    }

    public Long getId() {
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

    public void setNick_name(String nick_name) {
        this.nickName = nick_name;
    }
}
