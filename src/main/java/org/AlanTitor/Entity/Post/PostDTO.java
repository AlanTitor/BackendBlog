package org.AlanTitor.Entity.Post;

import org.AlanTitor.Entity.User.UserEntity;

public class PostDTO {
    long id;
    UserEntity author;
    String title;
    String fullDescription;
    String shortDescription;

    public PostDTO(UserEntity author, String title, String shortDescription, String fullDescription) {
        this.author = author;
        this.title = title;
        this.shortDescription = shortDescription;
        this.fullDescription = fullDescription;
    }

    public PostDTO() {
    }

    public long getId() {
        return id;
    }
    public UserEntity getAuthor() {
        return author;
    }
    public String getFullDescription() {
        return fullDescription;
    }
    public String getTitle() {
        return title;
    }
    public String getShortDescription() {
        return shortDescription;
    }


    public void setAuthor(UserEntity author) {
        this.author = author;
    }
    public void setFullDescription(String fullDescription) {
        this.fullDescription = fullDescription;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }
}