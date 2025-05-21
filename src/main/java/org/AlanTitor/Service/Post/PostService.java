package org.AlanTitor.Service.Post;

import org.AlanTitor.Entity.Post.PostDTO;
import org.AlanTitor.Entity.Post.PostEntity;
import org.AlanTitor.Entity.User.UserEntity;
import org.AlanTitor.Repository.Post.PostRepo;
import org.AlanTitor.Repository.User.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepo postRepo;
    @Autowired
    private UserRepo userRepo;

    // Сохранение поста в БД
    public PostEntity createPost(PostDTO postDTO, String authorEmail) throws Exception {

        if(authorEmail.isEmpty() || postDTO.getTitle().isEmpty()){
            throw new Exception("Incorrect data");
        }

        UserEntity user = userRepo.findByEmail(authorEmail);

        if(user == null){
            throw new Exception("User isn't found");
        }

        PostEntity post = new PostEntity(user, postDTO.getTitle(), new Date(), postDTO.getShortDescription(), postDTO.getFullDescription());
        user.addPost(post);

        return postRepo.save(post);
    }

    // Получение всех постов как список
    public List<PostEntity> getPostsList(){
        return (List<PostEntity>) postRepo.findAll();
    }

    public PostEntity getOnePostById(long id){
        return postRepo.findById(id).get();
    }

}
