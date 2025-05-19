package org.AlanTitor.Entity.User;

import jakarta.persistence.*;
import org.AlanTitor.Entity.Post.PostEntity;

import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name="userReg")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(name = "name", unique = true)
    private String nickName;
    @Column(name = "password", unique = false)
    private String password;
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    private List<PostEntity> posts = new ArrayList<>();

    public UserEntity(String nickName, String password){
        this.nickName = nickName;
        this.password = password;
    }

    public UserEntity(){
    }

    public long getId() {
        return id;
    }
    public String getPassword() {
        return password;
    }
    public String getNickName() {
        return nickName;
    }
    public List<PostEntity> getPosts() {
        return posts;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    public void setNick_name(String nickName) {
        this.nickName = nickName;
    }

    public void addPost(PostEntity post){
        posts.add(post);
        post.setAuthor(this);
    }
}
