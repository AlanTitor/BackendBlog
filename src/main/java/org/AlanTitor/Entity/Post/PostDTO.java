package org.AlanTitor.Entity.Post;

import org.AlanTitor.Entity.User.UserEntity;

public class PostDTO {
    long id;
    UserEntity author;
    String title;
    String fullDescription;
    String shortDescription;
    String imageUrl;
    String badgeText;
    String difficulty;
    int groupSize;
    double price;
    int duration;
    String itineraryJson;

    public PostDTO(UserEntity author, String title, String shortDescription, String fullDescription, String imageUrl, String badgeText, String difficulty, int groupSize, double price, int duration, String itineraryJson){
        this.author = author;
        this.title = title;
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