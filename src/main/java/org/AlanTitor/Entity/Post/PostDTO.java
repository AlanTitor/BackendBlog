package org.AlanTitor.Entity.Post;

import org.AlanTitor.Entity.User.UserEntity;

public class PostDTO {
    long id;
    UserEntity author;
    String title;
    int date;
    String body;


    public PostDTO(UserEntity author, String title, int date, String body) {
        this.author = author;
        this.title = title;
        this.date = date;
        this.body = body;
    }

    public PostDTO() {
    }

    public long getId() {
        return id;
    }
    public int getDate() {
        return date;
    }
    public UserEntity getAuthor() {
        return author;
    }
    public String getBody() {
        return body;
    }
    public String getTitle() {
        return title;
    }

    public void setDate(int date) {
        this.date = date;
    }
    public void setAuthor(UserEntity author) {
        this.author = author;
    }
    public void setBody(String body) {
        this.body = body;
    }
    public void setTitle(String title) {
        this.title = title;
    }
}