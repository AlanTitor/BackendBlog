package org.AlanTitor.Controller.Post;

import org.AlanTitor.Entity.Post.PostDTO;
import org.AlanTitor.Entity.Post.PostEntity;
import org.AlanTitor.Service.Post.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/post")
public class PostController {

    @Autowired
    private PostService postService;

    // Эндпоинт сохранение поста
    @PostMapping("/save")
    public ResponseEntity<String> savePost(@RequestBody PostDTO postDTO, @RequestParam(value = "name", required = true) String authorName){
        try{
            PostEntity post = postService.createPost(postDTO, authorName);
        }catch(Exception e){
            return new ResponseEntity<>("Data corrupted!", HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>("Created!", HttpStatus.CREATED);
    }

    // Эндпоинт получение списка постов
    @GetMapping("/list")
    public ResponseEntity<?> getPostsList(){
        Map<String, Object> responseStatus = new LinkedHashMap<String, Object>();

        List<PostEntity> postList = postService.getPostsList();

        if(!postList.isEmpty()){
            responseStatus.put("Data", postList);
            return new ResponseEntity<>(responseStatus, HttpStatus.OK);
        }
        return new ResponseEntity<>("No Posts found.", HttpStatus.NOT_FOUND);
    }

    // Эндпоинт получение списка постов
    @GetMapping("/{id}")
    public ResponseEntity<?> getOnePost(@PathVariable("id") long id){

        PostEntity post = postService.getOnePostById(id);

        if(post != null){
            return new ResponseEntity<>(post, HttpStatus.OK);
        }
        return new ResponseEntity<>("No post found.", HttpStatus.NOT_FOUND);
    }
}
