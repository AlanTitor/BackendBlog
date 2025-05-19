package org.AlanTitor.Entity.Post;

import jakarta.persistence.*;
import org.AlanTitor.Entity.User.UserEntity;

@Entity
@Table(name = "Posts")
public class PostEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;
    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    UserEntity author;
    @Column(name = "Title", nullable = false)
    String title;
    @Column(name = "Date", nullable = false)
    int date;
    @Column(name = "Body", nullable = true)
    String body;


    public PostEntity(UserEntity author, String title, int date, String body){
        this.author = author;
        this.title = title;
        this.date = date;
        this.body = body;
    }

    public PostEntity(){}

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
