package org.AlanTitor.Controller.Post;

import org.AlanTitor.Entity.Post.PostDTO;
import org.AlanTitor.Entity.Post.PostEntity;
import org.AlanTitor.Entity.User.UserEntity;
import org.AlanTitor.Service.Post.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping("/post")
    public ResponseEntity<String> createPost(@RequestBody PostDTO postDTO, UserEntity userEntity){
        PostEntity post = postService.createPost(postDTO, postDTO.getAuthor().getNickName());
        return new ResponseEntity<>("Created!", HttpStatus.CREATED);
    }


}
