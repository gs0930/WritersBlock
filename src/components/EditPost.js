import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './EditPost.css';

const EditPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState({
    title: '',
    content: '',
    image: ''
  });

  useEffect(() => {
    axios.get(`https://writersblock.onrender.com/posts/${id}`)
      .then(response => {
        const { title, content, image } = response.data;
        setPost({
          title,
          content,
          image
        });
      })
      .catch(error => {
        console.log(error);
      });

      // fetchPost();
  }, [id]);

  const onChangeTitle = (e) => {
    setPost({ ...post, title: e.target.value });
  };

  const onChangeContent = (e) => {
    setPost({ ...post, content: e.target.value });
  };

  const onChangeImage = (e) => {
    setPost({ ...post, image: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const updatedPost = {
      title: post.title,
      content: post.content,
      image: post.image
    };

    console.log(updatedPost);

    axios.post(`https://writersblock.onrender.com/posts/update/${id}`, updatedPost)
      .then(res => console.log(res.data))
      .catch(error => console.log(error));

    window.location = '/';
  };

  const deletePost = () => {
    axios.delete(`https://writersblock.onrender.com/posts/${id}`)
      .then(res => console.log(res.data))
      .catch(error => console.log(error));

    window.location = '/';
  };

  return (
    <div>
      <h3>Edit Post</h3>
      <form onSubmit={onSubmit}>
        <label>Title</label>
        <input type="text" required value={post.title} onChange={onChangeTitle} />
        <br />

        <label>Content</label>
        <textarea rows="5" required id="content" value={post.content} onChange={onChangeContent} /><br />
        <br />

        <label>Image Link (Optional)</label>
        <input type="text" className="image" value={post.image} onChange={onChangeImage} />
        <br />

        <input type="submit" value="Edit Post" className="btn btn-primary" />
        <button className="deleteButton" onClick={deletePost}>Delete</button>
      </form>
    </div>
  );
};

export default EditPost;
