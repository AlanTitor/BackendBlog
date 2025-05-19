package org.AlanTitor.Service.Post;

import org.AlanTitor.Entity.Post.PostDTO;
import org.AlanTitor.Entity.Post.PostEntity;
import org.AlanTitor.Entity.User.UserEntity;
import org.AlanTitor.Repository.Post.PostRepo;
import org.AlanTitor.Repository.User.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostService {

    @Autowired
    private PostRepo postRepo;
    @Autowired
    private UserRepo userRepo;

    public PostEntity createPost(PostDTO postDTO, String author){
        UserEntity user = userRepo.findByNickName(postDTO.getAuthor().getNickName());

        PostEntity post = new PostEntity(user, postDTO.getTitle(), postDTO.getDate(), postDTO.getBody());

        //user.addPost(post);

        return postRepo.save(post);
    }


}
