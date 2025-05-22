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

    @Column(name = "imageUrl", nullable = true)
    String imageUrl;

    @Column(name = "badgeText", nullable = true, length = 50)
    String badgeText;

    @Column(name = "difficulty", nullable = true, length = 50)
    String difficulty;

    @Column(name = "groupSize", nullable = true, length = 50)
    int groupSize;

    @Column(name = "price", nullable = true, length = 50)
    double price;

    @Column(name = "duration", nullable = true, length = 50)
    int duration;

    @Lob
    @Column(name = "itineraryJson", nullable = true, columnDefinition = "TEXT")
    String itineraryJson; // HTML-разметка для программы тура

    public PostEntity(UserEntity author, String title, Date date, String shortDescription, String fullDescription, String imageUrl, String badgeText, String difficulty, int groupSize, double price, int duration, String itineraryJson){
        this.author = author;
        this.title = title;
        this.date = date;
        this.shortDescription = shortDescription;
        this.fullDescription = fullDescription;
        this.imageUrl = imageUrl;
        this.badgeText = badgeText;
        this.difficulty = difficulty;
        this.groupSize = groupSize;
        this.price = price;
        this.duration = duration;
        this.itineraryJson = itineraryJson;
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
    public String getBadgeText() {
        return badgeText;
    }
    public String getDifficulty() {
        return difficulty;
    }
    public int getDuration() {
        return duration;
    }
    public int getGroupSize() {
        return groupSize;
    }
    public String getImageUrl() {
        return imageUrl;
    }
    public double getPrice() {
        return price;
    }
    public String getItineraryJson() {
        return itineraryJson;
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
    public void setBadgeText(String badgeText) {
        this.badgeText = badgeText;
    }
    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }
    public void setDuration(int duration) {
        this.duration = duration;
    }
    public void setGroupSize(int groupSize) {
        this.groupSize = groupSize;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    public void setPrice(double price) {
        this.price = price;
    }
    public void setItineraryJson(String itineraryJson) {
        this.itineraryJson = itineraryJson;
    }
}
