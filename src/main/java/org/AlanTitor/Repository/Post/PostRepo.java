package org.AlanTitor.Repository.Post;

import org.AlanTitor.Entity.Post.PostEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepo extends CrudRepository<PostEntity, Long> {
}
