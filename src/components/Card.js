import React, { useEffect, useState } from 'react';
import './Card.css';
import more from './more.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {  useRoutes } from 'react-router-dom';


const Card = (props) => {
  const [post, setPost] = useState({});
  const { id } = useParams();

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await axios.get(`http://localhost:5000/posts/${props.id}`);
        const postData = response.data[0];
        setPost(postData);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    }

    fetchPost();
  }, [id]);

  return (
    
    <Link to={'display/' + props.id} style={{ textDecoration: 'none' }}>
      <div className="Card">
        <Link to={'edit/' + props.id}>
          <img className="moreButton" alt="edit button" src={more} />
        </Link>
        <h2 className="title">{props.title}</h2>
        <div className="content">{props.content}</div>
        <h2 className="count">{props.count} upvotes</h2>
      </div>
    </Link>
  );
};

export default Card;
