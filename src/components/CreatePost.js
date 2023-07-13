import React, { useState } from 'react';
import axios from 'axios';
import './CreatePost.css';

const CreatePost = () => {
  const [post, setPost] = useState({ title: '', content: '', image: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      axios.post('http://localhost:5000/posts/add', post); // Assuming the endpoint is /posts
      window.location = '/';
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPost((prevPost) => ({ ...prevPost, [name]: value }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label> <br />
        <input type="text" id="title" name="title" value={post.title} onChange={handleInputChange} required /><br />
        <br />

        <label htmlFor="content">Content</label><br />
        {/* <input class = "contentInput" type="text" id="content" name="content" value={post.content} onChange={handleInputChange} /><br /> */}
        <textarea rows="5" id="content" name="content" value={post.content} onChange={handleInputChange} /><br />
        
        <br />

        <label htmlFor="image">Image Link (Optional) </label>
        <input type="text" id="image" name="image" value={post.image} onChange={handleInputChange} /><br />

        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default CreatePost;
