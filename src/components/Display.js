import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import React from 'react';

const DisplayPosts = () => {
  const [post, setPost] = useState({});
  const { id } = useParams();
  const [count, setCount] = useState(0);
  const [comments, setComments] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await axios.get(`http://localhost:5000/posts/${id}`);
        const postData = response.data;
        setPost(postData);
        setCount(postData.likeCount || 0);
        setComments(postData.comments || "");
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    }

    fetchPost();
  }, [id]);

  const updateCount = async (event) => {
    event.preventDefault();
    setCount((count) => count + 1);
    const updatedCount = count + 1;

    try {
      await axios.post(`http://localhost:5000/posts/update/${id}`, { title: post.title, content: post.content, likeCount: updatedCount });
    } catch (error) {
      console.error('Error updating count:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { comments } = event.target.elements;

    try {
      await axios.post(`http://localhost:5000/posts/update/${id}`, {
        title: post.title, content: post.content, comments: post.comments ? `${post.comments}\n${comments.value}` : comments.value,
      });

      setComments(prevComments => prevComments + '\n' + comments.value);
      comments.value = '';
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div>
      <div>
        <h2 style={{ color: 'white' }}>{post.title}</h2>
        <h5 style={{ color: 'white' }}>{post.content}</h5>
        {post.image && <img src={post.image} height="300" alt="" />}
        <h6 style={{ color: 'white', whiteSpace: 'pre-wrap' }}>{comments}</h6>
      </div>
    
      <button className="betButton" onClick={updateCount} >👍 Upvotes: {count}</button>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Leave a Comment</label>
        <input type="text" id="comments" name="comments" defaultValue={comments} />
        <p></p>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default DisplayPosts;

