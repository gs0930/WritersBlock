// import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// const Post = props => (
//     <tr>
//       <td>{props.post.username}</td>
//       <td>{props.post.description}</td>
//       <td>{props.exercise.duration}</td>
//       <td>{props.exercise.date.substring(0,10)}</td>
//       <td>
//         <Link to={"/edit/"+props.exercise._id}>edit</Link> | <a href="#" onClick={() => { props.deleteExercise(props.exercise._id) }}>delete</a>
//       </td>
//     </tr>
//   )


import React, { useState, useEffect } from 'react';
import Card from './Card';
import './ReadPosts.css';
import { Link } from 'react-router-dom'
// import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';


const ReadPosts = (props) => {

    const [posts, setPosts] = useState([]);
    const [sortedPosts, setSortedPosts] = useState([]);
    const [sortBy, setSortBy] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');


    useEffect(() => {
        setPosts(props.data);
        // handleSortByNewest();
        async function fetchPosts() {
            try {
              const response = await axios.get('http://localhost:5000/posts/');
              setPosts(response.data);
            } catch (error) {
              console.error('Error fetching posts:', error);
            }
          }
      
          fetchPosts();
        


    }, [props]);

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // function to handle filtering posts based on search query
    const filterPosts = () => {
        console.log("test");
        const filteredPosts = posts.filter((post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSortedPosts(filteredPosts);
    };


    const handleSortByMostPopular = () => {
        setSortBy('most popular');
        setSortedPosts([...posts].sort((a, b) => {
            return b.likeCount - a.likeCount;
        }));
    };


    return (

        

        <div>
           
            <h1>Writers' Block</h1>
        <h5>Share any piece of your writing with the community!</h5>
        {/* <Link to="/"><button className="headerBtn"> Explore Challenges 🔍  </button></Link> */}
        <Link to="/new"><button className="headerBtn"> Create a post  </button></Link>
        {/* <CreatePost /> */}
        {/* <ReadPosts posts={posts} /> */}

            <container className="contain"><input type="text" value={searchQuery} onChange={handleSearchInputChange} placeholder="Search by title" />
            <button onClick={filterPosts}>Search</button></container>
            

            {/* <h1 style={{ color: 'blue' }}>Information</h1> */}
            <container className="contain">
            <button class="btn btn-primary rounded" onClick={handleSortByMostPopular}>Most Popular</button>
            </container>
            <div className="ReadPosts">
            {
               
            }

                {sortedPosts.length > 0 ? 
                    sortedPosts.map((post, index) =>
                        <Card key={post._id} id={post._id}  title={post.title} content={post.content} image={post.image} count={post.likeCount} />
                    ): posts && posts.length > 0 ?
                    posts.map((post, index) =>
                    <Card key={post._id} id={post._id} title={post.title} content={post.content} image={post.image} count={post.likeCount} />
                    ) : <h2>{ }</h2>
                }
            </div>
        </div>

    )
}

export default ReadPosts;