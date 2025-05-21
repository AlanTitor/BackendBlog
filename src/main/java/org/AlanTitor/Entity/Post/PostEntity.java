package org.AlanTitor.Entity.Post;

import jakarta.persistence.*;
import org.AlanTitor.Entity.User.UserEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.Date;


@Entity
@Table(name = "Posts")
public class PostEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    @JsonBackReference
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    UserEntity author;

    @Column(name = "Title", nullable = false)
    String title;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "Date", nullable = false)
    Date date;

    @Column(name = "shortDescription", nullable = true, length = 150)
    String shortDescription;

    @Column(name = "fullDescription", nullable = true)
    String fullDescription;



    public PostEntity(UserEntity author, String title, Date date, String shortDescription, String fullDescription){
        this.author = author;
        this.title = title;
        this.date = date;
        this.shortDescription = shortDescription;
        this.fullDescription = fullDescription;
    }

    public PostEntity(){}

    public long getId() {
        return id;
    }
    public Date getDate() {
        return date;
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

    public void setDate(Date date) {
        this.date = date;
    }
    public void setAuthor(UserEntity author) {
        this.author = author;
    }
    public void setFullDescription(String FullDescription) {
        this.fullDescription = FullDescription;
    }
    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
