import React, { useEffect, useState } from 'react';
import './Card.css';
import more from './more.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useRoutes } from 'react-router-dom';


const Card = (props) => {
  const [post, setPost] = useState({});
  const { id } = useParams();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await axios.get(`https://writersblock.onrender.com/posts/${props.id}`);
        const postData = response.data[0];
        setPost(postData);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    }

    fetchPost();
  }, [id]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const MAX_CHARACTERS = 120;
  // Check if the content exceeds the maximum number of words
  const isOverflowing = props.content.length > MAX_CHARACTERS;

  // Determine the displayed content based on the expanded state
  const displayedContent = expanded ? props.content : props.content.slice(0, MAX_CHARACTERS);


  return (

    <Link to={'display/' + props.id} style={{ textDecoration: 'none' }}>
      <div className="Card">
        <Link to={'edit/' + props.id}>
          <img className="moreButton" alt="edit button" src={more} />
        </Link>
        <h2 className="title">{props.title}</h2>
        <div className="content">{displayedContent}
          {isOverflowing && !expanded && (
            <>
              ...
              <a href="#" onClick={toggleExpanded} style={{textDecoration: 'none'}}><span style={{color: '#b1fcec'}}> Read More</span></a>            </>
          )}</div>
        <h2 className="count">{props.count} upvotes</h2>
      </div>
    </Link>
  );
};

export default Card;
