package org.AlanTitor.Entity.User;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.AlanTitor.Entity.Post.PostEntity;

import java.util.List;


@Entity
@Table(name="userReg")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name", unique = false)
    private String name;

    @Column(name = "lastname", unique = false)
    private String lastName;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "password", unique = false)
    private String password;

    @JsonManagedReference
    @OneToMany(mappedBy = "author", cascade=CascadeType.ALL, fetch=FetchType.LAZY)
    private List<PostEntity> posts;

    public UserEntity(String name, String lastName, String email, String password){
        this.name = name;
        this.lastName = lastName;
        this.email = email;
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
    public String getName() {
        return name;
    }
    public String getLastName() {
        return lastName;
    }
    public String getEmail() {
        return email;
    }

    public List<PostEntity> getPosts() {
        return posts;
    }


    public void setPassword(String password) {
        this.password = password;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public void addPost(PostEntity post){
        posts.add(post);
        post.setAuthor(this);
    }
}
