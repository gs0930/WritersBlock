import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import React from 'react';
import { FaTrash } from 'react-icons/fa';

const DisplayPosts = () => {
  const [post, setPost] = useState({});
  const { id } = useParams();
  const [count, setCount] = useState(0);
  const [comments, setComments] = useState('');

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await axios.get(`https://writersblock.onrender.com/posts/${id}`);
        const postData = response.data;
        setPost(postData);
        setCount(postData.likeCount || 0);
        setComments(postData.comments || '');
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
    const newComment = comments.value;
  
    try {
      await axios.post(`http://localhost:5000/posts/update/${id}`, {
        title: post.title, content: post.content, comments: post.comments ? `${post.comments}\n${newComment}` : newComment,
      });
  
      setComments(prevComments => prevComments + '\n' + newComment);
      console.log(newComment);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  
    comments.value = '';
  };

  const handleDeleteComment = (index) => {
    const commentArray = comments.split('\n');
    const updatedComments = [...commentArray];
    updatedComments.splice(index, 1);
    setComments(updatedComments.join('\n'));
  };

  return (
    <div>
      <div className="post">
        <h4 style={{ color: 'white' }}>{post.title}</h4>
        <div className="post-content">
          {post.content}
          {post.image && <img src={post.image} height="300" alt="" />}


        </div>


        <button className="betButton" onClick={updateCount} >👍 Upvotes: {count}</button>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Leave a Comment</label>
        <input type="text" id="comments" name="comments" style={{ maxWidth: '80%' }} />
        <p></p>
        <button type="submit">Submit</button>
      </form>

      <p></p>
      <h3 style={{ textAlign: 'left' }}>Comments</h3>

      {comments !== "" && comments.split('\n').map((comment, index) => (
        <div className="comment" key={index}>
          <h6 style={{ color: 'black', whiteSpace: 'pre-wrap' }}>{comment}</h6>
          <FaTrash className="trash-icon" style={{ color: 'black' }} onClick={() => handleDeleteComment(index)} />
        </div>
      ))}

    </div>
  );
};

export default DisplayPosts;
