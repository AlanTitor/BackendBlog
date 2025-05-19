package org.AlanTitor.Entity;

public class PostEntity {
    Long id;
    int date;
    UserEntity user;

    public Long getId() {
        return id;
    }
    public int getDate() {
        return date;
    }
    public UserEntity getUser() {
        return user;
    }

    public void setDate(int date) {
        this.date = date;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }
}
